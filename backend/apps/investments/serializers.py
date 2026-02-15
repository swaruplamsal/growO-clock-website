"""
Serializers for the investments app.
"""

from rest_framework import serializers
from .models import Portfolio, Holding, PortfolioPerformance


class HoldingSerializer(serializers.ModelSerializer):
    total_value = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    total_cost = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    profit_loss = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    return_percentage = serializers.DecimalField(max_digits=7, decimal_places=2, read_only=True)

    class Meta:
        model = Holding
        fields = [
            'id', 'asset_type', 'symbol', 'name', 'quantity',
            'purchase_price', 'current_price', 'purchase_date',
            'total_value', 'total_cost', 'profit_loss', 'return_percentage',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PortfolioPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioPerformance
        fields = ['id', 'total_value', 'total_return', 'percentage_return', 'recorded_at']
        read_only_fields = ['id', 'recorded_at']


class PortfolioSerializer(serializers.ModelSerializer):
    holdings = HoldingSerializer(many=True, read_only=True)
    holdings_count = serializers.IntegerField(source='holdings.count', read_only=True)

    class Meta:
        model = Portfolio
        fields = [
            'id', 'user', 'plan', 'name', 'description', 'total_value',
            'risk_score', 'holdings', 'holdings_count', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'total_value', 'created_at', 'updated_at']


class PortfolioListSerializer(serializers.ModelSerializer):
    holdings_count = serializers.IntegerField(source='holdings.count', read_only=True)

    class Meta:
        model = Portfolio
        fields = [
            'id', 'name', 'description', 'total_value', 'risk_score',
            'holdings_count', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'total_value', 'created_at', 'updated_at']


class PortfolioCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['name', 'description', 'risk_score', 'plan']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
