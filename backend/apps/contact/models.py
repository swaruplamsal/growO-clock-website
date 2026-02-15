"""
Models for the contact app.
"""

import uuid

from django.conf import settings
from django.db import models


class ContactMessage(models.Model):
    """Contact form submissions."""

    class Status(models.TextChoices):
        NEW = 'NEW', 'New'
        READ = 'READ', 'Read'
        RESPONDED = 'RESPONDED', 'Responded'
        ARCHIVED = 'ARCHIVED', 'Archived'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=255)
    message = models.TextField()

    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.NEW
    )

    response = models.TextField(blank=True)
    responded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='contact_responses'
    )
    responded_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'contact_messages'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.subject} - {self.email}"
