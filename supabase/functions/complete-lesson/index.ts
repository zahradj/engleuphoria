import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getSequenceColumn(cefrLevel: string): string {
  switch (cefrLevel.toLowerCase().replace('-', '')) {
    case 'prea1':
    case 'pre-a1':
      return 'last_completed_sequence_prea1';
    case 'a1':
      return 'last_completed_sequence_a1';
    case 'a2':
      return 'last_completed_sequence_a2';
    case 'b1':
      return 'last_completed_sequence_b1';
    case 'b2':
      return 'last_completed_sequence_b2';
    default:
      return 'last_completed_sequence_prea1';
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { studentId, lessonId, score, timeSpentMinutes } = await req.json();
    
    if (!studentId || !lessonId) {
      console.error('[complete-lesson] Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Student ID and Lesson ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[complete-lesson] Completing lesson ${lessonId} for student ${studentId}`);

    // 1. Fetch the lesson details
    const { data: lesson, error: lessonError } = await supabase
      .from('interactive_lessons')
      .select('id, cefr_level, age_group, sequence_number, title')
      .eq('id', lessonId)
      .single();

    if (lessonError || !lesson) {
      console.error('[complete-lesson] Lesson not found:', lessonError);
      return new Response(
        JSON.stringify({ error: 'Lesson not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[complete-lesson] Lesson found: ${lesson.title}, sequence: ${lesson.sequence_number}`);

    // 2. Update lesson progress
    const { error: progressError } = await supabase
      .from('interactive_lesson_progress')
      .upsert({
        student_id: studentId,
        lesson_id: lessonId,
        lesson_status: 'completed',
        completed_at: new Date().toISOString(),
        score: score || null,
        time_spent_minutes: timeSpentMinutes || null,
        progress_percentage: 100
      }, {
        onConflict: 'student_id,lesson_id'
      });

    if (progressError) {
      console.error('[complete-lesson] Error updating progress:', progressError);
    }

    // 3. Update student's last_completed_sequence
    if (lesson.sequence_number) {
      const sequenceColumn = getSequenceColumn(lesson.cefr_level);
      
      // First get current value to ensure we only update if this is higher
      const { data: profile } = await supabase
        .from('student_profiles')
        .select(sequenceColumn)
        .eq('user_id', studentId)
        .maybeSingle();

      const currentSequence = profile?.[sequenceColumn] || 0;
      
      if (lesson.sequence_number > currentSequence) {
        const updateData: Record<string, number> = {};
        updateData[sequenceColumn] = lesson.sequence_number;

        const { error: updateError } = await supabase
          .from('student_profiles')
          .update(updateData)
          .eq('user_id', studentId);

        if (updateError) {
          console.error('[complete-lesson] Error updating sequence:', updateError);
        } else {
          console.log(`[complete-lesson] Updated ${sequenceColumn} to ${lesson.sequence_number}`);
        }
      }
    }

    // 4. Find and unlock the next lesson
    const nextSequence = (lesson.sequence_number || 0) + 1;
    
    const { data: nextLesson } = await supabase
      .from('interactive_lessons')
      .select('id, title, sequence_number')
      .eq('cefr_level', lesson.cefr_level)
      .eq('age_group', lesson.age_group)
      .eq('sequence_number', nextSequence)
      .eq('status', 'published')
      .maybeSingle();

    let nextLessonInfo = null;
    
    if (nextLesson) {
      // Create assignment for next lesson if it doesn't exist
      const { error: assignmentError } = await supabase
        .from('interactive_lesson_assignments')
        .upsert({
          student_id: studentId,
          lesson_id: nextLesson.id,
          is_unlocked: true,
          assigned_at: new Date().toISOString()
        }, {
          onConflict: 'student_id,lesson_id'
        });

      if (!assignmentError) {
        nextLessonInfo = {
          id: nextLesson.id,
          title: nextLesson.title,
          sequence: nextLesson.sequence_number
        };
        console.log(`[complete-lesson] Unlocked next lesson: ${nextLesson.title}`);
      }
    }

    console.log(`[complete-lesson] Successfully completed lesson ${lesson.title}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        completedLesson: {
          id: lesson.id,
          title: lesson.title,
          sequence: lesson.sequence_number
        },
        nextLesson: nextLessonInfo,
        message: nextLessonInfo 
          ? `Lesson complete! Next lesson "${nextLessonInfo.title}" unlocked!` 
          : 'Congratulations! You completed all lessons in this level!'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[complete-lesson] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
