import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const client = createClient(supabaseUrl, serviceRoleKey);

  const body = await req.arrayBuffer();
  const fileName = new URL(req.url).searchParams.get("name") || "logo-white.png";

  const { data, error } = await client.storage
    .from("email-assets")
    .upload(fileName, body, { contentType: "image/png", upsert: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const { data: urlData } = client.storage.from("email-assets").getPublicUrl(fileName);

  return new Response(JSON.stringify({ success: true, url: urlData.publicUrl }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});
