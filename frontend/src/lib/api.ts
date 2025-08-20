import { isServer } from "@builder.io/qwik/build";

const BASE_URL = import.meta.env.VITE_API_URL as string | undefined;

/**
 * PUBLIC_INTERFACE
 * apiFetch
 * A thin wrapper around fetch that prefixes VITE_API_URL when provided.
 */
export async function apiFetch(input: string, init?: RequestInit) {
  const url = BASE_URL ? new URL(input, BASE_URL).toString() : input;
  return fetch(url, init);
}

/**
 * PUBLIC_INTERFACE
 * getApiBase
 * Returns the current API base URL (or empty string if not set).
 */
export function getApiBase(): string {
  return BASE_URL || "";
}
