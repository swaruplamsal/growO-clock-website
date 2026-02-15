"""
Tests for the notifications app.
"""

import pytest
from django.urls import reverse
from rest_framework import status
from apps.notifications.models import Notification


@pytest.mark.django_db
class TestNotificationModel:
    """Tests for the Notification model."""

    def test_create_notification(self, user):
        notification = Notification.objects.create(
            user=user,
            title='Test Notification',
            message='This is a test.',
        )
        assert notification.is_read is False
        assert notification.read_at is None
        assert str(notification) == f'Test Notification - {user.email}'

    def test_mark_as_read(self, user):
        notification = Notification.objects.create(
            user=user,
            title='Test',
            message='Test',
        )
        notification.mark_as_read()
        notification.refresh_from_db()
        assert notification.is_read is True
        assert notification.read_at is not None


@pytest.mark.django_db
class TestNotificationAPI:
    """Tests for notification API endpoints."""

    def test_list_notifications(self, authenticated_client, user):
        Notification.objects.create(
            user=user, title='N1', message='M1',
        )
        url = reverse('notifications:notification-list')
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_unread_count(self, authenticated_client, user):
        Notification.objects.create(
            user=user, title='N1', message='M1',
        )
        Notification.objects.create(
            user=user, title='N2', message='M2', is_read=True,
        )
        url = reverse('notifications:notification-unread-count')
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['unread_count'] == 1

    def test_mark_all_read(self, authenticated_client, user):
        Notification.objects.create(user=user, title='N1', message='M1')
        Notification.objects.create(user=user, title='N2', message='M2')
        url = reverse('notifications:notification-mark-all-read')
        response = authenticated_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert Notification.objects.filter(user=user, is_read=False).count() == 0

    def test_notifications_unauthorized(self, api_client):
        url = reverse('notifications:notification-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
