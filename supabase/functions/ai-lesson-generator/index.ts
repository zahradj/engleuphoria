import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, cefrLevel, moduleNumber, lessonNumber, learningObjectives, customRequirements } = await req.json();

    console.log('Generating lesson for:', { topic, cefrLevel, moduleNumber, lessonNumber });

    const prompt = `Create an interactive ESL lesson with exactly 22 slides for ${cefrLevel} level students.

LESSON DETAILS:
- Topic: ${topic}
- CEFR Level: ${cefrLevel}
- Module: ${moduleNumber}, Lesson: ${lessonNumber}
- Learning Objectives: ${learningObjectives?.join(', ') || 'Practice vocabulary, grammar, and communication'}
- Custom Requirements: ${customRequirements || 'None'}

SLIDE STRUCTURE (exactly 22 slides):
1. Title & Objectives
2. Warm-up
3-4. Vocabulary Introduction (2 slides)
5-6. Grammar Concept (2 slides)
7-8. Listening Activity (2 slides)
9-12. Speaking Practice (4 slides with role-plays)
13-15. Reading Activity (3 slides)
16-17. Writing Task (2 slides)
18-20. Gamified Review (3 slides)
21. Wrap-up & Assessment
22. Homework & Next Steps

DESIGN REQUIREMENTS:
- Use professional mist-blue theme (#f0f9ff background, #0369a1 primary)
- Interactive elements: drag-and-drop, multiple choice, matching
- Real-life scenarios and practical communication
- Include vocabulary and grammar focus for each slide
- Clear instructions for teachers

Return ONLY a valid JSON object with this structure:
{
  "title": "Lesson title",
  "topic": "${topic}",
  "cefr_level": "${cefrLevel}",
  "module_number": ${moduleNumber},
  "lesson_number": ${lessonNumber},
  "learning_objectives": ["objective1", "objective2"],
  "vocabulary_focus": ["word1", "word2"],
  "grammar_focus": ["concept1", "concept2"],
  "duration_minutes": 60,
  "slides": [
    {
      "id": "slide-1",
      "type": "warmup",
      "prompt": "Slide content/question",
      "instructions": "Teacher instructions",
      "media": {"type": "image", "alt": "Description"},
      "options": [{"id": "1", "text": "Option 1", "isCorrect": true}],
      "timeLimit": 300,
      "accessibility": {"screenReaderText": "Description"}
    }
  ]
}

Use these slide types: warmup, vocabulary_preview, target_language, listening_comprehension, sentence_builder, pronunciation_shadow, grammar_focus, accuracy_mcq, transform, error_fix, picture_description, controlled_practice, controlled_output, micro_input, roleplay_setup, communicative_task, fluency_sprint, review_consolidation, exit_check, picture_choice, labeling, tpr_phonics.`;

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
            content: 'You are an expert ESL curriculum designer. Create professional, interactive lesson slides that follow modern language teaching methodologies. Always return valid JSON only.' 
          },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('Generated content preview:', generatedContent.substring(0, 200));

    // Parse the JSON response
    let lessonData;
    try {
      lessonData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', generatedContent);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate the lesson data structure
    if (!lessonData.slides || !Array.isArray(lessonData.slides)) {
      throw new Error('Invalid lesson structure: slides array missing');
    }

    // Store in Supabase
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    const { data: savedLesson, error: saveError } = await supabase
      .from('lessons_content')
      .insert({
        title: lessonData.title,
        topic: lessonData.topic,
        cefr_level: lessonData.cefr_level,
        module_number: lessonData.module_number,
        lesson_number: lessonData.lesson_number,
        slides_content: {
          version: '2.0',
          theme: 'mist-blue',
          slides: lessonData.slides,
          durationMin: lessonData.duration_minutes,
          total_slides: lessonData.slides.length,
          metadata: {
            CEFR: lessonData.cefr_level,
            module: lessonData.module_number,
            lesson: lessonData.lesson_number,
            targets: lessonData.learning_objectives,
            weights: { accuracy: 0.6, fluency: 0.4 }
          }
        },
        learning_objectives: lessonData.learning_objectives,
        vocabulary_focus: lessonData.vocabulary_focus,
        grammar_focus: lessonData.grammar_focus,
        duration_minutes: lessonData.duration_minutes,
        metadata: {
          generated_by: 'ai-lesson-generator',
          slide_count: lessonData.slides.length,
          custom_requirements: customRequirements
        }
      })
      .select()
      .single();

    if (saveError) {
      console.error('Supabase save error:', saveError);
      throw new Error(`Failed to save lesson: ${saveError.message}`);
    }

    console.log('Lesson saved successfully:', savedLesson.id);

    return new Response(JSON.stringify({
      success: true,
      lesson: savedLesson,
      message: `Generated ${lessonData.slides.length} slides for "${lessonData.title}"`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-lesson-generator:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});