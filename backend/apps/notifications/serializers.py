"""
Serializers for the notifications app.
"""

from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notification objects."""

    class Meta:
        model = Notification
        fields = [
            'id',
            'notification_type',
            'priority',
            'title',
            'message',
            'data',
            'is_read',
            'read_at',
            'action_url',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'notification_type',
            'priority',
            'title',
            'message',
            'data',
            'read_at',
            'action_url',
            'created_at',
        ]


class CreateNotificationSerializer(serializers.ModelSerializer):
    """Serializer for creating notifications (admin/internal use)."""

    class Meta:
        model = Notification
        fields = [
            'user',
            'notification_type',
            'priority',
            'title',
            'message',
            'data',
            'action_url',
        ]
