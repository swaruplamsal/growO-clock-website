"""
Admin interface for the consultations app.
"""

from django.contrib import admin
from .models import Consultation, ConsultationDocument


class ConsultationDocumentInline(admin.TabularInline):
    model = ConsultationDocument
    extra = 0
    readonly_fields = ['uploaded_at']


@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    inlines = [ConsultationDocumentInline]
    list_display = ['subject', 'user', 'advisor', 'consultation_type', 'status',
                    'scheduled_date', 'created_at']
    list_filter = ['status', 'consultation_type', 'created_at']
    search_fields = ['subject', 'message', 'user__email', 'user__full_name']
    readonly_fields = ['created_at', 'updated_at']
    raw_id_fields = ['user', 'advisor']
