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
    console.log('Request received:', req.method);
    
    const requestBody = await req.json();
    console.log('Request body received:', JSON.stringify(requestBody, null, 2));
    
    const { 
      type,
      contentType, 
      level,
      cefrLevel, 
      topic, 
      difficultyLevel, 
      learningObjectives,
      duration,
      studentId,
      specificRequirements,
      studentAge
    } = requestBody;

    // Use 'type' if available, otherwise fall back to 'contentType'
    const actualContentType = type || contentType;
    const actualLevel = level || cefrLevel;

    console.log('Parsed values:', {
      actualContentType,
      actualLevel,
      topic,
      duration,
      learningObjectives
    });

    if (!actualContentType) {
      console.error('No content type provided in request body');
      throw new Error('Content type is required');
    }

    if (!topic) {
      console.error('No topic provided in request body');
      throw new Error('Topic is required');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create content generation prompt based on type
    let prompt = '';
    switch (actualContentType) {
      case 'lesson':
      case 'lesson_plan':
        prompt = `Create a comprehensive English lesson plan for ${actualLevel} level students.
Topic: ${topic}
Duration: ${duration || 45} minutes
Student Age: ${studentAge || 'Not specified'}
Learning Objectives: ${learningObjectives?.join(', ') || 'General language learning'}
Specific Requirements: ${specificRequirements || 'None'}

Include:
1. Lesson title and objectives
2. Materials needed
3. Warm-up activity (5-10 minutes)
4. Main lesson content with vocabulary and grammar
5. Practice activities (20-30 minutes)
6. Assessment and feedback
7. Homework assignment
8. Extension activities for advanced learners

Format as structured JSON with clear sections for easy implementation.`;
        break;

      case 'worksheet':
        prompt = `Design a printable worksheet for ${actualLevel} English students.
Topic: ${topic}
Student Age: ${studentAge || 'Not specified'}
Learning Objectives: ${learningObjectives?.join(', ') || 'General practice'}
Specific Requirements: ${specificRequirements || 'None'}

Include:
- Clear title and instructions
- Student name/date fields
- 8-12 engaging activities
- Visual elements descriptions where helpful
- Answer key for teachers
- Difficulty progression from easy to challenging

Activities should be varied and engaging. Format as JSON with layout structure.`;
        break;

      case 'activity':
        prompt = `Create interactive English activities for ${actualLevel} level students.
Topic: ${topic}
Duration: ${duration || 30} minutes
Student Age: ${studentAge || 'Not specified'}
Learning Objectives: ${learningObjectives?.join(', ') || 'Interactive practice'}
Specific Requirements: ${specificRequirements || 'None'}

Generate 5-7 varied activities including:
- Speaking activities and role-plays
- Interactive games
- Group work exercises
- Creative tasks
- Technology-enhanced activities

Each activity should have clear instructions, materials needed, and learning outcomes.
Format as JSON with activity type, instructions, materials, and procedures.`;
        break;

      case 'quiz':
        prompt = `Create an assessment quiz for ${actualLevel} English learners.
Topic: ${topic}
Duration: ${duration || 20} minutes
Student Age: ${studentAge || 'Not specified'}
Learning Objectives: ${learningObjectives?.join(', ') || 'Assessment of understanding'}

Include:
- 10-15 questions of varying types
- Clear instructions for each section
- Point values for each question
- Comprehensive answer key with explanations
- Performance rubric and grading criteria

Mix question types: multiple choice, true/false, short answer, fill-in-the-blank.
Format as JSON with metadata and question array.`;
        break;

      case 'flashcards':
        prompt = `Create educational flashcards for ${actualLevel} English learners.
Topic: ${topic}
Student Age: ${studentAge || 'Not specified'}
Learning Objectives: ${learningObjectives?.join(', ') || 'Vocabulary memorization'}
Specific Requirements: ${specificRequirements || 'None'}

Generate 15-25 flashcards including:
- Vocabulary words with definitions
- Example sentences showing usage
- Synonyms and antonyms where applicable
- Visual description suggestions
- Memory tips or mnemonics

Each flashcard should have a front (word/concept) and back (definition/explanation).
Format as JSON with flashcard array and study instructions.`;
        break;

      default:
        throw new Error(`Invalid content type: ${actualContentType}. Supported types: worksheet, activity, lesson_plan, quiz, flashcards`);
    }

    console.log('Generating content with OpenAI:', actualContentType, 'for level:', actualLevel);

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
        type: actualContentType,
        content: data.choices[0].message.content,
        generated_at: new Date().toISOString()
      };
    }

    // Save to adaptive_content table
    const cefrLevelMapping = {
      'beginner': 'A1',
      'intermediate': 'B1', 
      'advanced': 'C1'
    };
    
    const mappedCefrLevel = actualLevel && cefrLevelMapping[actualLevel] 
      ? cefrLevelMapping[actualLevel] 
      : actualLevel || 'B1'; // Default to B1 if no level provided

    console.log('Saving to database with CEFR level:', mappedCefrLevel);

    const { data: savedContent, error: saveError } = await supabase
      .from('adaptive_content')
      .insert({
        title: `AI-Generated ${actualContentType}: ${topic}`,
        content_type: actualContentType,
        difficulty_level: difficultyLevel || 5,
        cefr_level: mappedCefrLevel,
        learning_objectives: learningObjectives || [],
        content_data: generatedContent,
        ai_generated: true,
        generation_prompt: prompt,
        tags: [topic, mappedCefrLevel, `difficulty_${difficultyLevel || 5}`],
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
          content_type: actualContentType,
          topic,
          difficulty_level: difficultyLevel || 5,
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