"""
Tests for the consultations app.
"""

import pytest
from datetime import timedelta
from django.utils import timezone
from django.urls import reverse
from rest_framework import status
from apps.consultations.models import Consultation


@pytest.mark.django_db
class TestConsultationModel:
    """Tests for the Consultation model."""

    def test_create_consultation(self, user):
        consultation = Consultation.objects.create(
            user=user,
            consultation_type='FREE',
            subject='Test Consultation',
            message='I need financial advice.',
            scheduled_date=timezone.now() + timedelta(days=7),
        )
        assert consultation.status == 'PENDING'
        assert consultation.user == user
        assert str(consultation.id)

    def test_consultation_str(self, user):
        consultation = Consultation.objects.create(
            user=user,
            consultation_type='PAID',
            subject='Test',
            message='Test message',
        )
        assert user.email in str(consultation)


@pytest.mark.django_db
class TestConsultationAPI:
    """Tests for consultation API endpoints."""

    def test_list_consultations(self, authenticated_client, user):
        Consultation.objects.create(
            user=user,
            consultation_type='FREE',
            subject='Test',
            message='Test',
        )
        url = reverse('consultations:consultation-list')
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_create_consultation(self, authenticated_client):
        url = reverse('consultations:consultation-list')
        data = {
            'consultation_type': 'FREE',
            'subject': 'Financial Planning',
            'message': 'I need help with retirement planning.',
            'scheduled_date': (timezone.now() + timedelta(days=7)).isoformat(),
        }
        response = authenticated_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED

    def test_list_consultations_unauthorized(self, api_client):
        url = reverse('consultations:consultation-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
