import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

if (!openAIApiKey) {
  console.error('OPENAI_API_KEY environment variable is not set');
}
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();
    const { action = 'generate_single', content_id, slide_index, regenerate = false, batch_generate = false, slide_count = 22, structure } = body;

    console.log('AI Slide Generator called with:', { action, content_id, slide_index, regenerate, batch_generate });

    if (batch_generate) {
      return await handleBatchGeneration(supabase);
    }

    switch (action) {
      case 'generate_single':
        return await generateSingleSlide(supabase, content_id, slide_index);
      case 'generate_full_deck':
        return await generateFullDeck(supabase, content_id, slide_count, structure);
      case 'regenerate_slide':
        return await regenerateSlide(supabase, content_id, slide_index);
      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('Error in ai-slide-generator:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleBatchGeneration(supabase: any) {
  console.log('Starting batch generation for lessons without slides...');
  
  // Get lessons without slides
  const { data: lessonsWithoutSlides, error: fetchError } = await supabase
    .from('lessons_content')
    .select('*')
    .or('slides_content.is.null,slides_content.eq.{}');

  if (fetchError) {
    throw new Error(`Failed to fetch lessons: ${fetchError.message}`);
  }

  if (!lessonsWithoutSlides || lessonsWithoutSlides.length === 0) {
    return new Response(JSON.stringify({
      success: true,
      generated_count: 0,
      total_processed: 0,
      message: 'No lessons need slide generation'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let generatedCount = 0;
  const errors: string[] = [];

  for (const lesson of lessonsWithoutSlides) {
    try {
      await generateSlidesForLesson(supabase, lesson);
      generatedCount++;
      console.log(`Generated slides for lesson: ${lesson.title}`);
    } catch (error) {
      console.error(`Failed to generate slides for lesson ${lesson.id}:`, error);
      errors.push(`Lesson "${lesson.title}": ${error.message}`);
    }
  }

  return new Response(JSON.stringify({
    success: true,
    generated_count: generatedCount,
    total_processed: lessonsWithoutSlides.length,
    errors: errors
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generateSingleSlide(supabase: any, contentId: string, slideIndex: number) {
  if (!contentId) {
    throw new Error('Content ID is required for single slide generation');
  }

  // Get lesson content
  const { data: lesson, error: fetchError } = await supabase
    .from('lessons_content')
    .select('*')
    .eq('id', contentId)
    .single();

  if (fetchError || !lesson) {
    throw new Error(`Failed to fetch lesson: ${fetchError?.message || 'Lesson not found'}`);
  }

  const slide = await generateSlideContent(lesson, slideIndex);
  
  // Update the specific slide in the lesson
  const currentSlides = lesson.slides_content?.slides || [];
  currentSlides[slideIndex] = slide;

  const updatedSlidesContent = {
    ...lesson.slides_content,
    slides: currentSlides,
    total_slides: Math.max(currentSlides.length, (lesson.slides_content?.total_slides || 0))
  };

  const { error: updateError } = await supabase
    .from('lessons_content')
    .update({ slides_content: updatedSlidesContent })
    .eq('id', contentId);

  if (updateError) {
    throw new Error(`Failed to update lesson: ${updateError.message}`);
  }

  return new Response(JSON.stringify({
    success: true,
    slide: slide,
    slide_index: slideIndex
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generateFullDeck(supabase: any, contentId: string, slideCount: number = 22, structure?: string) {
  if (!contentId) {
    throw new Error('Content ID is required for full deck generation');
  }

  // Get lesson content
  const { data: lesson, error: fetchError } = await supabase
    .from('lessons_content')
    .select('*')
    .eq('id', contentId)
    .single();

  if (fetchError || !lesson) {
    throw new Error(`Failed to fetch lesson: ${fetchError?.message || 'Lesson not found'}`);
  }

  const slidesContent = await generateSlidesForLesson(supabase, lesson, slideCount, structure);

  return new Response(JSON.stringify({
    success: true,
    slides: slidesContent,
    total_slides: slidesContent.slides.length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function regenerateSlide(supabase: any, contentId: string, slideIndex: number) {
  return await generateSingleSlide(supabase, contentId, slideIndex);
}

async function generateSlidesForLesson(supabase: any, lesson: any, slideCount: number = 22, structure?: string) {
  
  const defaultStructure = slideCount === 25 ? `
Warm-up (3 slides):
1. Welcome & Icebreaker - Fun greeting activity
2. Prior Knowledge Check - What do students already know?
3. Energy Builder - Simple movement or chant

Introduction (2 slides):
4. Learning Objectives - Clear goals for today
5. Lesson Overview - What we'll do today

Presentation / Input (6 slides):
6. Vocabulary Introduction - Key greetings words with visuals
7. Grammar Pattern - "My name is..." structure
8. Pronunciation Practice - Listen and repeat
9. Cultural Context - Greetings around the world
10. Example Dialogues - Model conversations
11. Language Chunks - Common greeting phrases

Guided Practice (5 slides):
12. Vocabulary Matching - Drag and drop
13. Fill in the Blanks - Complete greetings
14. Listen and Choose - Audio comprehension
15. Picture Prompts - What do you say?
16. Error Correction - Fix the mistakes

Gamified Activities (4 slides):
17. Spinning Wheel - Random greeting scenarios
18. Memory Game - Match greetings and responses
19. Quick Quiz - Multiple choice with feedback
20. Role Assignment - Prepare for practice

Communication Practice (3 slides):
21. Pair Roleplay - Practice introductions
22. Group Mingling - Meet and greet activity
23. Real-world Scenarios - Practical situations

Review & Wrap-up (2 slides):
24. Vocabulary Review - What did we learn?
25. Exit Ticket - Quick self-assessment` 
  : `
1. Title Slide - Welcome to the lesson
2. Learning Objectives - What students will achieve
3. Warm-up Activity - Engage students
4. Vocabulary Preview - Key words for the lesson
5. Target Language Introduction - Main language point
6. Listening Comprehension - Audio-based activity
7. Sentence Builder - Construct sentences
8. Pronunciation Shadow - Practice pronunciation
9. Grammar Focus - Key grammar point
10. Accuracy MCQ - Multiple choice questions
11. Transform Exercise - Transform sentences
12. Error Fix - Correct mistakes
13. Picture Description - Describe images
14. Controlled Practice - Guided practice
15. Controlled Output - Structured production
16. Micro Input - Short input activity
17. Roleplay Setup - Prepare for roleplay
18. Communicative Task - Real communication
19. Fluency Sprint - Quick speaking activity
20. Review & Consolidation - Recap key points
21. Exit Check - Final assessment
22. Homework & Next Steps - Future learning`;

  const slideStructure = structure || defaultStructure;
  
  const prompt = `Create exactly ${slideCount} interactive ESL lesson slides for the lesson: "${lesson.title}"

LESSON DETAILS:
Topic: ${lesson.topic}
CEFR Level: ${lesson.cefr_level}
Duration: 30 minutes
Target Age: Young learners (7-12 years old)
Learning Objectives: 
- Students can greet others using "Hello", "Hi", "Good morning"
- Students can introduce themselves using "My name is..." and "I am..."
- Students can ask and answer "What's your name?" and "How are you?"

Vocabulary Focus: Hello, Hi, Good morning, Good afternoon, My name is, I am, What's your name?, How are you?, Fine, Nice to meet you
Grammar Focus: Simple present with "be" verb, Question formation with "What" and "How"

Create a comprehensive ${slideCount}-slide lesson following this structure:
${slideStructure}

DESIGN REQUIREMENTS:
- Each slide must be interactive and engaging for young learners
- Use simple, clear language appropriate for A1 level
- Include visual descriptions for image generation
- Make activities fun and gamified
- Ensure cultural sensitivity in examples
- Add movement and energy where appropriate

For each slide, provide this exact JSON structure:
{
  "id": "slide-{number}",
  "type": "{slide_type}",
  "prompt": "Clear, simple instruction for students",
  "instructions": "Detailed teacher notes and timing",
  "media": {
    "type": "image",
    "imagePrompt": "Detailed description for AI image generation",
    "alt": "Accessibility description"
  },
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct": "correct answer or index",
  "timeLimit": 60,
  "accessibility": {
    "screenReaderText": "Description for screen readers",
    "highContrast": true,
    "largeText": false
  }
}

IMPORTANT: 
- Respond with valid JSON only
- Each slide must be appropriate for 7-12 year old learners
- Use engaging, interactive activities
- Include clear visual descriptions for image generation
- Make it classroom-ready and professional

Create the lesson slides now:`;

  if (!openAIApiKey) {
    throw new Error('OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert ESL curriculum designer. Create comprehensive, engaging lesson slides with clear instructions and interactive elements. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  let slidesData;

  try {
    const content = data.choices[0].message.content;
    slidesData = JSON.parse(content);
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', data.choices[0].message.content);
    throw new Error('Failed to parse lesson slides from AI response');
  }

  // Ensure we have the expected number of slides
  if (!slidesData.slides || slidesData.slides.length !== slideCount) {
    console.warn(`Expected ${slideCount} slides, got ${slidesData.slides?.length || 0}. Adjusting...`);
    
    // Create fallback structure if needed
    slidesData = {
      version: '2.0',
      theme: lesson.cefr_level === 'A1' ? 'mist-blue' : lesson.cefr_level === 'A2' ? 'sage-sand' : 'default',
      slides: slidesData.slides?.slice(0, slideCount) || [],
      durationMin: lesson.duration_minutes || 30,
      total_slides: slideCount,
      metadata: {
        CEFR: lesson.cefr_level,
        module: lesson.module_number || 1,
        lesson: lesson.lesson_number || 1,
        targets: lesson.learning_objectives || [],
        weights: {
          accuracy: 0.6,
          fluency: 0.4
        }
      }
    };
  }

  // Generate images for slides that need them
  await generateImagesForSlides(slidesData.slides);

  // Update lesson with generated slides
  const { error: updateError } = await supabase
    .from('lessons_content')
    .update({ 
      slides_content: slidesData,
      updated_at: new Date().toISOString()
    })
    .eq('id', lesson.id);

  if (updateError) {
    throw new Error(`Failed to update lesson with slides: ${updateError.message}`);
  }

  return slidesData;
}

async function generateSlideContent(lesson: any, slideIndex: number) {
  const slideTypes = [
    'warmup', 'vocabulary_preview', 'target_language', 'listening_comprehension',
    'sentence_builder', 'pronunciation_shadow', 'grammar_focus', 'accuracy_mcq',
    'transform', 'error_fix', 'picture_description', 'controlled_practice',
    'controlled_output', 'micro_input', 'roleplay_setup', 'communicative_task',
    'fluency_sprint', 'review_consolidation', 'exit_check', 'picture_choice',
    'labeling', 'tpr_phonics'
  ];

  const slideType = slideTypes[slideIndex % slideTypes.length];

  const prompt = `Create one ESL lesson slide for: "${lesson.title}"
Topic: ${lesson.topic}
CEFR Level: ${lesson.cefr_level}
Slide Type: ${slideType}
Slide Number: ${slideIndex + 1}

Create an engaging slide with:
- Clear student instructions
- Interactive elements appropriate for the slide type
- Age-appropriate content
- 4 answer options if it's an interactive slide
- Accessibility features

Respond with valid JSON only:`;

  if (!openAIApiKey) {
    throw new Error('OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert ESL curriculum designer. Create one engaging lesson slide with clear instructions. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch (parseError) {
    throw new Error('Failed to parse slide content from AI response');
  }
}

async function generateImagesForSlides(slides: any[]) {
  // For now, just add placeholder image URLs
  // In production, you would generate actual images using OpenAI's DALL-E
  for (let i = 0; i < slides.length; i++) {
    if (slides[i] && slides[i].media?.imagePrompt) {
      slides[i].media.url = `https://picsum.photos/800/600?random=${i}`;
      slides[i].media.alt = slides[i].media.imagePrompt;
    }
  }
}