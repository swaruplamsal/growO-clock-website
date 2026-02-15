"""
URL configuration for the analytics app.
"""

from django.urls import path
from . import views

app_name = 'analytics'

urlpatterns = [
    path('dashboard/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    path('user/', views.UserAnalyticsView.as_view(), name='user-analytics'),
    path('consultations/', views.ConsultationAnalyticsView.as_view(), name='consultation-analytics'),
    path('audit-logs/', views.AuditLogListView.as_view(), name='audit-log-list'),
    path('track-page-view/', views.TrackPageViewView.as_view(), name='track-page-view'),
]
