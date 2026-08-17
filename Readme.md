# NammaStocks

> An AI-powered Indian stock market platform — real-time NSE data, screener, blogs, news ,commodity insights and our AI agent (Stockie)

---
## Overview

NammaStocks is an AI-powered platform for Indian equity investors. The Dashboard surfaces live NIFTY 50, SENSEX, BANK NIFTY, and VIX data alongside a sector heatmap, top movers, and a curated watchlist. The Screener helps filter NSE stocks by metrics and jump straight into side-by-side comparisons. Commodity Insights delivers driver attribution, regime classification, and volatility forecasts for key commodities. The News page aggregates the latest market headlines, while the Blog hosts community commentary. Stockie, the built-in AI assistant, answers market questions with live price and news context right in a chat sidebar.


## Screenshots

#### Login Page
![Login Page](./docs/screenshots/login-page.png)

#### Dashboard
![Dashboard](./docs/screenshots/dashboard.png)

#### Screener
![Screener](./docs/screenshots/compare.png)

###
#### AI Agent — Stockie
![AI Agent](./docs/screenshots/ai-agent.png)

### news
![News](./docs/screenshots/news.png)

---


---

## Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.10+ |
| Node.js | 18+ |
| PostgreSQL | 15+ |
| Docker + Docker Compose | latest |
| Ollama (optional, for local LLM) | latest |

---

## Running with Docker Compose (Recommended)

```bash
# 1. Clone the repo
git clone https://github.com/your-org/NammaStocks.git
cd NammaStocks

# 2. Set up environment
cp Backend/.env.example Backend/.env
# Edit Backend/.env — fill in CLERK_JWKS_URL, CLERK_ISSUER, and any LLM keys

# 3. Start everything
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |

---

## Running Locally

### Backend

```bash
cd Backend

python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
# Edit .env — fill in DATABASE_URL, CLERK_JWKS_URL, CLERK_ISSUER

uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd Frontend

npm install

# Create a .env file
echo "VITE_API_URL=http://localhost:8000/v1" > .env
echo "VITE_CLERK_PUBLISHABLE_KEY=pk_test_..." >> .env

npm run dev
```

---

## Environment Variables

### Backend (`Backend/.env`)

```env
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/nammastocks

CLERK_JWKS_URL=https://xxx.clerk.accounts.dev/.well-known/jwks.json
CLERK_ISSUER=https://xxx.clerk.accounts.dev
CLERK_SECRET_KEY=sk_test_...

LLM_PROVIDER=ollama          # ollama | openai | gemini | anthropic
LLM_MODEL=mistral
LLM_API_KEY=                 # only needed for cloud providers
OLLAMA_HOST=http://localhost:11434
```

### Frontend (`Frontend/.env`)

```env
VITE_API_URL=http://localhost:8000/v1
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

## LLM Provider

| Provider | `LLM_PROVIDER` value | Notes |
|----------|----------------------|-------|
| Ollama (default) | `ollama` | Run `ollama pull mistral` locally |
| OpenAI | `openai` | Set `LLM_API_KEY=sk-…` |
| Google Gemini | `gemini` | Set `LLM_API_KEY=AI…` |
| Anthropic | `anthropic` | Set `LLM_API_KEY=sk-ant-…` |

---

**Built with ❤️ for Indian equity traders and investors.**
