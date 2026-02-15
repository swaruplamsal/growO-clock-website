"""
URL patterns for the financial_planning app (plans).
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FinancialPlanViewSet

router = DefaultRouter()
router.register('', FinancialPlanViewSet, basename='financial-plan')

urlpatterns = router.urls
