"""Items domain-specific exceptions."""
from src.exceptions import NotFoundException, BadRequestException

class ItemNotFoundException(NotFoundException):
    """Raised when an item is not found."""
    def __init__(self, detail: str = "Item not found"):
        super().__init__(detail=detail)

class ItemAlreadyExistsException(BadRequestException):
    """Raised when trying to create a duplicate item."""
    def __init__(self, detail: str = "Item already exists"):
        super().__init__(detail=detail)

class ItemValidationException(BadRequestException):
    """Raised when item validation fails."""
    def __init__(self, detail: str = "Item validation failed"):
        super().__init__(detail=detail)
