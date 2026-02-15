"""
Financial calculators.
"""

from decimal import Decimal
import math


def calculate_compound_interest(principal, annual_rate, years, compounding_frequency=12):
    """
    Calculate compound interest.

    Args:
        principal: Initial investment amount
        annual_rate: Annual interest rate (as percentage, e.g. 8.0 for 8%)
        years: Time period in years
        compounding_frequency: Number of times interest compounds per year

    Returns:
        dict with final amount, total interest earned, and yearly breakdown
    """
    principal = float(principal)
    rate = float(annual_rate) / 100
    years = int(years)
    n = int(compounding_frequency)

    amount = principal * (1 + rate / n) ** (n * years)
    interest = amount - principal

    # Yearly breakdown
    yearly_data = []
    for year in range(1, years + 1):
        year_amount = principal * (1 + rate / n) ** (n * year)
        yearly_data.append({
            'year': year,
            'amount': round(year_amount, 2),
            'interest_earned': round(year_amount - principal, 2),
        })

    return {
        'final_amount': round(amount, 2),
        'total_interest': round(interest, 2),
        'principal': round(principal, 2),
        'annual_rate': float(annual_rate),
        'years': years,
        'yearly_breakdown': yearly_data,
    }


def calculate_retirement_needs(current_age, retirement_age, life_expectancy,
                                annual_expenses, current_savings=0,
                                inflation_rate=3.0, expected_return=8.0):
    """
    Calculate how much you need to save for retirement.

    Args:
        current_age: Current age
        retirement_age: Planned retirement age
        life_expectancy: Expected life span
        annual_expenses: Current annual expenses
        current_savings: Current retirement savings
        inflation_rate: Expected annual inflation rate (percentage)
        expected_return: Expected annual return on investments (percentage)

    Returns:
        dict with retirement analysis
    """
    years_to_retirement = retirement_age - current_age
    retirement_years = life_expectancy - retirement_age
    inflation = float(inflation_rate) / 100
    returns = float(expected_return) / 100
    expenses = float(annual_expenses)
    savings = float(current_savings)

    # Future value of expenses at retirement
    future_expenses = expenses * (1 + inflation) ** years_to_retirement

    # Total corpus needed (accounting for inflation during retirement)
    real_return = (1 + returns) / (1 + inflation) - 1
    if real_return > 0:
        corpus_needed = future_expenses * (1 - (1 + real_return) ** (-retirement_years)) / real_return
    else:
        corpus_needed = future_expenses * retirement_years

    # Future value of current savings
    future_savings = savings * (1 + returns) ** years_to_retirement

    # Gap to fill
    savings_gap = max(corpus_needed - future_savings, 0)

    # Monthly savings needed to fill the gap
    monthly_rate = returns / 12
    months = years_to_retirement * 12
    if monthly_rate > 0:
        monthly_savings = savings_gap * monthly_rate / ((1 + monthly_rate) ** months - 1)
    else:
        monthly_savings = savings_gap / months if months > 0 else 0

    return {
        'corpus_needed': round(corpus_needed, 2),
        'current_savings': round(savings, 2),
        'future_value_current_savings': round(future_savings, 2),
        'savings_gap': round(savings_gap, 2),
        'monthly_savings_needed': round(monthly_savings, 2),
        'years_to_retirement': years_to_retirement,
        'retirement_years': retirement_years,
        'future_annual_expenses': round(future_expenses, 2),
    }


def calculate_loan_payment(principal, annual_rate, years):
    """
    Calculate monthly loan payment using standard amortization formula.

    Args:
        principal: Loan amount
        annual_rate: Annual interest rate (percentage)
        years: Loan term in years

    Returns:
        dict with monthly payment, total payment, total interest
    """
    principal = float(principal)
    monthly_rate = float(annual_rate) / 100 / 12
    months = int(years) * 12

    if monthly_rate == 0:
        monthly_payment = principal / months
    else:
        monthly_payment = principal * (monthly_rate * (1 + monthly_rate) ** months) / \
                          ((1 + monthly_rate) ** months - 1)

    total_payment = monthly_payment * months
    total_interest = total_payment - principal

    # Amortization schedule (first 12 months and last 12 months)
    schedule = []
    balance = principal
    for month in range(1, months + 1):
        interest_payment = balance * monthly_rate
        principal_payment = monthly_payment - interest_payment
        balance -= principal_payment
        if month <= 12 or month > months - 12:
            schedule.append({
                'month': month,
                'payment': round(monthly_payment, 2),
                'principal': round(principal_payment, 2),
                'interest': round(interest_payment, 2),
                'balance': round(max(balance, 0), 2),
            })

    return {
        'monthly_payment': round(monthly_payment, 2),
        'total_payment': round(total_payment, 2),
        'total_interest': round(total_interest, 2),
        'principal': round(principal, 2),
        'annual_rate': float(annual_rate),
        'years': int(years),
        'schedule_preview': schedule,
    }


def project_investment_growth(initial_investment, monthly_contribution,
                               annual_return, years):
    """
    Project investment growth over time.

    Args:
        initial_investment: Initial investment amount
        monthly_contribution: Monthly contribution
        annual_return: Expected annual return (percentage)
        years: Investment horizon in years

    Returns:
        dict with projected growth data
    """
    initial = float(initial_investment)
    monthly = float(monthly_contribution)
    monthly_rate = float(annual_return) / 100 / 12
    months = int(years) * 12

    # Calculate using future value formulas
    fv_initial = initial * (1 + monthly_rate) ** months
    if monthly_rate > 0:
        fv_contributions = monthly * ((1 + monthly_rate) ** months - 1) / monthly_rate
    else:
        fv_contributions = monthly * months

    total_value = fv_initial + fv_contributions
    total_invested = initial + (monthly * months)
    total_returns = total_value - total_invested

    # Yearly breakdown
    yearly_data = []
    balance = initial
    total_contrib = initial
    for year in range(1, int(years) + 1):
        for _ in range(12):
            balance = balance * (1 + monthly_rate) + monthly
            total_contrib += monthly
        yearly_data.append({
            'year': year,
            'balance': round(balance, 2),
            'total_invested': round(total_contrib, 2),
            'returns': round(balance - total_contrib, 2),
        })

    return {
        'final_value': round(total_value, 2),
        'total_invested': round(total_invested, 2),
        'total_returns': round(total_returns, 2),
        'return_percentage': round((total_returns / total_invested) * 100, 2) if total_invested > 0 else 0,
        'yearly_breakdown': yearly_data,
    }


def estimate_tax(annual_income, deductions=0, filing_status='SINGLE'):
    """
    Estimate tax liability (Nepal tax slabs as reference).

    Args:
        annual_income: Annual income
        deductions: Total deductions
        filing_status: SINGLE, MARRIED, or BUSINESS

    Returns:
        dict with tax estimation
    """
    income = float(annual_income)
    deductions = float(deductions)
    taxable_income = max(income - deductions, 0)

    # Nepal tax slabs (simplified for illustration)
    # Single: 1% on first 500K, 10% on 500K-700K, 20% on 700K-1M, 30% on 1M-2M, 36% above 2M
    if filing_status == 'MARRIED':
        slabs = [
            (600000, 0.01), (200000, 0.10), (300000, 0.20),
            (900000, 0.30), (float('inf'), 0.36),
        ]
    elif filing_status == 'BUSINESS':
        slabs = [
            (500000, 0.01), (200000, 0.10), (300000, 0.20),
            (1000000, 0.30), (float('inf'), 0.36),
        ]
    else:  # SINGLE
        slabs = [
            (500000, 0.01), (200000, 0.10), (300000, 0.20),
            (1000000, 0.30), (float('inf'), 0.36),
        ]

    tax = 0
    remaining = taxable_income
    breakdown = []

    for slab_limit, rate in slabs:
        if remaining <= 0:
            break
        taxable_in_slab = min(remaining, slab_limit)
        tax_in_slab = taxable_in_slab * rate
        tax += tax_in_slab
        breakdown.append({
            'slab_limit': slab_limit if slab_limit != float('inf') else 'Above',
            'rate': rate * 100,
            'taxable_amount': round(taxable_in_slab, 2),
            'tax': round(tax_in_slab, 2),
        })
        remaining -= taxable_in_slab

    effective_rate = (tax / income * 100) if income > 0 else 0

    return {
        'annual_income': round(income, 2),
        'deductions': round(deductions, 2),
        'taxable_income': round(taxable_income, 2),
        'total_tax': round(tax, 2),
        'effective_rate': round(effective_rate, 2),
        'monthly_tax': round(tax / 12, 2),
        'take_home_annual': round(income - tax, 2),
        'take_home_monthly': round((income - tax) / 12, 2),
        'breakdown': breakdown,
    }
