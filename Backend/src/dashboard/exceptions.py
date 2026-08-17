"""Dashboard domain exceptions."""

from src.exceptions import NotFoundException, ConflictException


class DashboardMetricNotFoundException(NotFoundException):
    """Exception raised when a dashboard metric is not found."""
    
    def __init__(self, detail: str = "Dashboard metric not found"):
        super().__init__(detail=detail)


class DashboardMetricAlreadyExistsException(ConflictException):
    """Exception raised when a dashboard metric already exists."""
    
    def __init__(self, detail: str = "Dashboard metric already exists"):
        super().__init__(detail=detail)
