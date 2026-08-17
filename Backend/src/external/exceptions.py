"""External domain exceptions."""

from src.exceptions import NotFoundException, ConflictException


class ExternalDataNotFoundException(NotFoundException):
    """Exception raised when external API data is not found."""
    
    def __init__(self, detail: str = "External data not found"):
        super().__init__(detail=detail)


class ExternalDataAlreadyExistsException(ConflictException):
    """Exception raised when external API data already exists."""
    
    def __init__(self, detail: str = "External data already exists"):
        super().__init__(detail=detail)


class ExternalAPIException(Exception):
    """Base exception for external API errors."""
    
    def __init__(self, detail: str = "External API error"):
        self.detail = detail
        super().__init__(self.detail)


class ExternalAPITimeoutException(ExternalAPIException):
    """Exception raised when external API call times out."""
    
    def __init__(self, detail: str = "External API timeout"):
        super().__init__(detail=detail)


class ExternalAPIRateLimitException(ExternalAPIException):
    """Exception raised when hitting rate limits."""
    
    def __init__(self, detail: str = "Rate limit exceeded"):
        super().__init__(detail=detail)
