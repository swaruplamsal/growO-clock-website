"""
Views for the financial_planning app.
"""

from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from .models import FinancialPlan, FinancialGoal, Income, Expense, Asset, Liability
from .serializers import (
    FinancialPlanSerializer,
    FinancialPlanListSerializer,
    FinancialPlanCreateSerializer,
    FinancialGoalSerializer,
    IncomeSerializer,
    ExpenseSerializer,
    AssetSerializer,
    LiabilitySerializer,
    CompoundInterestSerializer,
    RetirementSerializer,
    LoanCalculatorSerializer,
    InvestmentGrowthSerializer,
    TaxEstimationSerializer,
)
from .calculators import (
    calculate_compound_interest,
    calculate_retirement_needs,
    calculate_loan_payment,
    project_investment_growth,
    estimate_tax,
)
from utils.permissions import IsOwnerOrAdmin


@extend_schema(tags=['Financial Plans'])
class FinancialPlanViewSet(viewsets.ModelViewSet):
    """ViewSet for managing financial plans."""
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']

    def get_serializer_class(self):
        if self.action == 'list':
            return FinancialPlanListSerializer
        if self.action == 'create':
            return FinancialPlanCreateSerializer
        return FinancialPlanSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'ADMIN':
            return FinancialPlan.objects.all().select_related('user', 'advisor')
        return FinancialPlan.objects.filter(user=user).select_related('user', 'advisor')

    # ──── Nested CRUD for Goals ────

    @action(detail=True, methods=['get', 'post'], url_path='goals')
    def goals(self, request, pk=None):
        plan = self.get_object()
        if request.method == 'GET':
            goals = plan.goals.all()
            serializer = FinancialGoalSerializer(goals, many=True)
            return Response({'success': True, 'data': serializer.data})

        serializer = FinancialGoalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(plan=plan)
        return Response(
            {'success': True, 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=['put', 'delete'],
            url_path='goals/(?P<goal_id>[^/.]+)')
    def goal_detail(self, request, pk=None, goal_id=None):
        plan = self.get_object()
        try:
            goal = plan.goals.get(id=goal_id)
        except FinancialGoal.DoesNotExist:
            return Response(
                {'success': False, 'message': 'Goal not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if request.method == 'DELETE':
            goal.delete()
            return Response(
                {'success': True, 'message': 'Goal deleted.'},
                status=status.HTTP_204_NO_CONTENT,
            )

        serializer = FinancialGoalSerializer(goal, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'success': True, 'data': serializer.data})

    # ──── Nested CRUD for Incomes ────

    @action(detail=True, methods=['get', 'post'], url_path='incomes')
    def incomes(self, request, pk=None):
        plan = self.get_object()
        if request.method == 'GET':
            serializer = IncomeSerializer(plan.incomes.all(), many=True)
            return Response({'success': True, 'data': serializer.data})

        serializer = IncomeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(plan=plan)
        return Response(
            {'success': True, 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )

    # ──── Nested CRUD for Expenses ────

    @action(detail=True, methods=['get', 'post'], url_path='expenses')
    def expenses(self, request, pk=None):
        plan = self.get_object()
        if request.method == 'GET':
            serializer = ExpenseSerializer(plan.expenses.all(), many=True)
            return Response({'success': True, 'data': serializer.data})

        serializer = ExpenseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(plan=plan)
        return Response(
            {'success': True, 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )

    # ──── Nested CRUD for Assets ────

    @action(detail=True, methods=['get', 'post'], url_path='assets')
    def assets(self, request, pk=None):
        plan = self.get_object()
        if request.method == 'GET':
            serializer = AssetSerializer(plan.assets.all(), many=True)
            return Response({'success': True, 'data': serializer.data})

        serializer = AssetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(plan=plan)
        return Response(
            {'success': True, 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )

    # ──── Nested CRUD for Liabilities ────

    @action(detail=True, methods=['get', 'post'], url_path='liabilities')
    def liabilities(self, request, pk=None):
        plan = self.get_object()
        if request.method == 'GET':
            serializer = LiabilitySerializer(plan.liabilities.all(), many=True)
            return Response({'success': True, 'data': serializer.data})

        serializer = LiabilitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(plan=plan)
        return Response(
            {'success': True, 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )


# ──────────────────── Calculator Views ────────────────────

@extend_schema(tags=['Calculators'])
class CompoundInterestView(APIView):
    """Calculate compound interest."""
    permission_classes = [permissions.AllowAny]
    serializer_class = CompoundInterestSerializer

    def post(self, request):
        serializer = CompoundInterestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = calculate_compound_interest(
            principal=serializer.validated_data['principal'],
            annual_rate=serializer.validated_data['annual_rate'],
            years=serializer.validated_data['years'],
            compounding_frequency=serializer.validated_data.get('compounding_frequency', 12),
        )
        return Response({'success': True, 'data': result})


@extend_schema(tags=['Calculators'])
class RetirementCalculatorView(APIView):
    """Calculate retirement needs."""
    permission_classes = [permissions.AllowAny]
    serializer_class = RetirementSerializer

    def post(self, request):
        serializer = RetirementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        result = calculate_retirement_needs(
            current_age=d['current_age'],
            retirement_age=d['retirement_age'],
            life_expectancy=d['life_expectancy'],
            annual_expenses=d['annual_expenses'],
            current_savings=d.get('current_savings', 0),
            inflation_rate=d.get('inflation_rate', 3.0),
            expected_return=d.get('expected_return', 8.0),
        )
        return Response({'success': True, 'data': result})


@extend_schema(tags=['Calculators'])
class LoanCalculatorView(APIView):
    """Calculate loan payments."""
    permission_classes = [permissions.AllowAny]
    serializer_class = LoanCalculatorSerializer

    def post(self, request):
        serializer = LoanCalculatorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = calculate_loan_payment(
            principal=serializer.validated_data['principal'],
            annual_rate=serializer.validated_data['annual_rate'],
            years=serializer.validated_data['years'],
        )
        return Response({'success': True, 'data': result})


@extend_schema(tags=['Calculators'])
class InvestmentGrowthView(APIView):
    """Project investment growth."""
    permission_classes = [permissions.AllowAny]
    serializer_class = InvestmentGrowthSerializer

    def post(self, request):
        serializer = InvestmentGrowthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        result = project_investment_growth(
            initial_investment=d['initial_investment'],
            monthly_contribution=d.get('monthly_contribution', 0),
            annual_return=d['annual_return'],
            years=d['years'],
        )
        return Response({'success': True, 'data': result})


@extend_schema(tags=['Calculators'])
class TaxEstimationView(APIView):
    """Estimate tax liability."""
    permission_classes = [permissions.AllowAny]
    serializer_class = TaxEstimationSerializer

    def post(self, request):
        serializer = TaxEstimationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        result = estimate_tax(
            annual_income=d['annual_income'],
            deductions=d.get('deductions', 0),
            filing_status=d.get('filing_status', 'SINGLE'),
        )
        return Response({'success': True, 'data': result})
