"""
Tests for the careers app.
"""

import pytest
from django.urls import reverse
from rest_framework import status
from apps.careers.models import JobPosition, JobApplication


@pytest.mark.django_db
class TestCareersModels:
    """Tests for careers models."""

    def test_create_position(self):
        position = JobPosition.objects.create(
            title='Backend Developer',
            slug='backend-developer',
            department='Engineering',
            location='Kathmandu',
            employment_type='FULL_TIME',
            description='We are looking for a backend developer.',
            requirements='3+ years experience',
            is_active=True,
        )
        assert str(position) == 'Backend Developer'
        assert position.is_active

    def test_create_application(self, user):
        position = JobPosition.objects.create(
            title='Frontend Developer',
            slug='frontend-developer',
            department='Engineering',
            location='Remote',
            employment_type='FULL_TIME',
            description='Frontend role',
            requirements='React experience',
            is_active=True,
        )
        application = JobApplication.objects.create(
            position=position,
            full_name='Test User',
            email='test@example.com',
            phone='+977-9800000000',
            cover_letter='I am interested.',
        )
        assert application.status == 'SUBMITTED'


@pytest.mark.django_db
class TestCareersAPI:
    """Tests for careers API endpoints."""

    def test_list_positions(self, api_client):
        JobPosition.objects.create(
            title='QA Engineer', slug='qa-engineer',
            department='QA', location='Kathmandu',
            employment_type='FULL_TIME', description='QA role',
            requirements='Testing exp', is_active=True,
        )
        url = reverse('careers:position-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_inactive_positions_hidden(self, api_client):
        JobPosition.objects.create(
            title='Old Role', slug='old-role',
            department='Dept', location='Here',
            employment_type='FULL_TIME', description='Old',
            requirements='None', is_active=False,
        )
        url = reverse('careers:position-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 0
