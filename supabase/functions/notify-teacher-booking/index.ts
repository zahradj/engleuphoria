import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const payload = await req.json();
    
    const lessonId = payload.record?.id;
    if (!lessonId) {
      throw new Error("No lesson ID provided");
    }

    // Fetch lesson details with teacher and student info
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        id,
        title,
        scheduled_at,
        duration,
        room_link,
        users!lessons_teacher_id_fkey(email, full_name),
        users!lessons_student_id_fkey(full_name)
      `)
      .eq('id', lessonId)
      .single();

    if (lessonError || !lesson) {
      throw new Error(`Failed to fetch lesson: ${lessonError?.message}`);
    }

    const teacherEmail = lesson.users.email;
    const teacherName = lesson.users.full_name;
    const studentName = lesson.users.full_name;
    const scheduledDate = new Date(lesson.scheduled_at);

    const formattedDate = scheduledDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = scheduledDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "EngLeuphoria <notifications@resend.dev>",
        to: [teacherEmail],
        subject: `New Lesson Booked: ${lesson.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">New Lesson Booked! 🎉</h2>
            <p>Hi ${teacherName},</p>
            <p>Great news! <strong>${studentName}</strong> has booked a lesson with you.</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #7c3aed;">Lesson Details</h3>
              <p><strong>Title:</strong> ${lesson.title}</p>
              <p><strong>Student:</strong> ${studentName}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${formattedTime}</p>
            </div>
            
            <p>
              <a href="${lesson.room_link}" style="display: inline-block; background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
                Join Classroom
              </a>
            </p>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              You'll receive a reminder 1 hour before the lesson starts.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px;">
              This is an automated notification from EngLeuphoria. Please do not reply to this email.
            </p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error("Failed to send email:", error);
      throw new Error(`Email send failed: ${error}`);
    }

    const emailResult = await emailResponse.json();
    console.log("Email sent successfully to teacher:", emailResult);

    return new Response(
      JSON.stringify({ success: true, email_id: emailResult.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in notify-teacher-booking:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
