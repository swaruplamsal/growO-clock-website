"""
Admin interface for the investments app.
"""

from django.contrib import admin
from .models import Portfolio, Holding, PortfolioPerformance


class HoldingInline(admin.TabularInline):
    model = Holding
    extra = 0
    readonly_fields = ['created_at']


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    inlines = [HoldingInline]
    list_display = ['name', 'user', 'total_value', 'risk_score', 'created_at']
    list_filter = ['risk_score', 'created_at']
    search_fields = ['name', 'user__email']
    raw_id_fields = ['user', 'plan']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(PortfolioPerformance)
class PortfolioPerformanceAdmin(admin.ModelAdmin):
    list_display = ['portfolio', 'total_value', 'total_return', 'percentage_return', 'recorded_at']
    list_filter = ['recorded_at']
    raw_id_fields = ['portfolio']
