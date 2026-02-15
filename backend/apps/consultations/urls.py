"""
URL patterns for the consultations app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConsultationViewSet

router = DefaultRouter()
router.register('', ConsultationViewSet, basename='consultation')

urlpatterns = router.urls
