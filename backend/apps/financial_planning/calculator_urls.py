"""
URL patterns for financial calculators.
"""

from django.urls import path
from .views import (
    CompoundInterestView,
    RetirementCalculatorView,
    LoanCalculatorView,
    InvestmentGrowthView,
    TaxEstimationView,
)

app_name = 'financial_planning'

urlpatterns = [
    path('compound-interest/', CompoundInterestView.as_view(), name='calculator-compound-interest'),
    path('retirement/', RetirementCalculatorView.as_view(), name='calc-retirement'),
    path('loan/', LoanCalculatorView.as_view(), name='calc-loan'),
    path('investment-growth/', InvestmentGrowthView.as_view(), name='calc-investment-growth'),
    path('tax-estimation/', TaxEstimationView.as_view(), name='calc-tax-estimation'),
]
