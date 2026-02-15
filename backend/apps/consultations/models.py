"""
Models for the consultations app.
"""

import uuid

from django.conf import settings
from django.db import models


class Consultation(models.Model):
    """Consultation booking model."""

    class ConsultationType(models.TextChoices):
        FREE = 'FREE', 'Free Consultation'
        PAID = 'PAID', 'Paid Consultation'
        FOLLOW_UP = 'FOLLOW_UP', 'Follow-up'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        SCHEDULED = 'SCHEDULED', 'Scheduled'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='consultations'
    )
    advisor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='assigned_consultations'
    )

    subject = models.CharField(max_length=255)
    message = models.TextField()
    consultation_type = models.CharField(
        max_length=10, choices=ConsultationType.choices,
        default=ConsultationType.FREE
    )
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.PENDING
    )

    scheduled_date = models.DateTimeField(null=True, blank=True)
    duration = models.IntegerField(default=30, help_text='Duration in minutes')
    meeting_link = models.URLField(blank=True)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'consultations'
        ordering = ['-created_at']

    def __str__(self):
        return f"Consultation: {self.subject} - {self.user.email}"


class ConsultationDocument(models.Model):
    """Documents attached to consultations."""

    consultation = models.ForeignKey(
        Consultation, on_delete=models.CASCADE, related_name='documents'
    )
    file = models.FileField(upload_to='consultations/%Y/%m/')
    filename = models.CharField(max_length=255)
    file_size = models.IntegerField()
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='consultation_uploads'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'consultation_documents'

    def __str__(self):
        return self.filename
