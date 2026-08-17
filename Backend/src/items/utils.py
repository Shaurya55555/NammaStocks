"""Items domain utility functions."""
from typing import Optional

def sanitize_item_name(name: str) -> str:
    """Sanitize item name by removing extra whitespace."""
    return " ".join(name.split())

def format_item_description(description: Optional[str]) -> Optional[str]:
    """Format item description."""
    if not description:
        return None
    return description.strip()
