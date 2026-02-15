"""
Models for the analytics app.
"""

import uuid
from django.db import models
from django.conf import settings


class AuditLog(models.Model):
    """Tracks user actions for auditing and analytics."""

    class ActionType(models.TextChoices):
        LOGIN = 'LOGIN', 'Login'
        LOGOUT = 'LOGOUT', 'Logout'
        CREATE = 'CREATE', 'Create'
        UPDATE = 'UPDATE', 'Update'
        DELETE = 'DELETE', 'Delete'
        VIEW = 'VIEW', 'View'
        DOWNLOAD = 'DOWNLOAD', 'Download'
        UPLOAD = 'UPLOAD', 'Upload'
        EXPORT = 'EXPORT', 'Export'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs',
    )
    action = models.CharField(max_length=20, choices=ActionType.choices)
    resource_type = models.CharField(max_length=100, help_text='Model/resource name')
    resource_id = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    metadata = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'audit_logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['action', '-created_at']),
            models.Index(fields=['resource_type', '-created_at']),
        ]

    def __str__(self):
        user_email = self.user.email if self.user else 'Anonymous'
        return f'{user_email} - {self.action} - {self.resource_type}'


class PageView(models.Model):
    """Tracks page views for analytics."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    path = models.CharField(max_length=500)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='page_views',
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    referrer = models.URLField(max_length=1000, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'page_views'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['path', '-created_at']),
        ]

    def __str__(self):
        return f'{self.path} - {self.created_at}'
