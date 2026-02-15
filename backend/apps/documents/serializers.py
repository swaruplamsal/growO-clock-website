"""
Serializers for the documents app.
"""

import os

from rest_framework import serializers
from .models import Document
from utils.validators import validate_file_size, validate_file_extension


class DocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(
        source='uploaded_by.full_name', read_only=True, default=None
    )

    class Meta:
        model = Document
        fields = [
            'id', 'user', 'title', 'description', 'file', 'file_type',
            'file_size', 'category', 'uploaded_by', 'uploaded_by_name',
            'shared_with', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'file_type', 'file_size', 'uploaded_by',
                            'created_at', 'updated_at']


class DocumentUploadSerializer(serializers.ModelSerializer):
    """Serializer for uploading documents."""

    class Meta:
        model = Document
        fields = ['title', 'description', 'file', 'category']

    def validate_file(self, value):
        validate_file_size(value)
        validate_file_extension(value)
        return value

    def create(self, validated_data):
        file = validated_data['file']
        validated_data['user'] = self.context['request'].user
        validated_data['uploaded_by'] = self.context['request'].user
        validated_data['file_type'] = os.path.splitext(file.name)[1].lower()
        validated_data['file_size'] = file.size
        return super().create(validated_data)


class DocumentShareSerializer(serializers.Serializer):
    """Serializer for sharing a document."""
    user_ids = serializers.ListField(
        child=serializers.UUIDField(), min_length=1
    )
