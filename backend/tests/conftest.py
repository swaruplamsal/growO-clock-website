"""
pytest configuration for the project.
"""

import pytest
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    """Return an API client instance."""
    return APIClient()


@pytest.fixture
def create_user(db):
    """Factory fixture to create users."""
    def _create_user(**kwargs):
        from apps.accounts.models import User
        defaults = {
            'email': 'test@example.com',
            'password': 'TestPass123!',
            'full_name': 'Test User',
            'is_verified': True,
        }
        defaults.update(kwargs)
        password = defaults.pop('password')
        user = User.objects.create(**defaults)
        user.set_password(password)
        user.save()
        return user
    return _create_user


@pytest.fixture
def user(create_user):
    """Return a standard test user."""
    return create_user()


@pytest.fixture
def admin_user(create_user):
    """Return an admin test user."""
    return create_user(
        email='admin@example.com',
        is_staff=True,
        is_superuser=True,
        role='ADMIN',
    )


@pytest.fixture
def advisor_user(create_user):
    """Return an advisor test user."""
    return create_user(
        email='advisor@example.com',
        role='ADVISOR',
    )


@pytest.fixture
def authenticated_client(api_client, user):
    """Return an authenticated API client."""
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def admin_client(api_client, admin_user):
    """Return an admin-authenticated API client."""
    api_client.force_authenticate(user=admin_user)
    return api_client
