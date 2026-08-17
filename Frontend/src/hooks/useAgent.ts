import { useState, useCallback, useRef } from 'react';

// ---------------------------------------------------------------------------
// Types — mirrors the backend AgentResponse / AgentAction schemas
// ---------------------------------------------------------------------------

export interface AgentActionPayload {
  symbols?: string[];
  message?: string;
}

export interface AgentAction {
  type: 'NAVIGATE_COMPARE' | 'NAVIGATE_TIMETRAVEL' | 'NAVIGATE_REBALANCE' | string;
  payload: AgentActionPayload;
  label: string;
}

export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
  action?: AgentAction | null;
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const DEFAULT_MODEL = import.meta.env.VITE_LLM_MODEL || 'llama3.2';
const USE_STREAMING = import.meta.env.VITE_USE_STREAMING === 'true';

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useAgent = () => {
  const [history, setHistory] = useState<AgentMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [streamingText, setStreamingText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Append a message to the conversation history.
   */
  const _appendMessage = useCallback((msg: AgentMessage) => {
    setHistory(prev => [...prev, msg]);
  }, []);

  /**
   * Send a command and get a response.
   * Uses streaming if VITE_USE_STREAMING=true, otherwise standard fetch.
   */
  const sendCommand = useCallback(async (content: string) => {
    if (!content.trim() || isThinking) return;

    setIsThinking(true);
    setError(null);
    setStreamingText('');

    // Add user message to history immediately
    const userMessage: AgentMessage = { role: 'user', content, timestamp: new Date() };
    _appendMessage(userMessage);

    // Build the full history to send (all prior messages + this one)
    // We do this inside the callback to read the pre-append state
    const historySnapshot = history;
    const messagesToSend = [
      ...historySnapshot.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content },
    ];

    abortControllerRef.current = new AbortController();

    try {
      if (USE_STREAMING) {
        await _streamResponse(messagesToSend);
      } else {
        await _fetchResponse(messagesToSend);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('[useAgent] Error:', err);
        setError(err.message || 'An error occurred');
        _appendMessage({
          role: 'assistant',
          content: 'Sorry, I encountered an error connecting to my brain. Please ensure the backend and Ollama are running.',
          timestamp: new Date(),
        });
      }
    } finally {
      setIsThinking(false);
      setStreamingText('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isThinking, history, _appendMessage]);

  /**
   * Standard (non-streaming) fetch — parses structured AgentResponse.
   */
  const _fetchResponse = async (messages: { role: string; content: string }[]) => {
    const response = await fetch(`${API_BASE}/v1/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: abortControllerRef.current?.signal,
      body: JSON.stringify({ messages, model: DEFAULT_MODEL }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Backend now returns { text, action, model_used }
    _appendMessage({
      role: 'assistant',
      content: data.text ?? data.response ?? '',  // graceful fallback for old API shape
      action: data.action ?? null,
      timestamp: new Date(),
    });
  };

  /**
   * Streaming fetch — reads SSE chunks, accumulates text, extracts action from done frame.
   */
  const _streamResponse = async (messages: { role: string; content: string }[]) => {
    const response = await fetch(`${API_BASE}/v1/ai/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: abortControllerRef.current?.signal,
      body: JSON.stringify({ messages, model: DEFAULT_MODEL }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let accumulated = '';
    let finalAction: AgentAction | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const raw = decoder.decode(value, { stream: true });
      // SSE lines look like: `data: {...}\n\n`
      const lines = raw.split('\n').filter(l => l.startsWith('data: '));

      for (const line of lines) {
        try {
          const frame = JSON.parse(line.replace('data: ', ''));
          if (frame.chunk) {
            accumulated += frame.chunk;
            setStreamingText(accumulated);
          }
          if (frame.done) {
            finalAction = frame.action ?? null;
          }
        } catch {
          // Malformed chunk — skip
        }
      }
    }

    _appendMessage({
      role: 'assistant',
      content: accumulated,
      action: finalAction,
      timestamp: new Date(),
    });
  };

  /**
   * Cancel the in-flight request.
   */
  const cancelRequest = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsThinking(false);
    setStreamingText('');
  }, []);

  /**
   * Clear chat history and state.
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    setError(null);
    setStreamingText('');
  }, []);

  // Convenience: latest assistant message (replaces old `latestResponse`)
  const latestResponse = history.length > 0 && history[history.length - 1].role === 'assistant'
    ? history[history.length - 1]
    : null;

  return {
    history,
    latestResponse,       // most recent assistant message (typed AgentMessage)
    streamingText,        // live text during streaming (show while isThinking)
    isThinking,
    error,
    sendCommand,
    cancelRequest,
    clearHistory,
    clearResponse: clearHistory,  // backward compat alias
  };
};
