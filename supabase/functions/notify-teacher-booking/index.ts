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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const payload = await req.json();
    const lessonId = payload.record?.id;

    if (!lessonId) {
      throw new Error("No lesson ID provided");
    }

    // Fetch lesson details with teacher and student info
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        id, title, scheduled_at, duration, room_link,
        teacher:users!lessons_teacher_id_fkey(email, full_name),
        student:users!lessons_student_id_fkey(full_name)
      `)
      .eq('id', lessonId)
      .single();

    if (lessonError || !lesson) {
      throw new Error(`Failed to fetch lesson: ${lessonError?.message}`);
    }

    const scheduledDate = new Date(lesson.scheduled_at);
    const formattedDate = scheduledDate.toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
    const formattedTime = scheduledDate.toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit",
    });

    const { error } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'teacher-booking',
        recipientEmail: lesson.teacher.email,
        idempotencyKey: `teacher-booking-${lessonId}`,
        templateData: {
          teacherName: lesson.teacher.full_name,
          studentName: lesson.student.full_name,
          lessonTitle: lesson.title,
          lessonDate: formattedDate,
          lessonTime: formattedTime,
          roomLink: lesson.room_link,
        },
      },
    });

    if (error) throw error;

    console.log("Teacher booking notification sent for lesson:", lessonId);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in notify-teacher-booking:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
