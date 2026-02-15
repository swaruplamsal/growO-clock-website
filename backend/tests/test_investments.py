"""
Tests for the investments app.
"""

import pytest
from django.urls import reverse
from rest_framework import status
from apps.investments.models import Portfolio, Holding


@pytest.mark.django_db
class TestPortfolioModel:
    """Tests for the Portfolio model."""

    def test_create_portfolio(self, user):
        portfolio = Portfolio.objects.create(
            user=user,
            name='My Portfolio',
            description='Test portfolio',
        )
        assert portfolio.user == user
        assert portfolio.total_value == 0

    def test_portfolio_with_holdings(self, user):
        portfolio = Portfolio.objects.create(
            user=user, name='Test Portfolio',
        )
        Holding.objects.create(
            portfolio=portfolio,
            asset_type='STOCK',
            name='Test Stock',
            symbol='TST',
            quantity=10,
            average_cost=100,
            current_price=120,
        )
        portfolio.recalculate_total_value()
        assert portfolio.total_value == 1200


@pytest.mark.django_db
class TestHoldingModel:
    """Tests for the Holding model."""

    def test_holding_profit_loss(self, user):
        portfolio = Portfolio.objects.create(
            user=user, name='Test',
        )
        holding = Holding.objects.create(
            portfolio=portfolio,
            asset_type='STOCK',
            name='Test Stock',
            symbol='TST',
            quantity=10,
            average_cost=100,
            current_price=150,
        )
        assert holding.total_value == 1500
        assert holding.total_cost == 1000
        assert holding.profit_loss == 500
        assert holding.return_percentage == 50.0


@pytest.mark.django_db
class TestPortfolioAPI:
    """Tests for portfolio API endpoints."""

    def test_list_portfolios(self, authenticated_client):
        url = reverse('investments:portfolio-list')
        response = authenticated_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_create_portfolio(self, authenticated_client):
        url = reverse('investments:portfolio-list')
        data = {
            'name': 'New Portfolio',
            'description': 'My investment portfolio',
        }
        response = authenticated_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED

    def test_portfolios_unauthorized(self, api_client):
        url = reverse('investments:portfolio-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
