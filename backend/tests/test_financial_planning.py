"""
Tests for the financial planning app.
"""

import pytest
from django.urls import reverse
from rest_framework import status
from apps.financial_planning.models import FinancialPlan
from apps.financial_planning.calculators import (
    compound_interest_calculator,
    retirement_calculator,
    loan_payment_calculator,
    investment_growth_calculator,
    tax_calculator,
)


@pytest.mark.django_db
class TestFinancialPlanModel:
    """Tests for the FinancialPlan model."""

    def test_create_plan(self, user):
        plan = FinancialPlan.objects.create(
            user=user,
            title='My Financial Plan',
            description='Test financial plan',
        )
        assert plan.status == 'DRAFT'
        assert plan.user == user

    def test_plan_net_worth(self, user):
        plan = FinancialPlan.objects.create(
            user=user,
            title='Test Plan',
        )
        # Net worth should be 0 with no assets/liabilities
        assert plan.net_worth == 0


class TestCalculators:
    """Tests for financial calculators."""

    def test_compound_interest(self):
        result = compound_interest_calculator(
            principal=10000,
            annual_rate=10,
            years=5,
            compounds_per_year=12,
        )
        assert 'future_value' in result
        assert result['future_value'] > 10000
        assert 'total_interest' in result

    def test_retirement_calculator(self):
        result = retirement_calculator(
            current_age=30,
            retirement_age=60,
            monthly_expenses=50000,
            inflation_rate=6,
            expected_return=12,
        )
        assert 'corpus_needed' in result
        assert result['corpus_needed'] > 0

    def test_loan_payment(self):
        result = loan_payment_calculator(
            principal=1000000,
            annual_rate=8,
            years=20,
        )
        assert 'monthly_payment' in result
        assert result['monthly_payment'] > 0
        assert 'total_payment' in result

    def test_investment_growth(self):
        result = investment_growth_calculator(
            initial_investment=100000,
            monthly_contribution=10000,
            annual_return=12,
            years=10,
        )
        assert 'future_value' in result
        assert result['future_value'] > 100000

    def test_tax_calculator(self):
        result = tax_calculator(annual_income=1000000)
        assert 'tax_amount' in result
        assert 'effective_rate' in result
        assert result['tax_amount'] >= 0


@pytest.mark.django_db
class TestCalculatorAPI:
    """Tests for calculator API endpoints."""

    def test_compound_interest_endpoint(self, api_client):
        url = reverse('financial_planning:calculator-compound-interest')
        data = {
            'principal': 10000,
            'annual_rate': 10,
            'years': 5,
            'compounds_per_year': 12,
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True

    def test_calculator_missing_fields(self, api_client):
        url = reverse('financial_planning:calculator-compound-interest')
        data = {'principal': 10000}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
