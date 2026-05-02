// Drop-in fetch() replacement that adds automatic AI provider failover.
//
// USAGE: Replace `fetch(url, init)` with `aiFetch(url, init)` for any call
// targeting the Lovable AI Gateway or Google Generative Language API.
//
// Behaviour:
//  - If the call targets ai.gateway.lovable.dev and fails with 429/402/5xx
//    (or throws), automatically retries via Gemini direct using the same
//    OpenAI-style request body (translated).
//  - If the call targets generativelanguage.googleapis.com and fails with
//    429/5xx (or throws), automatically retries via the Lovable AI Gateway.
//  - The returned Response always mirrors the SHAPE the caller expected
//    (OpenAI-style if they called the gateway, Gemini-style if they called
//    Gemini direct), so existing parsing code does not need to change.

const LOVABLE_HOST = "ai.gateway.lovable.dev";
const GEMINI_HOST = "generativelanguage.googleapis.com";
const LOVABLE_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

function isRetryable(status: number): boolean {
  return status === 429 || status === 402 || status >= 500;
}

function gatewayModelToGemini(model?: string): string {
  if (!model) return "gemini-2.5-flash";
  const bare = model.replace(/^google\//, "").replace(/^openai\//, "");
  if (bare.startsWith("gpt-5")) {
    if (bare.includes("nano") || bare.includes("mini")) return "gemini-2.5-flash";
    return "gemini-2.5-pro";
  }
  // gemini-3-flash-preview / gemini-3-pro-preview etc → fall back to a stable Gemini-direct model
  if (bare.includes("flash")) return "gemini-2.5-flash";
  if (bare.includes("pro")) return "gemini-2.5-pro";
  return "gemini-2.5-flash";
}

function geminiModelToGateway(geminiModel: string): string {
  if (geminiModel.includes("pro")) return "google/gemini-2.5-pro";
  return "google/gemini-2.5-flash";
}

// Convert an OpenAI-style request -> Gemini direct, call it, then translate
// the Gemini response back into an OpenAI-style Response so callers don't break.
async function fallbackGatewayToGemini(originalBody: any): Promise<Response> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("Failover failed: GEMINI_API_KEY not configured");

  const messages: Array<{ role: string; content: string }> = originalBody.messages || [];
  const systemMessages = messages.filter((m) => m.role === "system");
  const conversation = messages.filter((m) => m.role !== "system");

  const geminiModel = gatewayModelToGemini(originalBody.model);
  const geminiBody: any = {
    contents: conversation.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: typeof m.content === "string" ? m.content : JSON.stringify(m.content) }],
    })),
    generationConfig: {
      temperature: originalBody.temperature ?? 0.7,
      maxOutputTokens: originalBody.max_tokens ?? originalBody.maxTokens ?? 4096,
    },
  };
  if (systemMessages.length > 0) {
    geminiBody.systemInstruction = {
      parts: [{ text: systemMessages.map((s) => s.content).join("\n\n") }],
    };
  }
  if (originalBody.response_format?.type === "json_object") {
    geminiBody.generationConfig.responseMimeType = "application/json";
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(geminiBody),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Failover (gemini-direct) failed: ${resp.status} ${errText}`);
  }
  const data = await resp.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  // Repackage as OpenAI Chat Completion shape
  const openaiShape = {
    id: `gemini-fallback-${Date.now()}`,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: geminiModel,
    choices: [
      {
        index: 0,
        message: { role: "assistant", content: text },
        finish_reason: "stop",
      },
    ],
    usage: data.usageMetadata
      ? {
          prompt_tokens: data.usageMetadata.promptTokenCount || 0,
          completion_tokens: data.usageMetadata.candidatesTokenCount || 0,
          total_tokens: data.usageMetadata.totalTokenCount || 0,
        }
      : undefined,
    _provider: "gemini-direct-fallback",
  };
  return new Response(JSON.stringify(openaiShape), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// Convert a Gemini-direct request -> Lovable Gateway, call it, then translate
// the gateway response back into a Gemini-shaped Response.
async function fallbackGeminiToGateway(originalUrl: string, originalBody: any): Promise<Response> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("Failover failed: LOVABLE_API_KEY not configured");

  // Extract model from URL (.../models/{model}:generateContent)
  const m = originalUrl.match(/models\/([^:/?]+)/);
  const geminiModel = m?.[1] || "gemini-2.5-flash";
  const gatewayModel = geminiModelToGateway(geminiModel);

  const messages: Array<{ role: string; content: string }> = [];
  if (originalBody.systemInstruction?.parts) {
    const sysText = originalBody.systemInstruction.parts.map((p: any) => p.text).join("\n");
    if (sysText) messages.push({ role: "system", content: sysText });
  }
  for (const c of originalBody.contents || []) {
    const role = c.role === "model" ? "assistant" : "user";
    const text = (c.parts || []).map((p: any) => p.text || "").join("\n");
    messages.push({ role, content: text });
  }

  const gw: any = {
    model: gatewayModel,
    messages,
    temperature: originalBody.generationConfig?.temperature ?? 0.7,
    max_tokens: originalBody.generationConfig?.maxOutputTokens ?? 4096,
  };
  if (originalBody.generationConfig?.responseMimeType === "application/json") {
    gw.response_format = { type: "json_object" };
  }

  const resp = await fetch(LOVABLE_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(gw),
  });
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Failover (lovable-gateway) failed: ${resp.status} ${errText}`);
  }
  const data = await resp.json();
  const text = data.choices?.[0]?.message?.content || "";
  // Repackage as Gemini generateContent shape
  const geminiShape = {
    candidates: [
      {
        content: { parts: [{ text }], role: "model" },
        finishReason: "STOP",
        index: 0,
      },
    ],
    usageMetadata: data.usage
      ? {
          promptTokenCount: data.usage.prompt_tokens || 0,
          candidatesTokenCount: data.usage.completion_tokens || 0,
          totalTokenCount: data.usage.total_tokens || 0,
        }
      : undefined,
    _provider: "lovable-gateway-fallback",
  };
  return new Response(JSON.stringify(geminiShape), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function aiFetch(url: string, init?: RequestInit): Promise<Response> {
  const isLovable = url.includes(LOVABLE_HOST);
  const isGemini = url.includes(GEMINI_HOST);

  // Parse body once for potential reuse on failover
  let parsedBody: any = null;
  if (init?.body && typeof init.body === "string") {
    try {
      parsedBody = JSON.parse(init.body);
    } catch { /* non-JSON body — failover not possible */ }
  }

  let primaryError: unknown = null;
  try {
    const response = await fetch(url, init);
    if (response.ok || !isRetryable(response.status)) return response;
    const errBody = await response.text();
    primaryError = new Error(`Primary AI ${response.status}: ${errBody}`);
    console.warn(`⚠️ Primary AI provider returned ${response.status}, attempting failover…`);
  } catch (err) {
    primaryError = err;
    console.warn(`⚠️ Primary AI provider threw: ${err instanceof Error ? err.message : err}. Attempting failover…`);
  }

  if (!parsedBody) {
    // Cannot translate request -> bubble original failure
    throw primaryError;
  }

  try {
    if (isLovable) {
      const fb = await fallbackGatewayToGemini(parsedBody);
      console.log("✅ Recovered via Gemini direct failover");
      return fb;
    }
    if (isGemini) {
      const fb = await fallbackGeminiToGateway(url, parsedBody);
      console.log("✅ Recovered via Lovable Gateway failover");
      return fb;
    }
    // Unknown host — propagate original error
    throw primaryError;
  } catch (failoverErr) {
    console.error("❌ Both AI providers failed:", failoverErr);
    throw failoverErr;
  }
}
