import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      contentType, 
      cefrLevel, 
      topic, 
      difficultyLevel, 
      learningObjectives,
      duration,
      studentId 
    } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create content generation prompt based on type
    let prompt = '';
    switch (contentType) {
      case 'lesson':
        prompt = `Create a comprehensive English lesson for ${cefrLevel} level students.
Topic: ${topic}
Duration: ${duration} minutes
Difficulty: ${difficultyLevel}/10
Learning Objectives: ${learningObjectives?.join(', ')}

Include:
1. Lesson introduction and objectives
2. Vocabulary list with definitions and examples
3. Grammar points with clear explanations
4. Practice exercises (3-5 varied activities)
5. Assessment questions
6. Homework suggestions

Format as structured JSON with sections for easy parsing.`;
        break;

      case 'exercise':
        prompt = `Generate interactive English exercises for ${cefrLevel} level.
Topic: ${topic}
Difficulty: ${difficultyLevel}/10
Objectives: ${learningObjectives?.join(', ')}

Create 5-7 varied exercises including:
- Multiple choice questions
- Fill-in-the-blank
- Matching activities
- Short answer questions
- Error correction

Each exercise should have clear instructions, questions, and answer keys.
Format as JSON with exercise type, instructions, questions, and answers.`;
        break;

      case 'quiz':
        prompt = `Create an assessment quiz for ${cefrLevel} English learners.
Topic: ${topic}
Difficulty: ${difficultyLevel}/10
Duration: ${duration} minutes

Include:
- 10-15 questions of varying types
- Clear instructions
- Point values for each question
- Comprehensive answer key with explanations
- Performance rubric

Mix question types: multiple choice, true/false, short answer, essay.
Format as JSON with metadata and question array.`;
        break;

      case 'worksheet':
        prompt = `Design a printable worksheet for ${cefrLevel} English students.
Topic: ${topic}
Difficulty: ${difficultyLevel}/10

Include:
- Clear title and instructions
- Student name/date fields
- 8-12 engaging activities
- Visual elements descriptions
- Answer key
- Teacher notes

Activities should be varied and engaging. Format as JSON with layout structure.`;
        break;

      default:
        throw new Error('Invalid content type');
    }

    console.log('Generating content with OpenAI:', contentType);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are an expert English language curriculum designer and teacher trainer. Generate high-quality, pedagogically sound educational content that is engaging, age-appropriate, and aligned with CEFR standards. Always format responses as valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(data.error?.message || 'Failed to generate content');
    }

    let generatedContent;
    try {
      generatedContent = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      // If JSON parsing fails, wrap the content
      generatedContent = {
        type: contentType,
        content: data.choices[0].message.content,
        generated_at: new Date().toISOString()
      };
    }

    // Save to adaptive_content table
    const { data: savedContent, error: saveError } = await supabase
      .from('adaptive_content')
      .insert({
        title: `AI-Generated ${contentType}: ${topic}`,
        content_type: contentType,
        difficulty_level: difficultyLevel,
        cefr_level: cefrLevel,
        learning_objectives: learningObjectives || [],
        content_data: generatedContent,
        ai_generated: true,
        generation_prompt: prompt,
        tags: [topic, cefrLevel, `difficulty_${difficultyLevel}`],
        estimated_duration: duration || 30,
        is_active: true
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving content:', saveError);
      throw saveError;
    }

    // Record learning event if student ID provided
    if (studentId) {
      await supabase.from('ai_learning_events').insert({
        student_id: studentId,
        event_type: 'content_generated',
        content_id: savedContent.id,
        event_data: {
          content_type: contentType,
          topic,
          difficulty_level: difficultyLevel,
          generation_time: new Date().toISOString()
        }
      });
    }

    console.log('Content generated and saved successfully');

    return new Response(JSON.stringify({ 
      content: savedContent,
      generated_content: generatedContent,
      content_id: savedContent.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-content-generator function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});