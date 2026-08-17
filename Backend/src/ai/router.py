from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from src.ai.schemas import ChatRequest, AgentResponse
from src.ai.service import get_chat_response, stream_chat_response

router = APIRouter(prefix="/ai", tags=["AI Agent"])


@router.post("/chat", response_model=AgentResponse)
async def chat_with_agent(request: ChatRequest):
    """
    Send a conversation to the AI agent and receive a structured response.

    Response shape:
      {
        "text": "Human-readable message",
        "action": {                         ← null if no UI action proposed
          "type": "NAVIGATE_COMPARE",
          "payload": { "symbols": ["TCS", "INFY"] },
          "label": "Compare TCS vs INFY"
        },
        "model_used": "llama3.2"
      }
    """
    try:
        return await get_chat_response(request.messages, request.model)
    except Exception as e:
        print(f"[AI Router] Error: {e}")
        raise HTTPException(status_code=500, detail="Agent encountered an error. Please try again.")


@router.post("/chat/stream")
async def chat_with_agent_stream(request: ChatRequest):
    """
    Streaming variant — returns Server-Sent Events (SSE).

    Each event is a JSON object:
      { "chunk": "text token" }         ← while streaming
      { "done": true, "action": {...} } ← final frame, includes action if any

    Frontend usage:
      const reader = response.body.getReader();
      // read chunks and append to displayed text
      // on done frame, check action field to show proposal widget
    """
    try:
        return StreamingResponse(
            stream_chat_response(request.messages, request.model),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",  # disable nginx buffering
            },
        )
    except Exception as e:
        print(f"[AI Router] Stream error: {e}")
        raise HTTPException(status_code=500, detail="Streaming failed. Please try again.")
