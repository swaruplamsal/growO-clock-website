"""
Views for the investments app.
"""

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from .models import Portfolio, Holding, PortfolioPerformance
from .serializers import (
    PortfolioSerializer,
    PortfolioListSerializer,
    PortfolioCreateSerializer,
    HoldingSerializer,
    PortfolioPerformanceSerializer,
)
from .analytics import get_portfolio_analytics


@extend_schema(tags=['Investments'])
class PortfolioViewSet(viewsets.ModelViewSet):
    """ViewSet for managing investment portfolios."""
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['risk_score']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'total_value', 'name']

    def get_serializer_class(self):
        if self.action == 'list':
            return PortfolioListSerializer
        if self.action == 'create':
            return PortfolioCreateSerializer
        return PortfolioSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'ADMIN':
            return Portfolio.objects.all().select_related('user', 'plan')
        return Portfolio.objects.filter(user=user).select_related('user', 'plan')

    @action(detail=True, methods=['get', 'post'], url_path='holdings')
    def holdings(self, request, pk=None):
        """List or add holdings to a portfolio."""
        portfolio = self.get_object()

        if request.method == 'GET':
            holdings = portfolio.holdings.all()
            serializer = HoldingSerializer(holdings, many=True)
            return Response({'success': True, 'data': serializer.data})

        serializer = HoldingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(portfolio=portfolio)
        portfolio.recalculate_total_value()
        return Response(
            {'success': True, 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=['put', 'delete'],
            url_path='holdings/(?P<holding_id>[^/.]+)')
    def holding_detail(self, request, pk=None, holding_id=None):
        """Update or delete a holding."""
        portfolio = self.get_object()
        try:
            holding = portfolio.holdings.get(id=holding_id)
        except Holding.DoesNotExist:
            return Response(
                {'success': False, 'message': 'Holding not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if request.method == 'DELETE':
            holding.delete()
            portfolio.recalculate_total_value()
            return Response(
                {'success': True, 'message': 'Holding deleted.'},
                status=status.HTTP_204_NO_CONTENT,
            )

        serializer = HoldingSerializer(holding, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        portfolio.recalculate_total_value()
        return Response({'success': True, 'data': serializer.data})

    @action(detail=True, methods=['get'], url_path='performance')
    def performance(self, request, pk=None):
        """Get portfolio performance metrics and history."""
        portfolio = self.get_object()
        analytics = get_portfolio_analytics(portfolio)

        history = portfolio.performance_history.all()[:30]
        history_serializer = PortfolioPerformanceSerializer(history, many=True)

        return Response({
            'success': True,
            'data': {
                'analytics': analytics,
                'history': history_serializer.data,
            },
        })
