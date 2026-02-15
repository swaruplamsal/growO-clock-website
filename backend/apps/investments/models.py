"""
Models for the investments app.
"""

import uuid

from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class Portfolio(models.Model):
    """Investment portfolio."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='portfolios'
    )
    plan = models.ForeignKey(
        'financial_planning.FinancialPlan', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='portfolios'
    )

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    total_value = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    risk_score = models.IntegerField(
        default=5, validators=[MinValueValidator(1), MaxValueValidator(10)]
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'portfolios'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.user.email}"

    def recalculate_total_value(self):
        """Recalculate total portfolio value from holdings."""
        total = sum(h.total_value for h in self.holdings.all())
        self.total_value = total
        self.save(update_fields=['total_value'])
        return total


class Holding(models.Model):
    """Individual holdings in a portfolio."""

    class AssetType(models.TextChoices):
        STOCK = 'STOCK', 'Stock'
        BOND = 'BOND', 'Bond'
        MUTUAL_FUND = 'MUTUAL_FUND', 'Mutual Fund'
        ETF = 'ETF', 'ETF'
        REAL_ESTATE = 'REAL_ESTATE', 'Real Estate'
        CRYPTO = 'CRYPTO', 'Cryptocurrency'
        FIXED_DEPOSIT = 'FIXED_DEPOSIT', 'Fixed Deposit'
        OTHER = 'OTHER', 'Other'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    portfolio = models.ForeignKey(
        Portfolio, on_delete=models.CASCADE, related_name='holdings'
    )

    asset_type = models.CharField(max_length=15, choices=AssetType.choices)
    symbol = models.CharField(max_length=20, blank=True)
    name = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=12, decimal_places=4)
    purchase_price = models.DecimalField(max_digits=12, decimal_places=2)
    current_price = models.DecimalField(max_digits=12, decimal_places=2)
    purchase_date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'holdings'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.symbol})" if self.symbol else self.name

    @property
    def total_value(self):
        return self.quantity * self.current_price

    @property
    def total_cost(self):
        return self.quantity * self.purchase_price

    @property
    def profit_loss(self):
        return (self.current_price - self.purchase_price) * self.quantity

    @property
    def return_percentage(self):
        if self.purchase_price == 0:
            return 0
        return round(
            ((self.current_price - self.purchase_price) / self.purchase_price) * 100, 2
        )


class PortfolioPerformance(models.Model):
    """Track portfolio performance over time."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    portfolio = models.ForeignKey(
        Portfolio, on_delete=models.CASCADE, related_name='performance_history'
    )
    total_value = models.DecimalField(max_digits=14, decimal_places=2)
    total_return = models.DecimalField(max_digits=14, decimal_places=2)
    percentage_return = models.DecimalField(max_digits=7, decimal_places=2)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'portfolio_performance'
        ordering = ['-recorded_at']

    def __str__(self):
        return f"{self.portfolio.name} - {self.recorded_at.date()}"
