from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Global application settings."""

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost:5432/postgres"

    # API
    API_V1_PREFIX: str = "/v1"
    PROJECT_NAME: str = "NammaStocks"
    VERSION: str = "1.0.0"

    # CORS — set to specific origins in production (comma-separated)
    BACKEND_CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]

    # External stock/finance APIs
    FINNHUB_API_KEY: str = ""
    ALPHA_VANTAGE_API_KEY: str = ""

    # -----------------------------------------------------------------------
    # LLM Configuration — model-agnostic
    # LLM_PROVIDER: "ollama" | "openai" | "gemini" | "anthropic"
    # -----------------------------------------------------------------------
    LLM_PROVIDER: str = "ollama"
    LLM_MODEL: str = "mistral"
    LLM_API_KEY: str = ""           # Only needed for cloud providers
    OLLAMA_HOST: str = "http://host.docker.internal:11434"
    LLM_TEMPERATURE: float = 0.0

    # RAG settings
    RAG_NEWS_LIMIT: int = 3         # How many news headlines to inject per symbol
    RAG_ENABLED: bool = True        # Toggle RAG off for debugging

    # -----------------------------------------------------------------------
    # Clerk Authentication
    # -----------------------------------------------------------------------
    CLERK_JWKS_URL: str = ""        # e.g. https://xxx.clerk.accounts.dev/.well-known/jwks.json
    CLERK_ISSUER: str = ""          # e.g. https://xxx.clerk.accounts.dev
    CLERK_SECRET_KEY: str = ""      # sk_test_... (optional, for server-side Clerk SDK)

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

