"""
URL patterns for the careers app.
"""

from django.urls import path
from .views import (
    JobPositionListView,
    JobPositionDetailView,
    JobApplicationCreateView,
    AdminJobPositionViewSet,
    AdminJobPositionDetailView,
    AdminApplicationListView,
    AdminApplicationDetailView,
)

urlpatterns = [
    # Public
    path('positions/', JobPositionListView.as_view(), name='career-positions'),
    path('positions/<uuid:id>/', JobPositionDetailView.as_view(), name='career-position-detail'),
    path('apply/', JobApplicationCreateView.as_view(), name='career-apply'),

    # Admin
    path('admin/positions/', AdminJobPositionViewSet.as_view(), name='admin-positions'),
    path('admin/positions/<uuid:id>/', AdminJobPositionDetailView.as_view(), name='admin-position-detail'),
    path('admin/applications/', AdminApplicationListView.as_view(), name='admin-applications'),
    path('admin/applications/<uuid:id>/', AdminApplicationDetailView.as_view(), name='admin-application-detail'),
]
