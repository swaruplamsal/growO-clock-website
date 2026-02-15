"""
Models for the documents app.
"""

import uuid

from django.conf import settings
from django.db import models


class Document(models.Model):
    """User documents."""

    class Category(models.TextChoices):
        TAX = 'TAX', 'Tax Documents'
        INVESTMENT = 'INVESTMENT', 'Investment'
        INSURANCE = 'INSURANCE', 'Insurance'
        LEGAL = 'LEGAL', 'Legal'
        REPORT = 'REPORT', 'Report'
        OTHER = 'OTHER', 'Other'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents'
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='documents/%Y/%m/')
    file_type = models.CharField(max_length=50)
    file_size = models.IntegerField()

    category = models.CharField(max_length=15, choices=Category.choices)

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='uploaded_documents'
    )
    shared_with = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name='shared_documents', blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'documents'
        ordering = ['-created_at']

    def __str__(self):
        return self.title
