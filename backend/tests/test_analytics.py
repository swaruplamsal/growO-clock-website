"""
Tests for the analytics app.
"""

import pytest
from django.urls import reverse
from rest_framework import status
from apps.analytics.models import AuditLog, PageView


@pytest.mark.django_db
class TestAnalyticsModels:
    """Tests for analytics models."""

    def test_create_audit_log(self, user):
        log = AuditLog.objects.create(
            user=user,
            action='LOGIN',
            resource_type='User',
            description='User logged in',
            ip_address='127.0.0.1',
        )
        assert user.email in str(log)

    def test_create_page_view(self):
        pv = PageView.objects.create(
            path='/api/v1/blog/',
            ip_address='192.168.1.1',
        )
        assert '/api/v1/blog/' in str(pv)


@pytest.mark.django_db
class TestAnalyticsAPI:
    """Tests for analytics API endpoints."""

    def test_dashboard_stats_admin(self, admin_client):
        url = reverse('analytics:dashboard-stats')
        response = admin_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert 'total_users' in response.data['data']

    def test_dashboard_stats_unauthorized(self, authenticated_client):
        url = reverse('analytics:dashboard-stats')
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_user_analytics(self, authenticated_client):
        url = reverse('analytics:user-analytics')
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert 'total_consultations' in response.data['data']

    def test_track_page_view(self, api_client):
        url = reverse('analytics:track-page-view')
        data = {'path': '/services/'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert PageView.objects.count() == 1

    def test_track_page_view_missing_path(self, api_client):
        url = reverse('analytics:track-page-view')
        response = api_client.post(url, {}, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
