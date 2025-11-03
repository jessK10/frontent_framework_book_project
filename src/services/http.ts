// src/services/http.ts
export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const base =
    (import.meta as any).env?.VITE_API_URL?.replace(/\/+$/, "") ?? "";

  // If path is absolute, use it; otherwise prepend base (when provided)
  const url = /^https?:\/\//i.test(path)
    ? path
    : base
    ? `${base}${path.startsWith("/") ? "" : "/"}${path}`
    : path;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  });

  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const snippet = body.slice(0, 300);
    throw new Error(
      `HTTP ${res.status} ${res.statusText} for ${url}\n` +
        (snippet ? `Response preview:\n${snippet}` : "")
    );
  }

  // No content
  if (res.status === 204 || res.status === 205) {
    // @ts-expect-error allow void return for no-content
    return undefined;
  }

  // Prefer JSON if declared
  if (contentType.includes("application/json") || contentType.includes("+json")) {
    return (await res.json()) as T;
  }

  // Fallback: try parse as JSON, else throw a helpful error
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      `Expected JSON but received ${contentType || "unknown content type"} from ${url}\n` +
        `First 200 chars:\n${text.slice(0, 200)}`
    );
  }
}
