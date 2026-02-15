"""
Admin configuration for the analytics app.
"""

from django.contrib import admin
from .models import AuditLog, PageView


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'resource_type', 'resource_id', 'ip_address', 'created_at')
    list_filter = ('action', 'resource_type', 'created_at')
    search_fields = ('description', 'resource_type', 'user__email')
    readonly_fields = ('id', 'user', 'action', 'resource_type', 'resource_id', 'description', 'ip_address', 'user_agent', 'metadata', 'created_at')
    raw_id_fields = ('user',)
    date_hierarchy = 'created_at'
    list_per_page = 100

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = ('path', 'user', 'ip_address', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('path', 'user__email')
    readonly_fields = ('id', 'path', 'user', 'ip_address', 'user_agent', 'referrer', 'created_at')
    date_hierarchy = 'created_at'
    list_per_page = 100

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
