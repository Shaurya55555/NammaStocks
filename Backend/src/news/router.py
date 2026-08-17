from fastapi import APIRouter, Depends
from typing import List
from .schemas import NewsItem
from .service import NewsService

router = APIRouter(prefix="/news", tags=["news"])

def get_news_service() -> NewsService:
    return NewsService()

@router.get("/{category}", response_model=List[NewsItem])
async def get_news_category(category: str, service: NewsService = Depends(get_news_service)):
    """
    Get news based on category.
    Mapped categories:
    - nse -> yfinance ^NSEI
    - bse -> yfinance ^BSESN
    - others -> google news RSS
    """
    cat_lower = category.lower()
    
    if cat_lower == "nse":
        return service.get_yfinance_news("^NSEI", limit=10)
    elif cat_lower == "bse":
        return service.get_yfinance_news("^BSESN", limit=10)
    else:
        return await service.get_google_news(category, limit=10)
