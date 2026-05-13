/**
 * Extracts the EXACT raw error string from a Supabase Edge Function response.
 *
 * Lesson generation must never collapse provider/parser errors into a generic
 * "Something went wrong". This walks every known error envelope shape and
 * returns the most specific technical string available.
 */
export function extractEdgeError(args: {
  error?: any;
  data?: any;
  fallback?: string;
}): string {
  const { error, data, fallback = 'Unknown error from edge function' } = args;

  // 1. Supabase invoke transport error
  if (error) {
    const ctx = (error as any)?.context;
    const ctxBody =
      typeof ctx?.body === 'string'
        ? ctx.body
        : ctx?.body
          ? safeStringify(ctx.body)
          : '';
    const parts = [
      error?.name && `${error.name}`,
      error?.message,
      ctxBody && `body=${ctxBody}`,
      ctx?.status && `status=${ctx.status}`,
    ].filter(Boolean);
    if (parts.length) return parts.join(' | ');
  }

  // 2. Edge function returned a non-2xx body that supabase-js parsed as data
  if (data && typeof data === 'object') {
    const pieces: string[] = [];
    if (typeof data.error === 'string') pieces.push(data.error);
    else if (data.error?.message) pieces.push(String(data.error.message));
    if (data.detail) pieces.push(typeof data.detail === 'string' ? data.detail : safeStringify(data.detail));
    if (data.stack && typeof data.stack === 'string') pieces.push(data.stack.split('\n')[0]);
    if (data.message && !pieces.length) pieces.push(String(data.message));
    if (pieces.length) return pieces.join(' — ');
  }

  return fallback;
}

function safeStringify(x: unknown): string {
  try {
    const s = JSON.stringify(x);
    return s.length > 600 ? s.slice(0, 600) + '…' : s;
  } catch {
    return String(x);
  }
}
