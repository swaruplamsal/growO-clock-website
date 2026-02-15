"""
Serializers for the financial_planning app.
"""

from rest_framework import serializers
from .models import FinancialPlan, FinancialGoal, Income, Expense, Asset, Liability


class IncomeSerializer(serializers.ModelSerializer):
    monthly_amount = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = Income
        fields = ['id', 'source', 'amount', 'frequency', 'monthly_amount',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ExpenseSerializer(serializers.ModelSerializer):
    monthly_amount = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = Expense
        fields = ['id', 'category', 'description', 'amount', 'frequency',
                  'monthly_amount', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ['id', 'asset_type', 'description', 'value', 'acquisition_date',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class LiabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Liability
        fields = ['id', 'liability_type', 'description', 'amount', 'interest_rate',
                  'monthly_payment', 'payoff_date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class FinancialGoalSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.DecimalField(
        max_digits=5, decimal_places=2, read_only=True
    )
    remaining_amount = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = FinancialGoal
        fields = ['id', 'name', 'category', 'target_amount', 'current_amount',
                  'target_date', 'priority', 'progress_percentage', 'remaining_amount',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class FinancialPlanSerializer(serializers.ModelSerializer):
    """Full serializer for financial plans with nested data."""
    goals = FinancialGoalSerializer(many=True, read_only=True)
    incomes = IncomeSerializer(many=True, read_only=True)
    expenses = ExpenseSerializer(many=True, read_only=True)
    assets = AssetSerializer(many=True, read_only=True)
    liabilities = LiabilitySerializer(many=True, read_only=True)

    total_income = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )
    total_expenses = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )
    total_assets = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )
    total_liabilities = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )
    net_worth = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = FinancialPlan
        fields = [
            'id', 'user', 'advisor', 'title', 'description', 'status',
            'recommendations', 'goals', 'incomes', 'expenses', 'assets',
            'liabilities', 'total_income', 'total_expenses', 'total_assets',
            'total_liabilities', 'net_worth', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'advisor', 'created_at', 'updated_at']


class FinancialPlanListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for plan listing."""
    goals_count = serializers.IntegerField(source='goals.count', read_only=True)

    class Meta:
        model = FinancialPlan
        fields = [
            'id', 'title', 'description', 'status', 'goals_count',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class FinancialPlanCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialPlan
        fields = ['title', 'description', 'status']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


# ──── Calculator Serializers ────

class CompoundInterestSerializer(serializers.Serializer):
    principal = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)
    annual_rate = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=0)
    years = serializers.IntegerField(min_value=1, max_value=100)
    compounding_frequency = serializers.IntegerField(default=12, min_value=1, max_value=365)


class RetirementSerializer(serializers.Serializer):
    current_age = serializers.IntegerField(min_value=18, max_value=100)
    retirement_age = serializers.IntegerField(min_value=30, max_value=100)
    life_expectancy = serializers.IntegerField(min_value=50, max_value=120)
    annual_expenses = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)
    current_savings = serializers.DecimalField(max_digits=12, decimal_places=2, default=0, min_value=0)
    inflation_rate = serializers.DecimalField(max_digits=5, decimal_places=2, default=3.0)
    expected_return = serializers.DecimalField(max_digits=5, decimal_places=2, default=8.0)


class LoanCalculatorSerializer(serializers.Serializer):
    principal = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)
    annual_rate = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=0)
    years = serializers.IntegerField(min_value=1, max_value=50)


class InvestmentGrowthSerializer(serializers.Serializer):
    initial_investment = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)
    monthly_contribution = serializers.DecimalField(max_digits=12, decimal_places=2, default=0, min_value=0)
    annual_return = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=0)
    years = serializers.IntegerField(min_value=1, max_value=100)


class TaxEstimationSerializer(serializers.Serializer):
    annual_income = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)
    deductions = serializers.DecimalField(max_digits=12, decimal_places=2, default=0, min_value=0)
    filing_status = serializers.ChoiceField(
        choices=[('SINGLE', 'Single'), ('MARRIED', 'Married'), ('BUSINESS', 'Business')],
        default='SINGLE'
    )
