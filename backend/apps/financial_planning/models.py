"""
Models for the financial_planning app.
"""

import uuid

from django.conf import settings
from django.db import models


class FinancialPlan(models.Model):
    """Main financial plan model."""

    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        ACTIVE = 'ACTIVE', 'Active'
        ARCHIVED = 'ARCHIVED', 'Archived'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='financial_plans'
    )
    advisor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='created_plans'
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.DRAFT
    )
    recommendations = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'financial_plans'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.email}"

    @property
    def total_income(self):
        return sum(
            i.monthly_amount for i in self.incomes.all()
        )

    @property
    def total_expenses(self):
        return sum(
            e.monthly_amount for e in self.expenses.all()
        )

    @property
    def total_assets(self):
        return sum(a.value for a in self.assets.all())

    @property
    def total_liabilities(self):
        return sum(l.amount for l in self.liabilities.all())

    @property
    def net_worth(self):
        return self.total_assets - self.total_liabilities


class FinancialGoal(models.Model):
    """Financial goals within a plan."""

    class Category(models.TextChoices):
        RETIREMENT = 'RETIREMENT', 'Retirement'
        EDUCATION = 'EDUCATION', 'Education'
        HOME = 'HOME', 'Home Purchase'
        EMERGENCY = 'EMERGENCY', 'Emergency Fund'
        TRAVEL = 'TRAVEL', 'Travel'
        BUSINESS = 'BUSINESS', 'Business'
        OTHER = 'OTHER', 'Other'

    class Priority(models.TextChoices):
        HIGH = 'HIGH', 'High'
        MEDIUM = 'MEDIUM', 'Medium'
        LOW = 'LOW', 'Low'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    plan = models.ForeignKey(
        FinancialPlan, on_delete=models.CASCADE, related_name='goals'
    )
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=15, choices=Category.choices)
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    current_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    target_date = models.DateField()
    priority = models.CharField(
        max_length=6, choices=Priority.choices, default=Priority.MEDIUM
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'financial_goals'
        ordering = ['priority', 'target_date']

    def __str__(self):
        return f"{self.name} - {self.plan.title}"

    @property
    def progress_percentage(self):
        if self.target_amount == 0:
            return 0
        return round((self.current_amount / self.target_amount) * 100, 2)

    @property
    def remaining_amount(self):
        return max(self.target_amount - self.current_amount, 0)


class Income(models.Model):
    """Income sources."""

    class Frequency(models.TextChoices):
        MONTHLY = 'MONTHLY', 'Monthly'
        ANNUAL = 'ANNUAL', 'Annual'
        ONE_TIME = 'ONE_TIME', 'One-time'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    plan = models.ForeignKey(
        FinancialPlan, on_delete=models.CASCADE, related_name='incomes'
    )
    source = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    frequency = models.CharField(max_length=10, choices=Frequency.choices)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'incomes'

    def __str__(self):
        return f"{self.source}: {self.amount}"

    @property
    def monthly_amount(self):
        if self.frequency == self.Frequency.ANNUAL:
            return self.amount / 12
        return self.amount


class Expense(models.Model):
    """Expense tracking."""

    class Frequency(models.TextChoices):
        MONTHLY = 'MONTHLY', 'Monthly'
        ANNUAL = 'ANNUAL', 'Annual'
        ONE_TIME = 'ONE_TIME', 'One-time'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    plan = models.ForeignKey(
        FinancialPlan, on_delete=models.CASCADE, related_name='expenses'
    )
    category = models.CharField(max_length=100)
    description = models.CharField(max_length=255, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    frequency = models.CharField(max_length=10, choices=Frequency.choices)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'expenses'

    def __str__(self):
        return f"{self.category}: {self.amount}"

    @property
    def monthly_amount(self):
        if self.frequency == self.Frequency.ANNUAL:
            return self.amount / 12
        return self.amount


class Asset(models.Model):
    """Assets owned."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    plan = models.ForeignKey(
        FinancialPlan, on_delete=models.CASCADE, related_name='assets'
    )
    asset_type = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    value = models.DecimalField(max_digits=12, decimal_places=2)
    acquisition_date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'assets'

    def __str__(self):
        return f"{self.description}: {self.value}"


class Liability(models.Model):
    """Liabilities/debts."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    plan = models.ForeignKey(
        FinancialPlan, on_delete=models.CASCADE, related_name='liabilities'
    )
    liability_type = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    monthly_payment = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    payoff_date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'liabilities'
        verbose_name_plural = 'Liabilities'

    def __str__(self):
        return f"{self.description}: {self.amount}"
