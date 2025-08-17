import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      teacher_id, 
      title, 
      topic, 
      cefr_level, 
      age_group, 
      duration_minutes, 
      objectives, 
      activities 
    } = await req.json();

    console.log('🎯 Starting AI lesson generation:', { title, topic, cefr_level });

    // Create lesson record first
    const { data: lesson, error: lessonError } = await supabase
      .from('ai_lessons')
      .insert({
        teacher_id,
        title,
        topic,
        cefr_level,
        age_group,
        duration_minutes,
        objectives,
        activities,
        generation_prompt: `Generate a ${duration_minutes}-minute ${cefr_level} lesson on ${topic} for ages ${age_group}`,
        generation_status: 'generating'
      })
      .select()
      .single();

    if (lessonError) {
      console.error('❌ Error creating lesson:', lessonError);
      throw lessonError;
    }

    console.log('✅ Lesson created:', lesson.id);

    // Start background generation
    EdgeRuntime.waitUntil(generateLessonMaterials(lesson));

    return new Response(JSON.stringify({ 
      lesson_id: lesson.id,
      status: 'generation_started',
      message: 'Lesson generation started. You will be notified when complete.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in ai-multigen function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateLessonMaterials(lesson: any) {
  try {
    console.log('🤖 Generating materials for lesson:', lesson.id);

    // Generate slides content
    const slidesPrompt = `Create engaging HTML slides for a ${lesson.duration_minutes}-minute ${lesson.cefr_level} English lesson on "${lesson.topic}" for ages ${lesson.age_group}.

Requirements:
- Create 8-12 slides with clear titles
- Include vocabulary introduction, practice activities, and review
- Use simple, colorful HTML with inline CSS
- Make it interactive and age-appropriate
- Include images using placeholder URLs
- Objectives: ${lesson.objectives.join(', ')}
- Activities: ${lesson.activities.join(', ')}

Return only clean HTML that can be displayed in an iframe.`;

    const slidesResponse = await callOpenAI(slidesPrompt);
    const slidesContent = slidesResponse.choices[0].message.content;

    // Generate worksheet content
    const worksheetPrompt = `Create a printable worksheet for a ${lesson.cefr_level} English lesson on "${lesson.topic}" for ages ${lesson.age_group}.

Include:
- Title and instructions
- 5-6 varied exercises (matching, fill-in-blanks, writing prompts)
- Visual elements and clear formatting
- Answer key at the bottom

Format as clean HTML that can be converted to PDF.`;

    const worksheetResponse = await callOpenAI(worksheetPrompt);
    const worksheetContent = worksheetResponse.choices[0].message.content;

    // Generate quiz content
    const quizPrompt = `Create an interactive quiz for a ${lesson.cefr_level} English lesson on "${lesson.topic}" for ages ${lesson.age_group}.

Include:
- 10 questions (multiple choice, drag & drop, fill-in-blanks)
- Clear instructions
- Immediate feedback
- Progress tracking

Return as JSON format with questions array containing: type, question, options, correct_answer, feedback.`;

    const quizResponse = await callOpenAI(quizPrompt);
    const quizContent = quizResponse.choices[0].message.content;

    // Generate teacher guide
    const guidePrompt = `Create a comprehensive teacher guide for a ${lesson.duration_minutes}-minute ${lesson.cefr_level} English lesson on "${lesson.topic}" for ages ${lesson.age_group}.

Include:
- Lesson overview and objectives
- Timing breakdown
- Teaching tips and variations
- Extension activities
- Assessment rubric
- Materials needed

Format as structured HTML.`;

    const guideResponse = await callOpenAI(guidePrompt);
    const guideContent = guideResponse.choices[0].message.content;

    // Save all artifacts to database
    const artifacts = [
      {
        lesson_id: lesson.id,
        artifact_type: 'slides',
        title: `${lesson.title} - Slides`,
        content: slidesContent,
        file_type: 'html',
        metadata: { slide_count: extractSlideCount(slidesContent) }
      },
      {
        lesson_id: lesson.id,
        artifact_type: 'worksheet',
        title: `${lesson.title} - Worksheet`,
        content: worksheetContent,
        file_type: 'html',
        metadata: { printable: true }
      },
      {
        lesson_id: lesson.id,
        artifact_type: 'quiz',
        title: `${lesson.title} - Quiz`,
        content: quizContent,
        file_type: 'json',
        metadata: { question_count: extractQuestionCount(quizContent) }
      },
      {
        lesson_id: lesson.id,
        artifact_type: 'teacher_guide',
        title: `${lesson.title} - Teacher Guide`,
        content: guideContent,
        file_type: 'html',
        metadata: { comprehensive: true }
      }
    ];

    const { error: artifactsError } = await supabase
      .from('ai_lesson_artifacts')
      .insert(artifacts);

    if (artifactsError) {
      console.error('❌ Error saving artifacts:', artifactsError);
      throw artifactsError;
    }

    // Update lesson status to completed
    await supabase
      .from('ai_lessons')
      .update({ 
        generation_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', lesson.id);

    console.log('✅ Lesson generation completed:', lesson.id);

  } catch (error) {
    console.error('❌ Error in background generation:', error);
    
    // Update lesson status to failed
    await supabase
      .from('ai_lessons')
      .update({ 
        generation_status: 'failed',
        generation_error: error.message,
        updated_at: new Date().toISOString()
      })
      .eq('id', lesson.id);
  }
}

async function callOpenAI(prompt: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert English language teacher and curriculum designer. Create high-quality, engaging educational content.' 
        },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ OpenAI API error:', error);
    throw new Error(`OpenAI API error: ${error}`);
  }

  return await response.json();
}

function extractSlideCount(content: string): number {
  const matches = content.match(/<div[^>]*class[^>]*slide[^>]*>/gi);
  return matches ? matches.length : 8;
}

function extractQuestionCount(content: string): number {
  try {
    const parsed = JSON.parse(content);
    return parsed.questions ? parsed.questions.length : 10;
  } catch {
    return 10;
  }
}