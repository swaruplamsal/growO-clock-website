"""
Serializers for the contact app.
"""

from rest_framework import serializers
from .models import ContactMessage


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    """Serializer for submitting a contact form."""

    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'subject', 'message']


class ContactMessageSerializer(serializers.ModelSerializer):
    """Full serializer for contact messages (admin view)."""
    responded_by_name = serializers.CharField(
        source='responded_by.full_name', read_only=True, default=None
    )

    class Meta:
        model = ContactMessage
        fields = [
            'id', 'name', 'email', 'phone', 'subject', 'message',
            'status', 'response', 'responded_by', 'responded_by_name',
            'responded_at', 'created_at',
        ]
        read_only_fields = ['id', 'name', 'email', 'phone', 'subject', 'message',
                            'responded_by', 'responded_at', 'created_at']


class ContactResponseSerializer(serializers.Serializer):
    """Serializer for responding to a contact message."""
    response = serializers.CharField()
