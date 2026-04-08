import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { email, name, role, studentLevel, interests, mainGoal } = await req.json();

    console.log(`Sending welcome email to ${role}: ${name} (${email})`);

    const templateName = role === 'teacher' ? 'welcome-teacher' : 'welcome-student';
    const templateData: Record<string, any> = { name };
    if (studentLevel) templateData.studentLevel = studentLevel;
    if (interests) templateData.interests = interests;
    if (mainGoal) templateData.mainGoal = mainGoal;

    const { error } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName,
        recipientEmail: email,
        idempotencyKey: `welcome-${role}-${email}-${Date.now()}`,
        templateData,
      },
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
