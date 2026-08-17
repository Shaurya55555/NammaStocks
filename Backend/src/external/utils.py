"""External utility functions."""

import hashlib
import json
from typing import Any
from datetime import datetime, timedelta


def generate_data_hash(data: dict[str, Any]) -> str:
    """
    Generate a hash for data to detect duplicates.
    
    Args:
        data: Dictionary to hash
    
    Returns:
        SHA256 hash of the data
    """
    data_string = json.dumps(data, sort_keys=True)
    return hashlib.sha256(data_string.encode()).hexdigest()


def calculate_expiry(ttl_seconds: int) -> datetime:
    """
    Calculate expiry datetime based on TTL.
    
    Args:
        ttl_seconds: Time to live in seconds
    
    Returns:
        Datetime when data expires
    """
    return datetime.utcnow() + timedelta(seconds=ttl_seconds)


def is_expired(expires_at: datetime | None) -> bool:
    """
    Check if data is expired.
    
    Args:
        expires_at: Expiry datetime
    
    Returns:
        True if expired, False otherwise
    """
    if expires_at is None:
        return False
    return datetime.utcnow() > expires_at


def sanitize_external_id(external_id: str) -> str:
    """
    Sanitize external ID for safe storage.
    
    Args:
        external_id: Raw external ID
    
    Returns:
        Sanitized external ID
    """
    return external_id.strip()[:255]


def build_api_url(base_url: str, endpoint: str, params: dict[str, Any] | None = None) -> str:
    """
    Build API URL with query parameters.
    
    Args:
        base_url: Base API URL
        endpoint: API endpoint
        params: Query parameters
    
    Returns:
        Complete URL string
    """
    url = f"{base_url.rstrip('/')}/{endpoint.lstrip('/')}"
    
    if params:
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        url = f"{url}?{query_string}"
    
    return url
