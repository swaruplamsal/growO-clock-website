"""
URL configuration for the notifications app.
"""

from django.urls import path
from . import views

app_name = 'notifications'

urlpatterns = [
    path('', views.NotificationListView.as_view(), name='notification-list'),
    path('unread-count/', views.UnreadCountView.as_view(), name='notification-unread-count'),
    path('mark-all-read/', views.NotificationMarkAllReadView.as_view(), name='notification-mark-all-read'),
    path('<uuid:id>/', views.NotificationDetailView.as_view(), name='notification-detail'),
    path('<uuid:id>/read/', views.NotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('<uuid:id>/delete/', views.NotificationDeleteView.as_view(), name='notification-delete'),
]
