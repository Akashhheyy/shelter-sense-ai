/**
 * Centralised API client for the existing FastAPI backend.
 * Base URL comes from VITE_API_BASE_URL only - never hard-coded in pages.
 */

export const API_BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export class ApiError extends Error {
  status: number | null;
  detail?: unknown;

  constructor(message: string, status: number | null, detail?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

function friendlyMessage(status: number, detail: unknown): string {
  const detailText =
    typeof detail === "string"
      ? detail
      : Array.isArray(detail)
        ? detail
            .map((d) =>
              typeof d === "object" && d && "msg" in (d as Record<string, unknown>)
                ? String((d as Record<string, unknown>)["msg"])
                : JSON.stringify(d),
            )
            .join("; ")
        : undefined;

  switch (status) {
    case 400:
      return detailText ?? "The request was rejected as invalid (400).";
    case 404:
      return detailText ?? "The requested resource was not found on the API (404).";
    case 422:
      return detailText ?? "The API rejected the submitted values (422 validation error).";
    case 500:
      return "The API encountered an internal error (500). Check the backend logs.";
    default:
      if (status >= 500) return `The API returned a server error (${status}).`;
      return detailText ?? `The API returned an unexpected status (${status}).`;
  }
}

export async function request<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError(
      `Unable to connect to the FastAPI server at ${API_BASE_URL}. Make sure the backend is running on port 8000.`,
      null,
    );
  }

  const raw = await response.text();
  let parsed: unknown = undefined;
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = undefined;
    }
  }

  if (!response.ok) {
    const detail =
      parsed && typeof parsed === "object" && "detail" in (parsed as Record<string, unknown>)
        ? (parsed as Record<string, unknown>)["detail"]
        : raw || undefined;
    throw new ApiError(friendlyMessage(response.status, detail), response.status, detail);
  }

  if (raw && parsed === undefined) {
    throw new ApiError("The API response could not be read as JSON.", response.status);
  }

  return parsed as T;
}

export const apiGet = <T = unknown>(path: string) => request<T>(path);

export const apiPost = <T = unknown>(path: string, body: unknown) =>
  request<T>(path, { method: "POST", body: JSON.stringify(body ?? {}) });

/**
 * Posts a payload, retrying with alternative key spellings if the backend
 * answers 422 - the deployed schema is the source of truth, so we adapt to it
 * instead of guessing a single shape.
 */
export async function apiPostFlexible<T = unknown>(
  path: string,
  candidates: Array<Record<string, unknown>>,
): Promise<T> {
  let lastError: unknown;
  for (const body of candidates) {
    try {
      return await apiPost<T>(path, body);
    } catch (error) {
      lastError = error;
      if (error instanceof ApiError && error.status === 422) continue;
      throw error;
    }
  }
  throw lastError;
}
