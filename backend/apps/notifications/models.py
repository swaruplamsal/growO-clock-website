"""
Models for the notifications app.
"""

import uuid
from django.db import models
from django.conf import settings


class Notification(models.Model):
    """User notification."""

    class NotificationType(models.TextChoices):
        SYSTEM = 'SYSTEM', 'System'
        CONSULTATION = 'CONSULTATION', 'Consultation'
        DOCUMENT = 'DOCUMENT', 'Document'
        INVESTMENT = 'INVESTMENT', 'Investment'
        FINANCIAL = 'FINANCIAL', 'Financial'
        BLOG = 'BLOG', 'Blog'
        ACCOUNT = 'ACCOUNT', 'Account'

    class Priority(models.TextChoices):
        LOW = 'LOW', 'Low'
        MEDIUM = 'MEDIUM', 'Medium'
        HIGH = 'HIGH', 'High'
        URGENT = 'URGENT', 'Urgent'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    notification_type = models.CharField(
        max_length=20,
        choices=NotificationType.choices,
        default=NotificationType.SYSTEM,
    )
    priority = models.CharField(
        max_length=10,
        choices=Priority.choices,
        default=Priority.MEDIUM,
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    data = models.JSONField(blank=True, null=True, help_text='Additional JSON data')
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(blank=True, null=True)
    action_url = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self):
        return f'{self.title} - {self.user.email}'

    def mark_as_read(self):
        from django.utils import timezone
        self.is_read = True
        self.read_at = timezone.now()
        self.save(update_fields=['is_read', 'read_at', 'updated_at'])
