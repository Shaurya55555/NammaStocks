"""Dashboard utility functions."""

from typing import Any


def format_metric_value(value: float, metric_type: str) -> str:
    """
    Format metric value based on its type.
    
    Args:
        value: The metric value
        metric_type: The type of metric (count, percentage, currency, duration)
    
    Returns:
        Formatted string representation of the value
    """
    if metric_type == "percentage":
        return f"{value:.2f}%"
    elif metric_type == "currency":
        return f"${value:,.2f}"
    elif metric_type == "count":
        return f"{int(value):,}"
    elif metric_type == "duration":
        return f"{value:.2f}s"
    return str(value)


def calculate_percentage_change(old_value: float, new_value: float) -> float:
    """
    Calculate percentage change between two values.
    
    Args:
        old_value: Previous value
        new_value: Current value
    
    Returns:
        Percentage change
    """
    if old_value == 0:
        return 100.0 if new_value > 0 else 0.0
    return ((new_value - old_value) / old_value) * 100
