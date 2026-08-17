"""External domain configuration."""

# API timeout settings (in seconds)
EXTERNAL_API_TIMEOUT = 30
EXTERNAL_API_CONNECT_TIMEOUT = 10

# Retry settings
EXTERNAL_API_MAX_RETRIES = 3
EXTERNAL_API_RETRY_DELAY = 1  # seconds

# Cache settings
EXTERNAL_DATA_CACHE_TTL = 300  # 5 minutes
EXTERNAL_DATA_REFRESH_INTERVAL = 3600  # 1 hour

# Rate limiting
EXTERNAL_API_RATE_LIMIT_PER_MINUTE = 60
EXTERNAL_API_RATE_LIMIT_PER_HOUR = 1000

# Data retention
EXTERNAL_DATA_RETENTION_DAYS = 30  # How long to keep old data
EXTERNAL_LOG_RETENTION_DAYS = 7  # How long to keep API logs
