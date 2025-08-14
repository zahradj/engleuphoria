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
      studentAge,
      isBulkGeneration = false,
      curriculumContext = null,
      objectives = [],
      requirements = ''
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

    // Enhanced prompt generation incorporating 10 neuroscience-based learning principles
    let prompt = '';
    
    // Common neuroscience-based instructions applied to all content types
    const neuroscienceInstructions = `
APPLY THESE 10 NEUROSCIENCE-BASED LEARNING PRINCIPLES:

1. NOVELTY EFFECT: Include unexpected elements, surprise challenges, varied formats, and novel sound effect suggestions
2. PICTURE SUPERIORITY EFFECT: Pair all new vocabulary with vivid images, GIFs, emojis, and color-coded visuals  
3. DUAL CODING: Combine verbal explanations with visual elements, gestures, animations, and multi-sensory input
4. RETRIEVAL PRACTICE: Include mini-quizzes, "teach back" moments, recall questions, and active memory retrieval
5. CHUNKED LEARNING: Break content into 5-8 minute segments with micro-activities between sections
6. TESTING EFFECT: Add frequent low-stakes comprehension checks and "guess before reveal" questions
7. EMOTIONAL ENGAGEMENT: Personalize examples, use roleplay/storytelling, celebration suggestions, and enthusiastic praise
8. GENERATION EFFECT: Let students predict, create examples, and generate their own content
9. INTERLEAVING: Mix topics, alternate between skills (reading/writing/speaking/listening), review older material
10. MULTISENSORY INPUT: Engage multiple senses, include movement, gestures, sounds, visuals, and kinesthetic elements

Make content brain-friendly, engaging, and scientifically optimized for retention and recall.`;

    // Enhanced bulk generation context
    const bulkContext = isBulkGeneration && curriculumContext ? `
BULK CURRICULUM CONTEXT:
- Level: ${curriculumContext.level}
- Week: ${curriculumContext.week}/${curriculumContext.totalWeeks}
- Theme: ${curriculumContext.theme}
- Lesson Number: ${curriculumContext.lessonNumber}
- This is part of a complete A-Z curriculum generation process
- Ensure consistency with previous lessons in this level
- Reference real-world, current events and internet content
- Include cultural integration from multiple English-speaking countries
- Target sentence complexity: ${curriculumContext.level === 'A1' ? '5-8 words' : 
  curriculumContext.level === 'A2' ? '8-12 words' :
  curriculumContext.level === 'B1' ? '12-18 words' :
  curriculumContext.level === 'B2' ? '18-22 words' :
  curriculumContext.level === 'C1' ? '22-25 words' : '25+ words'}
` : '';

    switch (actualContentType) {
      case 'lesson':
      case 'lesson_plan':
        prompt = `Create a neuroscience-optimized English lesson plan for ${actualLevel} level students.
Topic: ${topic}
Duration: ${duration || 45} minutes
Student Age: ${studentAge || 'Not specified'}
Learning Objectives: ${learningObjectives?.join(', ') || objectives?.join(', ') || 'General language learning'}
Specific Requirements: ${specificRequirements || requirements || 'None'}

${bulkContext}

${neuroscienceInstructions}

Structure the lesson with:
1. Attention-grabbing novelty opener (3-5 min) - unexpected element to trigger curiosity
2. Visual vocabulary introduction with dual coding (8-10 min) - images + verbal explanations
3. Chunked learning segments (3x 7-8 min blocks) with micro-activities between
4. Retrieval practice mini-quizzes after each chunk
5. Emotional engagement through personalized examples and storytelling
6. Generation activities where students create their own content
7. Interleaved skill practice (mixing reading/writing/speaking/listening)
8. Multisensory consolidation with movement and gestures
9. Surprise mystery challenge mid-lesson
10. Active recall summary with student "teach back" moments

Include specific sound effect suggestions, color-coding systems, gesture instructions, and celebration triggers.
Format as structured JSON with detailed implementation notes.`;
        break;

      case 'worksheet':
        prompt = `Design a neuroscience-optimized printable worksheet for ${actualLevel} English students.
Topic: ${topic}
Student Age: ${studentAge || 'Not specified'}
Learning Objectives: ${learningObjectives?.join(', ') || 'General practice'}
Specific Requirements: ${specificRequirements || 'None'}

${neuroscienceInstructions}

Create a brain-friendly worksheet with:
- Novelty elements: Unexpected formats, surprise boxes, varied activity styles
- Picture superiority: Vivid image descriptions paired with every new word
- Dual coding: Visual + verbal instruction combinations
- Chunked sections: 3-4 distinct 5-minute activity blocks
- Retrieval practice: Quick recall boxes between sections
- Emotional engagement: Personalized example spaces for student interests
- Generation activities: Spaces for students to create their own examples
- Interleaving: Mix different skills within the worksheet
- Multisensory cues: Movement instructions, color-coding, texture suggestions
- Testing effect: Mini self-check quizzes embedded throughout

Include celebration checkboxes, sound effect suggestions for teachers, and brain break activities.
Format as JSON with detailed visual layout and implementation instructions.`;
        break;

      case 'activity':
        prompt = `Create neuroscience-enhanced interactive English activities for ${actualLevel} level students.
Topic: ${topic}
Duration: ${duration || 30} minutes
Student Age: ${studentAge || 'Not specified'}
Learning Objectives: ${learningObjectives?.join(', ') || 'Interactive practice'}
Specific Requirements: ${specificRequirements || 'None'}

${neuroscienceInstructions}

Design 5-7 brain-optimized activities featuring:
- Novelty hooks: Surprise elements, unexpected twists, varied formats
- Picture superiority: Activities pairing visuals with language learning
- Dual coding: Combine verbal instructions with visual demonstrations
- Chunked timing: 5-8 minute activity segments with transition breaks
- Retrieval practice: Built-in recall moments and memory challenges
- Emotional engagement: Personalized scenarios, role-play opportunities
- Generation tasks: Students create their own content and examples
- Interleaved practice: Mix speaking, listening, reading, writing within activities
- Multisensory engagement: Movement, gestures, sounds, tactile elements
- Testing integration: Quick formative assessments embedded naturally

Include specific celebration triggers, sound effect cues, and brain-break suggestions.
Format as JSON with detailed neuroscience implementation notes for each activity.`;
        break;

      case 'quiz':
        prompt = `Create a neuroscience-optimized assessment quiz for ${actualLevel} English learners.
Topic: ${topic}
Duration: ${duration || 20} minutes
Student Age: ${studentAge || 'Not specified'}
Learning Objectives: ${learningObjectives?.join(', ') || 'Assessment of understanding'}

${neuroscienceInstructions}

Design a brain-friendly quiz incorporating:
- Novelty elements: Unexpected question formats, surprise bonus rounds
- Picture superiority: Visual questions paired with text-based ones
- Dual coding: Questions combining images with verbal prompts
- Chunked sections: 3-4 distinct quiz segments with micro-breaks
- Retrieval practice: Progressive difficulty to strengthen recall
- Emotional engagement: Personalized scenarios in questions
- Generation opportunities: Creative response sections
- Interleaved assessment: Mix different skill types throughout
- Multisensory questions: Include listening, visual, and kinesthetic elements
- Celebration triggers: Achievement badges and progress indicators

Include 12-18 varied questions with brain-friendly formatting, celebration checkpoints, and confidence boosters.
Add specific sound effect suggestions and visual enhancement notes.
Format as JSON with neuroscience implementation guidance.`;
        break;

      case 'flashcards':
        prompt = `Create neuroscience-enhanced educational flashcards for ${actualLevel} English learners.
Topic: ${topic}
Student Age: ${studentAge || 'Not specified'}
Learning Objectives: ${learningObjectives?.join(', ') || 'Vocabulary memorization'}
Specific Requirements: ${specificRequirements || 'None'}

${neuroscienceInstructions}

Generate 20-30 brain-optimized flashcards featuring:
- Novelty elements: Unexpected memory tricks, varied card formats
- Picture superiority: Vivid visual descriptions for every card
- Dual coding: Combine images with verbal memory aids
- Chunked organization: Group cards by themes for manageable learning
- Retrieval practice: Progressive spaced repetition suggestions
- Emotional engagement: Personal connection prompts and relatable examples
- Generation tasks: Student-created example spaces
- Interleaved topics: Mix different word types and grammatical categories
- Multisensory memory aids: Gesture suggestions, sound associations, tactile cues
- Self-testing integration: Built-in quiz functionality

Include memory palace techniques, mnemonic devices, and celebration milestones.
Add specific study sequence recommendations and brain-break timing.
Format as JSON with advanced memory enhancement features.`;
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
            content: `You are an expert English language curriculum designer, neuroscience-informed pedagogy specialist, and master teacher trainer. 

You understand how the brain learns languages and apply cutting-edge neuroscience research to create highly effective, brain-friendly educational content. You specialize in:

- Novelty Effect (attention through unexpected stimuli)
- Picture Superiority Effect (visual-verbal memory enhancement) 
- Dual Coding Theory (multi-modal information processing)
- Retrieval Practice (active recall strengthening)
- Chunked Learning (working memory optimization)
- Testing Effect (frequent low-stakes assessment)
- Emotional Engagement (memory consolidation through emotion)
- Generation Effect (self-created content retention)
- Interleaving (mixed practice for adaptability)
- Multisensory Input (comprehensive sensory engagement)

Generate scientifically-optimized, pedagogically sound, engaging, age-appropriate content aligned with CEFR standards. Always format responses as valid JSON with detailed implementation notes for neuroscience-based teaching strategies.`
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