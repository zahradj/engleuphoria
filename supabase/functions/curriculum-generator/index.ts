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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      curriculum_level_id,
      lesson_number,
      topic,
      cefr_level,
      grammar_focus,
      vocabulary_set,
      communication_outcome,
      lesson_objectives,
      estimated_duration = 45
    } = await req.json();

    console.log('🎯 Generating systematic lesson:', { topic, cefr_level, lesson_number });

    // Generate comprehensive lesson content
    const lessonPrompt = `Create a complete interactive English lesson for ${cefr_level} level students.

LESSON DETAILS:
- Topic: ${topic}
- Grammar Focus: ${grammar_focus}
- Vocabulary: ${vocabulary_set.join(', ')}
- Communication Outcome: ${communication_outcome}
- Objectives: ${lesson_objectives.join(', ')}
- Duration: ${estimated_duration} minutes

REQUIRED STRUCTURE:
Generate a complete lesson with exactly these slides in order:

1. TITLE SLIDE
   - Engaging title
   - Clear learning objectives (3-4 objectives)
   - Warm-up activity to grab attention

2. VOCABULARY SLIDES (2-3 slides)
   - New vocabulary with pronunciation guides
   - Visual descriptions for each word
   - Interactive vocabulary games (match, choose, drag-drop)

3. GRAMMAR FOCUS SLIDES (2 slides)
   - Clear grammar explanation with examples
   - Visual grammar rules
   - Interactive grammar practice (fill-in, reorder sentences)

4. INTERACTIVE PRACTICE SLIDES (3-4 slides)
   - Drag and drop activities
   - Multiple choice questions
   - Match activities
   - Fill-in-the-blank exercises
   - Reorder activities

5. SPEAKING PRACTICE SLIDE
   - Dialogue examples
   - Role-play scenarios
   - Conversation prompts
   - Pronunciation practice

6. LISTENING PRACTICE SLIDE
   - Listening scenario description
   - Comprehension questions
   - Audio activity instructions

7. WRITING PRACTICE SLIDE
   - Guided writing task
   - Sentence building exercises
   - Creative writing prompt

8. GAMIFIED REVIEW SLIDE
   - Quiz questions (5-8 questions)
   - Point system
   - Badge awards
   - Progress celebration

GAMIFICATION ELEMENTS:
- Award 10-15 points per completed activity
- Include badges: "Vocabulary Master", "Grammar Guru", "Speaking Star"
- Progress bar showing lesson completion
- Mini-challenges between slides
- Achievement celebrations

OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "lesson_title": "...",
  "slides_content": {
    "slides": [
      {
        "slide_number": 1,
        "type": "title",
        "title": "...",
        "content": {
          "objectives": [...],
          "warm_up": "..."
        }
      },
      // ... all other slides
    ]
  },
  "activities": [
    {
      "type": "drag_drop",
      "instructions": "...",
      "content": {...}
    }
    // ... all activities
  ],
  "gamified_elements": {
    "total_points": 120,
    "badges": [...],
    "mini_games": [...],
    "progress_milestones": [...]
  },
  "vocabulary_set": [...],
  "grammar_focus": "...",
  "communication_outcome": "..."
}

Make it engaging, age-appropriate, and systematically progressive!`;

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
            content: 'You are an expert English curriculum architect and lesson designer. Create systematic, engaging, and gamified lessons that follow CEFR progression standards. Always return valid JSON only.' 
          },
          { role: 'user', content: lessonPrompt }
        ],
        max_completion_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    // Parse the JSON response
    let lessonData;
    try {
      lessonData = JSON.parse(generatedContent);
    } catch (e) {
      console.error('❌ Failed to parse JSON:', e);
      throw new Error('Failed to parse lesson content');
    }

    // Save the lesson to database
    const { data: lesson, error: lessonError } = await supabase
      .from('systematic_lessons')
      .insert({
        curriculum_level_id,
        lesson_number,
        title: lessonData.lesson_title,
        topic,
        grammar_focus: lessonData.grammar_focus,
        vocabulary_set: lessonData.vocabulary_set,
        communication_outcome: lessonData.communication_outcome,
        lesson_objectives,
        slides_content: lessonData.slides_content,
        activities: lessonData.activities,
        gamified_elements: lessonData.gamified_elements,
        estimated_duration,
        status: 'published'
      })
      .select()
      .single();

    if (lessonError) {
      console.error('❌ Database error:', lessonError);
      throw lessonError;
    }

    console.log('✅ Lesson generated successfully:', lesson.id);

    return new Response(JSON.stringify({ 
      success: true,
      lesson_id: lesson.id,
      lesson_title: lessonData.lesson_title,
      slides_count: lessonData.slides_content.slides.length,
      activities_count: lessonData.activities.length,
      total_points: lessonData.gamified_elements.total_points
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in curriculum-generator function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});