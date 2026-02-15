"""
Portfolio analytics functions.
"""

from collections import defaultdict
from decimal import Decimal


def get_portfolio_analytics(portfolio):
    """
    Calculate comprehensive analytics for a portfolio.

    Returns:
        dict with portfolio analytics data
    """
    holdings = portfolio.holdings.all()

    if not holdings.exists():
        return {
            'total_value': 0,
            'total_cost': 0,
            'total_return': 0,
            'return_percentage': 0,
            'asset_allocation': [],
            'top_performers': [],
            'worst_performers': [],
        }

    total_value = sum(h.total_value for h in holdings)
    total_cost = sum(h.total_cost for h in holdings)
    total_return = total_value - total_cost
    return_pct = (total_return / total_cost * 100) if total_cost > 0 else 0

    # Asset allocation by type
    allocation = defaultdict(lambda: Decimal(0))
    for h in holdings:
        allocation[h.asset_type] += h.total_value

    asset_allocation = [
        {
            'asset_type': asset_type,
            'value': float(value),
            'percentage': round(float(value / total_value * 100), 2) if total_value > 0 else 0,
        }
        for asset_type, value in sorted(allocation.items(), key=lambda x: x[1], reverse=True)
    ]

    # Top and worst performers
    sorted_holdings = sorted(holdings, key=lambda h: h.return_percentage, reverse=True)
    top_performers = [
        {
            'name': h.name,
            'symbol': h.symbol,
            'return_percentage': h.return_percentage,
            'profit_loss': float(h.profit_loss),
        }
        for h in sorted_holdings[:5]
    ]
    worst_performers = [
        {
            'name': h.name,
            'symbol': h.symbol,
            'return_percentage': h.return_percentage,
            'profit_loss': float(h.profit_loss),
        }
        for h in sorted_holdings[-5:]
    ]

    return {
        'total_value': float(total_value),
        'total_cost': float(total_cost),
        'total_return': float(total_return),
        'return_percentage': round(float(return_pct), 2),
        'holdings_count': len(holdings),
        'asset_allocation': asset_allocation,
        'top_performers': top_performers,
        'worst_performers': worst_performers,
    }
