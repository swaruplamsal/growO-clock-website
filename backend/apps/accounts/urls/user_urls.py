"""
User management URL patterns.
"""

from django.urls import path
from apps.accounts.views import (
    UserMeView,
    UserProfileView,
    UserPreferencesView,
    ChangePasswordView,
    AvatarUploadView,
    DeleteAccountView,
    AdminUserListView,
    AdminUserDetailView,
)

urlpatterns = [
    path('me/', UserMeView.as_view(), name='user-me'),
    path('me/profile/', UserProfileView.as_view(), name='user-profile'),
    path('me/preferences/', UserPreferencesView.as_view(), name='user-preferences'),
    path('me/password/', ChangePasswordView.as_view(), name='user-change-password'),
    path('me/avatar/', AvatarUploadView.as_view(), name='user-avatar'),
    path('me/delete/', DeleteAccountView.as_view(), name='user-delete'),

    # Admin
    path('admin/', AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/<uuid:id>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
]
