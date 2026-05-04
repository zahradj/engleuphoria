import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { aiFetch } from "../_shared/aiFetch.ts";
import { requireAuth } from "../_shared/authGuard.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const auth = await requireAuth(req, { allowedRoles: ['admin', 'content_creator', 'teacher'] });
  if (!auth.ok) {
    return new Response(JSON.stringify(auth.body), {
      status: auth.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { texts, direction, targetLevel, hub } = await req.json();
    if (!Array.isArray(texts) || texts.length === 0) {
      return new Response(JSON.stringify({ error: 'texts (array) is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const dir = direction === 'harder' ? 'harder' : 'easier';
    const level = targetLevel || (hub === 'playground' ? 'A1' : 'B1');
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) throw new Error('LOVABLE_API_KEY not configured');

    const sys = `You are an ESL editor. Rewrite each input string to be ${dir} for a ${level} learner. Preserve meaning, length range (±25%), and tone. ${
      dir === 'easier'
        ? 'Use shorter sentences, common words, simpler grammar.'
        : 'Use richer vocabulary, more complex grammar (subordinate clauses, varied tenses).'
    } Return STRICT JSON: { "rewritten": string[] } with the SAME order and length as the input array.`;

    const resp = await aiFetch(LOVABLE_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: JSON.stringify({ texts }) },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.6,
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`AI ${resp.status}: ${t.slice(0, 300)}`);
    }
    const data = await resp.json();
    const raw = data.choices?.[0]?.message?.content || '{}';
    let parsed: any;
    try { parsed = JSON.parse(raw); } catch { parsed = {}; }
    const rewritten: string[] = Array.isArray(parsed.rewritten) ? parsed.rewritten : [];
    // Pad/trim to match
    while (rewritten.length < texts.length) rewritten.push(texts[rewritten.length]);
    return new Response(JSON.stringify({ rewritten: rewritten.slice(0, texts.length), direction: dir, level }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('ai-rewrite-text error:', err);
    return new Response(JSON.stringify({ error: true, message: (err as Error).message }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
