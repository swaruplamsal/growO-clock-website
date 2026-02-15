"""
Admin interface for the careers app.
"""

from django.contrib import admin
from .models import JobPosition, JobApplication


class JobApplicationInline(admin.TabularInline):
    model = JobApplication
    extra = 0
    readonly_fields = ['created_at']
    fields = ['applicant_name', 'email', 'status', 'created_at']


@admin.register(JobPosition)
class JobPositionAdmin(admin.ModelAdmin):
    inlines = [JobApplicationInline]
    list_display = ['title', 'department', 'employment_type', 'location', 'is_active', 'created_at']
    list_filter = ['employment_type', 'department', 'is_active']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['applicant_name', 'position', 'email', 'status', 'created_at']
    list_filter = ['status', 'position', 'created_at']
    search_fields = ['applicant_name', 'email']
    readonly_fields = ['created_at', 'updated_at']
