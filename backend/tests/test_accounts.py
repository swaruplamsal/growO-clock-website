"""
Tests for the accounts app.
"""

import pytest
from django.urls import reverse
from rest_framework import status


@pytest.mark.django_db
class TestUserRegistration:
    """Tests for user registration."""

    def test_register_success(self, api_client):
        url = reverse('accounts:auth-register')
        data = {
            'email': 'newuser@example.com',
            'password': 'StrongPass123!',
            'password_confirm': 'StrongPass123!',
            'full_name': 'New User',
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['success'] is True

    def test_register_password_mismatch(self, api_client):
        url = reverse('accounts:auth-register')
        data = {
            'email': 'newuser@example.com',
            'password': 'StrongPass123!',
            'password_confirm': 'DifferentPass123!',
            'full_name': 'New User',
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_duplicate_email(self, api_client, user):
        url = reverse('accounts:auth-register')
        data = {
            'email': user.email,
            'password': 'StrongPass123!',
            'password_confirm': 'StrongPass123!',
            'full_name': 'Another User',
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_weak_password(self, api_client):
        url = reverse('accounts:auth-register')
        data = {
            'email': 'newuser@example.com',
            'password': '123',
            'password_confirm': '123',
            'full_name': 'New User',
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestUserLogin:
    """Tests for user login."""

    def test_login_success(self, api_client, user):
        url = reverse('accounts:auth-login')
        data = {
            'email': user.email,
            'password': 'TestPass123!',
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data['data']['tokens']
        assert 'refresh' in response.data['data']['tokens']

    def test_login_wrong_password(self, api_client, user):
        url = reverse('accounts:auth-login')
        data = {
            'email': user.email,
            'password': 'WrongPassword123!',
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_nonexistent_user(self, api_client):
        url = reverse('accounts:auth-login')
        data = {
            'email': 'nonexistent@example.com',
            'password': 'TestPass123!',
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestUserProfile:
    """Tests for user profile endpoints."""

    def test_get_me(self, authenticated_client, user):
        url = reverse('accounts:user-me')
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['email'] == user.email

    def test_get_me_unauthorized(self, api_client):
        url = reverse('accounts:user-me')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_update_profile(self, authenticated_client):
        url = reverse('accounts:user-profile')
        data = {'bio': 'Updated bio text'}
        response = authenticated_client.patch(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK

    def test_change_password(self, authenticated_client):
        url = reverse('accounts:user-change-password')
        data = {
            'old_password': 'TestPass123!',
            'new_password': 'NewStrongPass456!',
            'new_password_confirm': 'NewStrongPass456!',
        }
        response = authenticated_client.put(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestUserModel:
    """Tests for the User model."""

    def test_user_creation(self, user):
        assert user.email == 'test@example.com'
        assert user.check_password('TestPass123!')
        assert user.is_active
        assert not user.is_staff

    def test_user_str(self, user):
        assert str(user) == user.email

    def test_user_full_name(self, user):
        assert user.full_name == 'Test User'

    def test_superuser_creation(self, admin_user):
        assert admin_user.is_staff
        assert admin_user.is_superuser
