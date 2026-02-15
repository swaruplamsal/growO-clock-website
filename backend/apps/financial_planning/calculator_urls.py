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

urlpatterns = [
    path('compound-interest/', CompoundInterestView.as_view(), name='calc-compound-interest'),
    path('retirement/', RetirementCalculatorView.as_view(), name='calc-retirement'),
    path('loan/', LoanCalculatorView.as_view(), name='calc-loan'),
    path('investment-growth/', InvestmentGrowthView.as_view(), name='calc-investment-growth'),
    path('tax-estimation/', TaxEstimationView.as_view(), name='calc-tax-estimation'),
]
