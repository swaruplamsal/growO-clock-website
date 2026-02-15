"""
Tests for the contact app.
"""

import pytest
from django.urls import reverse
from rest_framework import status
from apps.contact.models import ContactMessage


@pytest.mark.django_db
class TestContactModel:
    """Tests for the ContactMessage model."""

    def test_create_message(self):
        msg = ContactMessage.objects.create(
            name='John Doe',
            email='john@example.com',
            subject='Test Subject',
            message='This is a test message.',
        )
        assert msg.status == 'NEW'
        assert str(msg) == 'John Doe - Test Subject'


@pytest.mark.django_db
class TestContactAPI:
    """Tests for contact API endpoints."""

    def test_submit_contact_form(self, api_client):
        url = reverse('contact:contact-submit')
        data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'subject': 'General Inquiry',
            'message': 'I would like to know more about your services.',
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['success'] is True

    def test_submit_contact_form_missing_fields(self, api_client):
        url = reverse('contact:contact-submit')
        data = {'name': 'John'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_admin_list_messages(self, admin_client):
        ContactMessage.objects.create(
            name='Test', email='t@t.com',
            subject='Test', message='Test',
        )
        url = reverse('contact:contact-admin-list')
        response = admin_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_admin_list_unauthorized(self, authenticated_client):
        url = reverse('contact:contact-admin-list')
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_403_FORBIDDEN
