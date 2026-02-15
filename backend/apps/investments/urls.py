"""
URL patterns for the investments app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PortfolioViewSet

app_name = 'investments'

router = DefaultRouter()
router.register('portfolios', PortfolioViewSet, basename='portfolio')

urlpatterns = router.urls
