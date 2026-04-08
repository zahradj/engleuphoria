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

    const { type, teacherName, teacherEmail, interviewDate, interviewTime, rejectionReason } = await req.json();

    console.log(`Processing teacher email type '${type}' to ${teacherEmail}`);

    // Map old types to transactional templates
    let templateName: string;
    const templateData: Record<string, any> = { name: teacherName };

    switch (type) {
      case 'approval':
        templateName = 'final-welcome';
        break;
      case 'rejection':
        templateName = 'application-rejected';
        templateData.rejectionReason = rejectionReason;
        break;
      case 'interview_invite':
        templateName = 'interview-invitation';
        templateData.interviewDate = interviewDate;
        templateData.interviewTime = interviewTime;
        break;
      case 'video_rejection':
        templateName = 'video-rejected';
        templateData.rejectionReason = rejectionReason;
        break;
      case 'video_approved':
        templateName = 'video-approved';
        break;
      default:
        throw new Error(`Invalid email type: ${type}`);
    }

    const { error } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName,
        recipientEmail: teacherEmail,
        idempotencyKey: `teacher-${type}-${teacherEmail}-${Date.now()}`,
        templateData,
      },
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-teacher-emails:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
