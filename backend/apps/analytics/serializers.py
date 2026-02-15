"""
Serializers for the analytics app.
"""

from rest_framework import serializers
from .models import AuditLog, PageView


class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True, default=None)

    class Meta:
        model = AuditLog
        fields = [
            'id',
            'user',
            'user_email',
            'action',
            'resource_type',
            'resource_id',
            'description',
            'ip_address',
            'metadata',
            'created_at',
        ]
        read_only_fields = fields


class PageViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageView
        fields = ['id', 'path', 'user', 'ip_address', 'referrer', 'created_at']
        read_only_fields = fields


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics."""
    total_users = serializers.IntegerField()
    active_users = serializers.IntegerField()
    total_consultations = serializers.IntegerField()
    pending_consultations = serializers.IntegerField()
    total_blog_posts = serializers.IntegerField()
    total_contact_messages = serializers.IntegerField()
    new_contact_messages = serializers.IntegerField()
    total_job_applications = serializers.IntegerField()
    recent_signups = serializers.IntegerField()


class UserAnalyticsSerializer(serializers.Serializer):
    """Serializer for user-level analytics."""
    total_consultations = serializers.IntegerField()
    total_financial_plans = serializers.IntegerField()
    total_portfolios = serializers.IntegerField()
    total_documents = serializers.IntegerField()
    unread_notifications = serializers.IntegerField()
