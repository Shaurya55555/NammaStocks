from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class Message(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]
    model: Optional[str] = None  # If None, uses LLM_MODEL from config
    user_id: Optional[str] = None  # For future personalization / portfolio RAG


# ---------------------------------------------------------------------------
# Structured agent action — replaces the fragile [PROPOSAL:...] token hack
# ---------------------------------------------------------------------------

class AgentActionPayload(BaseModel):
    """Typed payload for each action type."""
    symbols: Optional[List[str]] = None   # For NAVIGATE_COMPARE / NAVIGATE_TIMETRAVEL
    message: Optional[str] = None         # Free-form payload if needed


class AgentAction(BaseModel):
    """A proposed UI action the frontend should render as a confirm widget."""
    type: str  # "NAVIGATE_COMPARE" | "NAVIGATE_TIMETRAVEL" | "NAVIGATE_REBALANCE"
    payload: AgentActionPayload
    label: str  # Human-readable button label, e.g. "Compare TCS & INFY"


class AgentResponse(BaseModel):
    """Top-level response from the agent endpoint."""
    text: str                           # The human-readable message to display
    action: Optional[AgentAction] = None  # Present only when the agent wants to drive the UI
    model_used: Optional[str] = None    # Which LLM actually answered (for debug/display)
