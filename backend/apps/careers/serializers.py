"""
Serializers for the careers app.
"""

from rest_framework import serializers
from .models import JobPosition, JobApplication
from utils.validators import validate_file_size


class JobPositionSerializer(serializers.ModelSerializer):
    applications_count = serializers.IntegerField(
        source='applications.count', read_only=True
    )

    class Meta:
        model = JobPosition
        fields = [
            'id', 'title', 'department', 'employment_type', 'location',
            'description', 'requirements', 'salary_range', 'is_active',
            'applications_count', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class JobPositionListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for public listing."""

    class Meta:
        model = JobPosition
        fields = [
            'id', 'title', 'department', 'employment_type', 'location',
            'salary_range', 'created_at',
        ]


class JobApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer for submitting a job application."""

    class Meta:
        model = JobApplication
        fields = [
            'position', 'applicant_name', 'email', 'phone',
            'resume', 'cover_letter', 'linkedin_url',
        ]

    def validate_resume(self, value):
        validate_file_size(value)
        import os
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in ['.pdf', '.doc', '.docx']:
            raise serializers.ValidationError(
                'Resume must be a PDF or Word document.'
            )
        return value


class JobApplicationSerializer(serializers.ModelSerializer):
    """Full serializer for admin view."""
    position_title = serializers.CharField(source='position.title', read_only=True)

    class Meta:
        model = JobApplication
        fields = [
            'id', 'position', 'position_title', 'applicant_name', 'email',
            'phone', 'resume', 'cover_letter', 'linkedin_url',
            'status', 'notes', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'position', 'applicant_name', 'email', 'phone',
                            'resume', 'cover_letter', 'linkedin_url', 'created_at', 'updated_at']
