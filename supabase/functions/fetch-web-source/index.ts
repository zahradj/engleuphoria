// Fetch and clean text from a URL via Firecrawl, for source-grounded
// Lesson Blueprint generation (NotebookLM-style).
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";
const MAX_CHARS = 12000; // keep payload Gemini-friendly

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { url } = await req.json().catch(() => ({} as any));
    if (!url || typeof url !== "string" || !/^https?:\/\//i.test(url)) {
      return new Response(JSON.stringify({ error: "Valid http(s) url is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "FIRECRAWL_API_KEY not configured. Connect Firecrawl in Connectors." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const fcRes = await fetch(`${FIRECRAWL_V2}/scrape`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
      }),
    });

    const payload = await fcRes.json().catch(() => ({} as any));
    if (!fcRes.ok) {
      const message =
        payload?.error ||
        `Could not read this website (status ${fcRes.status}). It may be paywalled or block scrapers.`;
      return new Response(JSON.stringify({ error: message }), {
        status: fcRes.status === 402 ? 402 : 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = payload?.data ?? payload;
    const markdown: string = data?.markdown ?? "";
    const title: string = data?.metadata?.title ?? "";
    const sourceURL: string = data?.metadata?.sourceURL ?? url;

    const cleaned = markdown
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // strip image tags
      .replace(/\[(.*?)\]\([^)]+\)/g, "$1") // unwrap links
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!cleaned || cleaned.length < 200) {
      return new Response(
        JSON.stringify({
          error: "We could not extract enough readable text from that page. Try pasting the article text manually.",
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const text = cleaned.slice(0, MAX_CHARS);

    return new Response(
      JSON.stringify({
        text,
        title,
        source_url: sourceURL,
        truncated: cleaned.length > MAX_CHARS,
        chars: text.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("fetch-web-source failed:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
