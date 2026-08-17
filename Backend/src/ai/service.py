"""
AI Agent service — slash commands + RAG-grounded LLM answers.

Architecture:
  /command  →  deterministic AgentResponse, no LLM call
  text      →  RAG context injection → plain LLM answer, no tool overhead

Slash commands:
  /compare  <SYM1> <SYM2> [...]  → NAVIGATE_COMPARE
  /timetravel <SYM1> <SYM2>     → NAVIGATE_TIMETRAVEL
  /rebalance                     → NAVIGATE_REBALANCE
"""

import json
import asyncio
from typing import List, AsyncIterator

from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.language_models.chat_models import BaseChatModel

from src.config import settings
from src.ai.schemas import Message, AgentResponse, AgentAction, AgentActionPayload
from src.ai.rag import build_rag_context


# ---------------------------------------------------------------------------
# LLM Factory — swap provider via LLM_PROVIDER env var, zero code change
# ---------------------------------------------------------------------------

def _get_llm(model_override: str | None = None) -> BaseChatModel:
    """Return a configured LLM instance based on settings.LLM_PROVIDER."""
    model = model_override or settings.LLM_MODEL
    provider = settings.LLM_PROVIDER.lower()

    if provider == "openai":
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(model=model, api_key=settings.LLM_API_KEY, temperature=settings.LLM_TEMPERATURE)

    elif provider == "gemini":
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(model=model, google_api_key=settings.LLM_API_KEY, temperature=settings.LLM_TEMPERATURE)

    elif provider == "anthropic":
        from langchain_anthropic import ChatAnthropic
        return ChatAnthropic(model=model, api_key=settings.LLM_API_KEY, temperature=settings.LLM_TEMPERATURE)

    else:
        # Default: Ollama (local)
        from langchain_ollama import ChatOllama
        return ChatOllama(
            model=model,
            base_url=settings.OLLAMA_HOST,
            temperature=settings.LLM_TEMPERATURE,
        )


# ---------------------------------------------------------------------------
# Slash command parser — deterministic, zero LLM, zero ambiguity
# ---------------------------------------------------------------------------

def _parse_slash_command(text: str) -> AgentResponse | None:
    """
    Parse a slash command from the user's message.

    Supported commands:
      /compare  <SYM1> <SYM2> [SYM3 ...]  — compare stocks side-by-side
      /timetravel <SYM1> <SYM2>            — run a visual backtest
      /time-travel <SYM1> <SYM2>           — alias for /timetravel
      /rebalance                            — open the portfolio rebalancer

    Returns an AgentResponse if command is recognised, else None.
    The LLM is never called for slash commands.
    """
    parts = text.strip().split()
    if not parts:
        return None

    cmd = parts[0].lower()
    args = [p.upper() for p in parts[1:]]

    # /compare TCS INFY RELIANCE
    if cmd == "/compare":
        if len(args) < 2:
            return AgentResponse(
                text="Please provide at least 2 stock symbols. Example: `/compare TCS INFY`",
                action=None,
                model_used="slash_command",
            )
        label = f"Compare {' vs '.join(args)}"
        return AgentResponse(
            text=f"Comparing {', '.join(args)} side-by-side.",
            action=AgentAction(
                type="NAVIGATE_COMPARE",
                payload=AgentActionPayload(symbols=args),
                label=label,
            ),
            model_used="slash_command",
        )

    # /timetravel TCS INFY  (or /time-travel)
    if cmd in ("/timetravel", "/time-travel"):
        if len(args) != 2:
            return AgentResponse(
                text="Please provide exactly 2 stock symbols. Example: `/timetravel TCS INFY`",
                action=None,
                model_used="slash_command",
            )
        sym1, sym2 = args[0], args[1]
        return AgentResponse(
            text=f"Running time travel simulation: {sym1} vs {sym2}.",
            action=AgentAction(
                type="NAVIGATE_TIMETRAVEL",
                payload=AgentActionPayload(symbols=[sym1, sym2]),
                label=f"Time Travel: {sym1} vs {sym2}",
            ),
            model_used="slash_command",
        )

    # /rebalance
    if cmd == "/rebalance":
        return AgentResponse(
            text="Opening the portfolio rebalancer.",
            action=AgentAction(
                type="NAVIGATE_REBALANCE",
                payload=AgentActionPayload(),
                label="Rebalance Portfolio",
            ),
            model_used="slash_command",
        )

    # Unknown slash command — let the user know
    return AgentResponse(
        text=(
            f"Unknown command `{cmd}`. Available commands:\n"
            "• `/compare <SYM1> <SYM2> [...]` — compare stocks\n"
            "• `/timetravel <SYM1> <SYM2>` — backtest two stocks\n"
            "• `/rebalance` — rebalance your portfolio"
        ),
        action=None,
        model_used="slash_command",
    )


# ---------------------------------------------------------------------------
# System prompt builder
# ---------------------------------------------------------------------------

_BASE_SYSTEM_PROMPT = """You are Bolt, an intelligent stock market AI assistant for NammaStocks — an Indian stock market platform focused on NSE-listed equities.

Your capabilities:
- Analyze Indian stocks (NSE), sectors, and market trends
- Answer questions about fundamentals, technicals, and market sentiment
- Explain financial metrics and market concepts clearly

Rules:
- If live market data is provided below, USE IT in your answer — do not rely on training data for current prices
- Be concise and direct. This is a trading platform, not a chatbot.
- Format numbers in Indian style (lakhs, crores) when relevant
- Do NOT suggest navigating to UI features — the platform handles that via slash commands
"""


def _build_system_message(rag_context: str) -> SystemMessage:
    if rag_context:
        content = _BASE_SYSTEM_PROMPT + "\n\n" + rag_context
    else:
        content = _BASE_SYSTEM_PROMPT
    return SystemMessage(content=content)


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

async def get_chat_response(messages: List[Message], model: str | None = None) -> AgentResponse:
    """
    Process a conversation and return a structured AgentResponse.

    Steps:
    1. Check if the latest message is a slash command → instant response, no LLM
    2. Build RAG context from the latest user message
    3. Call LLM with enriched system prompt — plain conversational answer
    """
    user_messages = [m for m in messages if m.role == "user"]
    latest_query = user_messages[-1].content.strip() if user_messages else ""

    # 1. Slash command — deterministic, skip LLM entirely
    if latest_query.startswith("/"):
        return _parse_slash_command(latest_query)

    # 2. Build RAG context (concurrent: stock prices + news)
    rag_context = await build_rag_context(latest_query)

    # 3. Build LangChain message list
    lc_messages = [_build_system_message(rag_context)]
    for msg in messages:
        if msg.role == "user":
            lc_messages.append(HumanMessage(content=msg.content))
        elif msg.role == "assistant":
            lc_messages.append(AIMessage(content=msg.content))
        elif msg.role == "system":
            lc_messages.append(SystemMessage(content=msg.content))

    # 4. Call LLM — no tools bound, pure conversational answer
    return await _invoke_with_fallback(lc_messages, model)


async def _invoke_with_fallback(lc_messages: list, model: str | None) -> AgentResponse:
    """Try primary Ollama host, fallback to localhost if connection fails."""
    try:
        return await _invoke_llm(lc_messages, model, base_url=settings.OLLAMA_HOST)
    except Exception as primary_err:
        print(f"[AI] Primary host failed ({settings.OLLAMA_HOST}): {primary_err}")
        if settings.LLM_PROVIDER.lower() == "ollama":
            try:
                return await _invoke_llm(lc_messages, model, base_url="http://localhost:11434")
            except Exception as fallback_err:
                print(f"[AI] Localhost fallback also failed: {fallback_err}")
        return AgentResponse(
            text="I'm having trouble connecting to my brain right now. Please ensure Ollama is running locally.",
            action=None,
            model_used=None,
        )


async def _invoke_llm(lc_messages: list, model: str | None, base_url: str | None = None) -> AgentResponse:
    """
    Core LLM invocation — no tool binding, plain conversational answer.
    `base_url` is only used for Ollama provider overrides.
    """
    actual_model = model or settings.LLM_MODEL

    if settings.LLM_PROVIDER.lower() == "ollama" and base_url:
        from langchain_ollama import ChatOllama
        llm = ChatOllama(
            model=actual_model,
            base_url=base_url,
            temperature=settings.LLM_TEMPERATURE,
        )
    else:
        llm = _get_llm(actual_model)

    response = await llm.ainvoke(lc_messages)
    text = response.content if isinstance(response.content, str) else ""

    return AgentResponse(
        text=text or "I couldn't generate a response. Please try again.",
        action=None,
        model_used=actual_model,
    )


# ---------------------------------------------------------------------------
# Streaming support
# ---------------------------------------------------------------------------

async def stream_chat_response(messages: List[Message], model: str | None = None) -> AsyncIterator[str]:
    """
    Stream the LLM response token-by-token as Server-Sent Events data strings.
    Yields JSON strings: `{"chunk": "text"}` or `{"done": true}`

    Slash commands are not streamed — they return instantly via get_chat_response.
    """
    user_messages = [m for m in messages if m.role == "user"]
    latest_query = user_messages[-1].content.strip() if user_messages else ""

    # Slash commands don't stream — caller should use get_chat_response for /commands
    if latest_query.startswith("/"):
        result = _parse_slash_command(latest_query)
        yield f"data: {json.dumps({'chunk': result.text})}\n\n"
        yield f"data: {json.dumps({'done': True, 'action': result.action.model_dump() if result.action else None})}\n\n"
        return

    rag_context = await build_rag_context(latest_query)

    lc_messages = [_build_system_message(rag_context)]
    for msg in messages:
        if msg.role == "user":
            lc_messages.append(HumanMessage(content=msg.content))
        elif msg.role == "assistant":
            lc_messages.append(AIMessage(content=msg.content))

    actual_model = model or settings.LLM_MODEL

    try:
        if settings.LLM_PROVIDER.lower() == "ollama":
            from langchain_ollama import ChatOllama
            llm = ChatOllama(model=actual_model, base_url=settings.OLLAMA_HOST, temperature=settings.LLM_TEMPERATURE)
        else:
            llm = _get_llm(actual_model)

        async for chunk in llm.astream(lc_messages):
            text = chunk.content or ""
            if text:
                yield f"data: {json.dumps({'chunk': text})}\n\n"

        yield f"data: {json.dumps({'done': True, 'action': None})}\n\n"

    except Exception as e:
        print(f"[AI Stream] Error: {e}")
        yield f"data: {json.dumps({'chunk': 'Sorry, I encountered an error. Please try again.'})}\n\n"
        yield f"data: {json.dumps({'done': True, 'action': None})}\n\n"
