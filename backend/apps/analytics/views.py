"""
Views for the analytics app.
"""

from datetime import timedelta

from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from .models import AuditLog, PageView
from .serializers import (
    AuditLogSerializer,
    DashboardStatsSerializer,
    UserAnalyticsSerializer,
)
from utils.permissions import IsAdminUser


@extend_schema(
    tags=['Analytics'],
    responses={200: DashboardStatsSerializer}
)
class DashboardStatsView(APIView):
    """Admin dashboard statistics."""
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get(self, request):
        from apps.accounts.models import User
        from apps.consultations.models import Consultation
        from apps.blog.models import BlogPost
        from apps.contact.models import ContactMessage
        from apps.careers.models import JobApplication

        thirty_days_ago = timezone.now() - timedelta(days=30)

        stats = {
            'total_users': User.objects.count(),
            'active_users': User.objects.filter(is_active=True).count(),
            'total_consultations': Consultation.objects.count(),
            'pending_consultations': Consultation.objects.filter(
                status='PENDING'
            ).count(),
            'total_blog_posts': BlogPost.objects.filter(
                status='PUBLISHED'
            ).count(),
            'total_contact_messages': ContactMessage.objects.count(),
            'new_contact_messages': ContactMessage.objects.filter(
                status='NEW'
            ).count(),
            'total_job_applications': JobApplication.objects.count(),
            'recent_signups': User.objects.filter(
                date_joined__gte=thirty_days_ago
            ).count(),
        }

        serializer = DashboardStatsSerializer(stats)
        return Response(
            {'success': True, 'data': serializer.data},
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=['Analytics'],
    responses={200: UserAnalyticsSerializer}
)
class UserAnalyticsView(APIView):
    """Analytics for the authenticated user."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        from apps.consultations.models import Consultation
        from apps.financial_planning.models import FinancialPlan
        from apps.investments.models import Portfolio
        from apps.documents.models import Document
        from apps.notifications.models import Notification

        data = {
            'total_consultations': Consultation.objects.filter(user=user).count(),
            'total_financial_plans': FinancialPlan.objects.filter(user=user).count(),
            'total_portfolios': Portfolio.objects.filter(user=user).count(),
            'total_documents': Document.objects.filter(user=user).count(),
            'unread_notifications': Notification.objects.filter(
                user=user, is_read=False
            ).count(),
        }

        serializer = UserAnalyticsSerializer(data)
        return Response(
            {'success': True, 'data': serializer.data},
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=['Analytics'],
    responses={200: dict}
)
class ConsultationAnalyticsView(APIView):
    """Consultation analytics (admin only)."""
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get(self, request):
        from apps.consultations.models import Consultation

        thirty_days_ago = timezone.now() - timedelta(days=30)

        by_status = dict(
            Consultation.objects.values_list('status')
            .annotate(count=Count('id'))
            .values_list('status', 'count')
        )

        by_type = dict(
            Consultation.objects.values_list('consultation_type')
            .annotate(count=Count('id'))
            .values_list('consultation_type', 'count')
        )

        recent_count = Consultation.objects.filter(
            created_at__gte=thirty_days_ago
        ).count()

        data = {
            'by_status': by_status,
            'by_type': by_type,
            'total': Consultation.objects.count(),
            'last_30_days': recent_count,
        }

        return Response(
            {'success': True, 'data': data},
            status=status.HTTP_200_OK,
        )


@extend_schema(tags=['Analytics'])
class AuditLogListView(generics.ListAPIView):
    """List audit logs (admin only)."""
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    filterset_fields = ['action', 'resource_type', 'user']
    search_fields = ['description', 'resource_type']
    ordering_fields = ['created_at']

    def get_queryset(self):
        return AuditLog.objects.select_related('user').all()


@extend_schema(
    tags=['Analytics'],
    request={'application/json': {'type': 'object', 'properties': {'path': {'type': 'string'}}}},
    responses={201: dict}
)
class TrackPageViewView(APIView):
    """Track a page view (public endpoint)."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        path = request.data.get('path', '')
        if not path:
            return Response(
                {'success': False, 'message': 'Path is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        PageView.objects.create(
            path=path,
            user=request.user if request.user.is_authenticated else None,
            ip_address=self.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            referrer=request.data.get('referrer', ''),
        )

        return Response(
            {'success': True, 'message': 'Page view tracked.'},
            status=status.HTTP_201_CREATED,
        )

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')
