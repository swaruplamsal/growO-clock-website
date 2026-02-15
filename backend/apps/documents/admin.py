"""
Admin configuration for the documents app.
"""

from django.contrib import admin
from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'category', 'file_type', 'file_size', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('title', 'description', 'user__email')
    readonly_fields = ('id', 'file_type', 'file_size', 'created_at', 'updated_at')
    raw_id_fields = ('user',)
    filter_horizontal = ('shared_with',)
    date_hierarchy = 'created_at'
