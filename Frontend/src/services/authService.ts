/**
 * authService.ts
 *
 * Lightweight helper to attach a Clerk session token to backend API calls.
 *
 * Usage inside a React component or hook:
 *
 *   import { useAuth } from '@clerk/clerk-react';
 *   import { makeAuthHeaders } from '../services/authService';
 *
 *   const { getToken } = useAuth();
 *   const headers = await makeAuthHeaders(getToken);
 *   fetch('/v1/auth/me', { headers });
 *
 * Token management (storage, refresh, expiry) is fully handled by Clerk SDK.
 */

export type GetTokenFn = () => Promise<string | null>;

/**
 * Build an Authorization header object from the Clerk session token.
 * Returns an empty object if the user is not signed in (token is null).
 */
export async function makeAuthHeaders(
  getToken: GetTokenFn
): Promise<Record<string, string>> {
  const token = await getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Fetch wrapper that automatically attaches the Clerk Bearer token.
 *
 * Example:
 *   const { getToken } = useAuth();
 *   const data = await authedFetch(getToken, '/v1/auth/me');
 */
export async function authedFetch(
  getToken: GetTokenFn,
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const authHeaders = await makeAuthHeaders(getToken);
  return fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(init.headers as Record<string, string> | undefined),
    },
  });
}
