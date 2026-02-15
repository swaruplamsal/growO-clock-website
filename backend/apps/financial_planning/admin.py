"""
Admin interface for the financial_planning app.
"""

from django.contrib import admin
from .models import FinancialPlan, FinancialGoal, Income, Expense, Asset, Liability


class FinancialGoalInline(admin.TabularInline):
    model = FinancialGoal
    extra = 0


class IncomeInline(admin.TabularInline):
    model = Income
    extra = 0


class ExpenseInline(admin.TabularInline):
    model = Expense
    extra = 0


class AssetInline(admin.TabularInline):
    model = Asset
    extra = 0


class LiabilityInline(admin.TabularInline):
    model = Liability
    extra = 0


@admin.register(FinancialPlan)
class FinancialPlanAdmin(admin.ModelAdmin):
    inlines = [FinancialGoalInline, IncomeInline, ExpenseInline, AssetInline, LiabilityInline]
    list_display = ['title', 'user', 'advisor', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['title', 'user__email', 'user__full_name']
    raw_id_fields = ['user', 'advisor']
    readonly_fields = ['created_at', 'updated_at']
