import { getBackendAuthorizationHeaders } from "./backend-id-token.server";
import { type FetchWithRetryOptions, fetchWithRetry } from "./http";

function mergeAuthHeaders(
  existing: HeadersInit | undefined,
  auth: Record<string, string>,
): Headers {
  const headers = new Headers(existing);
  for (const [key, value] of Object.entries(auth)) {
    if (value) {
      headers.set(key, value);
    }
  }
  return headers;
}

async function withBackendAuth(init?: RequestInit): Promise<RequestInit> {
  const authHeaders = await getBackendAuthorizationHeaders();
  if (Object.keys(authHeaders).length === 0) {
    return init ?? {};
  }
  return {
    ...init,
    headers: mergeAuthHeaders(init?.headers, authHeaders),
  };
}

/**
 * バックエンド向けに ID トークン（Authorization）を付与して fetchWithRetry する。
 */
export async function backendFetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  opts?: FetchWithRetryOptions,
): Promise<Response> {
  const merged = await withBackendAuth(init);
  return fetchWithRetry(input, merged, opts);
}

/**
 * バックエンド向けに ID トークン（Authorization）を付与して fetch する。
 */
export async function backendFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const merged = await withBackendAuth(init);
  return fetch(input, merged);
}
