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

    const { to, type, data } = await req.json();

    console.log(`Processing ${type} email to ${to}`);

    // Map old types to transactional templates
    let templateName: string;
    const templateData: Record<string, any> = {};

    switch (type) {
      case 'student-welcome':
        templateName = 'welcome-student';
        templateData.name = data?.userName;
        break;
      case 'teacher-welcome':
        templateName = 'welcome-teacher';
        templateData.name = data?.userName;
        break;
      default:
        // For email-confirmation, password-reset, login-notification, unusual-login-attempt
        // These are auth emails handled by auth-email-hook, not transactional
        console.log(`Email type '${type}' is handled by auth system, skipping transactional send`);
        return new Response(JSON.stringify({ success: true, note: 'Handled by auth system' }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    }

    const { error } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName,
        recipientEmail: to,
        idempotencyKey: `user-email-${type}-${to}-${Date.now()}`,
        templateData,
      },
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-user-emails:", error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
