"""
Serializers for the consultations app.
"""

from rest_framework import serializers
from .models import Consultation, ConsultationDocument
from apps.accounts.serializers import UserSerializer


class ConsultationDocumentSerializer(serializers.ModelSerializer):
    """Serializer for consultation documents."""

    class Meta:
        model = ConsultationDocument
        fields = ['id', 'file', 'filename', 'file_size', 'uploaded_by', 'uploaded_at']
        read_only_fields = ['id', 'filename', 'file_size', 'uploaded_by', 'uploaded_at']


class ConsultationSerializer(serializers.ModelSerializer):
    """Serializer for consultations."""
    documents = ConsultationDocumentSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    advisor_name = serializers.CharField(source='advisor.full_name', read_only=True, default=None)

    class Meta:
        model = Consultation
        fields = [
            'id', 'user', 'user_name', 'advisor', 'advisor_name',
            'subject', 'message', 'consultation_type', 'status',
            'scheduled_date', 'duration', 'meeting_link', 'notes',
            'documents', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'advisor', 'status', 'meeting_link', 'created_at', 'updated_at']


class ConsultationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating consultations."""

    class Meta:
        model = Consultation
        fields = ['subject', 'message', 'consultation_type', 'scheduled_date', 'duration']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ConsultationRescheduleSerializer(serializers.Serializer):
    """Serializer for rescheduling a consultation."""
    scheduled_date = serializers.DateTimeField()

    def validate_scheduled_date(self, value):
        from django.utils import timezone
        if value <= timezone.now():
            raise serializers.ValidationError('Scheduled date must be in the future.')
        return value


class ConsultationAssignSerializer(serializers.Serializer):
    """Serializer for assigning an advisor to a consultation."""
    advisor_id = serializers.UUIDField()

    def validate_advisor_id(self, value):
        from apps.accounts.models import User
        try:
            advisor = User.objects.get(id=value, role='ADVISOR')
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid advisor ID.')
        return value
