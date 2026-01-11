// Shared Gemini API Client for Edge Functions
// Supports gemini-2.5-flash (fast) and gemini-2.5-pro (powerful)

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiOptions {
  model?: 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gemini-1.5-flash' | 'gemini-1.5-pro';
  systemInstruction?: string;
  messages: GeminiMessage[];
  maxTokens?: number;
  temperature?: number;
  responseType?: 'text' | 'json';
}

export interface GeminiResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export async function callGemini(options: GeminiOptions): Promise<GeminiResponse> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const {
    model = 'gemini-2.5-flash',
    systemInstruction,
    messages,
    maxTokens = 2048,
    temperature = 0.7,
    responseType = 'text'
  } = options;

  const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;

  const requestBody: any = {
    contents: messages,
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: temperature,
    }
  };

  // Add system instruction if provided
  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  // Configure for JSON output if requested
  if (responseType === 'json') {
    requestBody.generationConfig.responseMimeType = 'application/json';
  }

  console.log(`Calling Gemini ${model}...`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Gemini API error (${response.status}):`, errorText);
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('No response from Gemini');
  }

  const candidate = data.candidates[0];
  
  if (candidate.finishReason === 'SAFETY') {
    throw new Error('Response blocked by safety filters');
  }

  const text = candidate.content?.parts?.[0]?.text || '';
  
  const usage = data.usageMetadata ? {
    promptTokens: data.usageMetadata.promptTokenCount || 0,
    completionTokens: data.usageMetadata.candidatesTokenCount || 0,
    totalTokens: data.usageMetadata.totalTokenCount || 0,
  } : undefined;

  console.log(`Gemini response received. Tokens used: ${usage?.totalTokens || 'unknown'}`);

  return { text, usage };
}

// Helper to convert OpenAI-style messages to Gemini format
export function convertToGeminiMessages(
  messages: Array<{ role: string; content: string }>
): GeminiMessage[] {
  return messages
    .filter(m => m.role !== 'system') // System handled separately
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
}

// Extract system message from OpenAI-style messages
export function extractSystemMessage(
  messages: Array<{ role: string; content: string }>
): string | undefined {
  const systemMessage = messages.find(m => m.role === 'system');
  return systemMessage?.content;
}

// Parse JSON from Gemini response (handles markdown code blocks)
export function parseGeminiJson<T>(text: string): T {
  let jsonStr = text.trim();
  
  // Remove markdown code blocks if present
  if (jsonStr.startsWith('```json')) {
    jsonStr = jsonStr.slice(7);
  } else if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.slice(3);
  }
  
  if (jsonStr.endsWith('```')) {
    jsonStr = jsonStr.slice(0, -3);
  }
  
  return JSON.parse(jsonStr.trim());
}
