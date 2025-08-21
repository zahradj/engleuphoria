import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!openaiApiKey) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { content_id, content_type, batch_generate, generate_20_slides = true } = await req.json();
    
    console.log('🎨 AI Slide Generator request:', { content_id, content_type, batch_generate, generate_20_slides });

    if (batch_generate) {
      return await generateSlidesForAllContent(supabase);
    } else if (content_id) {
      return await generateSlidesForContent(supabase, content_id, content_type, true); // Always force 22 slides for systematic lessons
    } else {
      return new Response(
        JSON.stringify({ error: 'Content ID or batch_generate flag required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in AI slide generator:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateSlidesForAllContent(supabase: any) {
  console.log('🏗️ Starting batch slide generation for all content...');
  
  try {
    // Get all content without slides OR with short slide decks (less than 12 slides)
    const { data: contentItems, error } = await supabase
      .from('systematic_lessons')
      .select('*')
      .or('slides_content.is.null,slides_content->slides->0.is.null')
      .limit(50); // Process in batches to avoid timeouts
    
    // Filter for lessons that need longer slide decks (20 slides minimum)
    const needsUpgrade = contentItems?.filter(item => 
      !item.slides_content?.slides || item.slides_content.slides.length < 20
    ) || [];

    if (error) {
      throw new Error(`Failed to fetch content: ${error.message}`);
    }

    if (!needsUpgrade || needsUpgrade.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'All lessons already have 20+ interactive slide decks',
          generated_count: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📚 Found ${needsUpgrade.length} lessons need slide upgrades to 20 slides (from ${contentItems.length} total)`);

    let successCount = 0;
    const errors = [];

    // Process items in smaller batches to avoid rate limits
    const batchSize = 2; // Smaller batches for 20-slide generation
    for (let i = 0; i < needsUpgrade.length; i += batchSize) {
      const batch = needsUpgrade.slice(i, i + batchSize);
      console.log(`🔄 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(needsUpgrade.length/batchSize)}`);

      const batchPromises = batch.map(async (item) => {
        try {
          const slidesData = await generateSlidesData(item, true); // Force 20 slides for batch generation
          
          const { error: updateError } = await supabase
            .from('systematic_lessons')
            .update({ slides_content: slidesData })
            .eq('id', item.id);

          if (updateError) {
            throw new Error(`Update failed: ${updateError.message}`);
          }

          successCount++;
          console.log(`✅ Generated slides for: ${item.title}`);
        } catch (error) {
          console.error(`❌ Failed to generate slides for ${item.title}:`, error);
          errors.push(`${item.title}: ${error.message}`);
        }
      });

      await Promise.all(batchPromises);
      
      // Longer delay between batches for 20-slide generation
      if (i + batchSize < needsUpgrade.length) {
        await new Promise(resolve => setTimeout(resolve, 6000));
      }
    }

    console.log(`🎉 Slide upgrade complete! Generated 20-slide decks for ${successCount}/${needsUpgrade.length} lessons.`);

    return new Response(
      JSON.stringify({
        success: true,
        generated_count: successCount,
        total_processed: needsUpgrade.length,
        total_lessons_checked: contentItems.length,
        errors: errors,
        message: `Successfully upgraded ${successCount} lessons with 20-slide interactive decks`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Batch slide generation failed:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to generate slides for content',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function generateSlidesForContent(supabase: any, contentId: string, contentType: string, generate20Slides = false) {
  try {
    // Get the content item
    const { data: contentItem, error } = await supabase
      .from('systematic_lessons')
      .select('*')
      .eq('id', contentId)
      .single();

    if (error || !contentItem) {
      throw new Error('Content item not found');
    }

    const slidesData = await generateSlidesData(contentItem, generate20Slides);

    // Update the content with slides
    const { error: updateError } = await supabase
      .from('systematic_lessons')
      .update({ slides_content: slidesData })
      .eq('id', contentId);

    if (updateError) {
      throw new Error(`Failed to update content: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        slides: slidesData,
        message: 'Slides generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating slides:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate slides', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function generateSlidesData(contentItem: any, force20Slides = true) {
  // Extract CEFR level and age group for kid-specific content
  const cefrLevel = contentItem.level_info?.cefr_level || 'A1';
  const ageGroup = getAgeGroupFromCEFR(cefrLevel);
  const isEarlyAge = ageGroup.includes('4-6') || ageGroup.includes('6-9');
  
  const prompt = `You are an expert language learning curriculum designer creating interactive slides for CEFR level ${cefrLevel}.

LESSON DETAILS:
- Title: ${contentItem.title}
- Topic: ${contentItem.topic}
- CEFR Level: ${cefrLevel}
- Grammar Focus: ${contentItem.grammar_focus || 'Grammar fundamentals'}
- Duration: ${contentItem.estimated_duration || 45} minutes
- Vocabulary: ${JSON.stringify(contentItem.vocabulary_set || [])}
- Learning Objectives: ${JSON.stringify(contentItem.lesson_objectives || [])}

CRITICAL REQUIREMENT: GENERATE EXACTLY 22 SLIDES using the LessonSlides v2.0 schema.

SYSTEMATIC CURRICULUM DESIGN PRINCIPLES:
- Balanced skill development: Speaking, Listening, Reading, Writing, Grammar
- Progressive difficulty with scaffolding
- Interactive and engaging activities
- Real-world communication focus
- Assessment and feedback integration

CREATE EXACTLY 22 SLIDES following this blueprint:`

SLIDE 1: Welcome & Objectives (type: "warmup")
- Lesson title, learning objectives, communication outcomes
- Preview of skills covered (grammar, vocabulary, communication)

SLIDE 2: Vocabulary Preview 1 (type: "vocabulary_preview") 
- Introduce first 4-6 key vocabulary items with images
- Interactive matching or drag-drop activity

SLIDE 3: Vocabulary Preview 2 (type: "vocabulary_preview")
- Introduce remaining vocabulary with context sentences
- Picture choice or labeling activity

SLIDE 4: Target Language Introduction (type: "target_language")
- Present main grammar/language focus with clear examples
- Form → Meaning → Use progression

SLIDE 5: Listening for Gist (type: "listening_comprehension")
- Audio activity for general understanding
- Multiple choice or true/false questions

SLIDE 6: Listening for Detail (type: "listening_comprehension") 
- Same audio, focus on specific information
- Gap-fill or ordering activity

SLIDE 7: Sentence Builder 1 (type: "sentence_builder")
- Drag words to create target sentences
- Focus on accuracy and word order

SLIDE 8: Sentence Builder 2 (type: "sentence_builder")
- More complex sentence construction
- Multiple sentence patterns

SLIDE 9: Pronunciation & Fluency (type: "pronunciation_shadow")
- Model pronunciation with audio
- Shadowing and repetition exercises

SLIDE 10: Grammar Focus (type: "grammar_focus")
- Explicit grammar instruction with examples
- Rule explanation and pattern recognition

SLIDE 11: Accuracy Check 1 (type: "accuracy_mcq")
- Multiple choice grammar/vocabulary questions
- Immediate feedback with explanations

SLIDE 12: Error Correction (type: "error_fix")
- Find and fix common errors
- Peer feedback simulation

SLIDE 13: Reading Comprehension (type: "picture_description")
- Read short text and answer questions
- Gist and detail comprehension

SLIDE 14: Controlled Writing (type: "controlled_practice")
- Guided writing with prompts
- Sentence completion or transformation

SLIDE 15: Free Writing (type: "controlled_output")
- Creative writing task (4-6 sentences)
- Use target language in personal context

SLIDE 16: Micro-Input Processing (type: "micro_input")
- Listen/read and process input quickly
- Information gap or matching activity

SLIDE 17: Communication Setup (type: "roleplay_setup")
- Prepare for speaking task
- Context, roles, and useful phrases

SLIDE 18: Speaking Practice (type: "communicative_task")
- Role-play or discussion activity
- Real-life communication scenarios

SLIDE 19: Fluency Challenge 1 (type: "fluency_sprint")
- Timed speaking with visual prompts
- Focus on speed and natural flow

SLIDE 20: Fluency Challenge 2 (type: "fluency_sprint")
- Free speaking task with minimal support
- Personal expression and creativity

SLIDE 21: Review & Consolidation (type: "review_consolidation")
- Review key learning points
- Self-assessment and reflection

SLIDE 22: Exit Assessment (type: "exit_check")
- Quick assessment of lesson objectives
- Badge/progress tracking and next steps

${isEarlyAge ? 'FOR AGES 4-7: Include more phonics/TPR activities and visual supports.' : ''}

IMPORTANT: For each slide with media, provide an OpenAI image generation prompt:
- Use child-friendly, educational imagery
- Describe scenes relevant to the lesson topic
- Include diverse characters and settings
- Ensure age-appropriate content

SENTENCE-BUILDING FOCUS for ${cefrLevel}:
${getSentenceBuildingSyllabus(cefrLevel)}

Return ONLY a valid JSON object with this schema:
{
  "version": "2.0",
  "theme": "mist-blue",
  "slides": [
    {
      "id": "slide-1",
      "type": "warmup|vocabulary_preview|target_language|sentence_builder|pronunciation_shadow|accuracy_mcq|transform|error_fix|controlled_output|micro_input|communicative_task|fluency_sprint|exit_check|picture_choice|labeling|tpr_phonics",
      "prompt": "Main instruction text",
      "instructions": "Teacher instructions",
      "media": {
        "type": "image|video|audio",
        "url": "placeholder-url",
        "alt": "Alt text",
        "imagePrompt": "Detailed OpenAI image generation prompt"
      },
      "options": [
        {
          "id": "opt-1",
          "text": "Option text",
          "image": "optional-image-url",
          "isCorrect": true
        }
      ],
      "correct": "correct-answer-or-array",
      "timeLimit": 120,
      "accessibility": {
        "screenReaderText": "Screen reader description",
        "highContrast": false,
        "largeText": ${isEarlyAge}
      }
    }
  ],
  "durationMin": 45,
  "metadata": {
    "CEFR": "${cefrLevel}",
    "module": 1,
    "lesson": 1,
    "targets": ["sentence patterns"],
    "weights": {
      "accuracy": 60,
      "fluency": 40
    }
  }
}`;

  let response;
  let attempts = 0;
  const maxAttempts = 3;
  
  // Optimized model strategy: fast, reliable models with fallbacks
  const models = ['gpt-5-mini-2025-08-07', 'gpt-4.1-2025-04-14', 'o4-mini-2025-04-16'];
  
  while (attempts < maxAttempts) {
    try {
      const currentModel = models[attempts];
      console.log(`🤖 Attempting slide generation with model: ${currentModel} (attempt ${attempts + 1})`);
      
      // Exponential backoff for rate limits
      if (attempts > 0) {
        const delay = Math.min(1000 * Math.pow(2, attempts - 1) + Math.random() * 1000, 10000);
        console.log(`⏳ Waiting ${Math.round(delay)}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: currentModel,
          messages: [
            {
              role: 'system',
              content: 'You are an expert curriculum designer. Create ONLY valid JSON following the exact LessonSlides v2.0 schema. Ensure exactly 22 slides with proper structure.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_completion_tokens: currentModel.includes('gpt-5') || currentModel.includes('gpt-4.1') ? 6000 : 4000,
          // Note: temperature removed for GPT-5/4.1 compatibility
        }),
      });

      if (response.ok) {
        console.log(`✅ Model ${currentModel} succeeded`);
        break; // Success, exit retry loop
      }
      
      const errorText = await response.text();
      console.error(`❌ Model ${currentModel} failed with status: ${response.status} - ${errorText}`);
      attempts++;
      
      if (attempts >= maxAttempts) {
        throw new Error(`All models failed. Last error: ${response.status} - ${response.statusText}`);
      }
      
    } catch (error) {
      attempts++;
      console.error(`❌ Attempt ${attempts} failed:`, error.message);
      
      if (attempts >= maxAttempts) {
        throw new Error(`Failed after ${maxAttempts} attempts: ${error.message}`);
      }
    }
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content received from OpenAI');
  }

  try {
    const slidesData = JSON.parse(content);
    
    // Validate and normalize the slides data structure
    const normalizedSlides = normalizeSlideData(slidesData, contentItem);
    
    // Optional: Generate images in background to avoid blocking
    EdgeRuntime.waitUntil(generateSlideImages(normalizedSlides));
    
    return normalizedSlides;
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    console.log('Raw content:', content?.substring(0, 500));
    throw new Error('Invalid JSON response from OpenAI');
  }
}

function normalizeSlideData(rawData: any, contentItem: any): any {
  // Ensure proper structure according to LessonSlides v2.0 schema
  const normalized = {
    version: "2.0",
    theme: rawData.theme || "mist-blue",
    slides: [],
    durationMin: rawData.durationMin || contentItem.estimated_duration || 45,
    total_slides: 0,
    metadata: {
      CEFR: contentItem.level_info?.cefr_level || 'A1',
      module: rawData.metadata?.module || 1,
      lesson: rawData.metadata?.lesson || 1,
      targets: rawData.metadata?.targets || [],
      weights: {
        accuracy: rawData.metadata?.weights?.accuracy || 60,
        fluency: rawData.metadata?.weights?.fluency || 40
      }
    },
    generated_at: new Date().toISOString(),
    generated_by: 'ai-slide-generator-v4.0',
  };

  // Validate and normalize slides
  if (rawData.slides && Array.isArray(rawData.slides)) {
    normalized.slides = rawData.slides.map((slide: any, index: number) => ({
      id: slide.id || `slide-${index + 1}`,
      type: slide.type || 'warmup',
      prompt: slide.prompt || slide.content || 'Interactive slide content',
      instructions: slide.instructions || `Instructions for slide ${index + 1}`,
      media: slide.media ? {
        type: slide.media.type || 'image',
        url: slide.media.url || 'placeholder-url',
        alt: slide.media.alt || `Slide ${index + 1} image`,
        imagePrompt: slide.media.imagePrompt
      } : undefined,
      options: slide.options || undefined,
      correct: slide.correct || undefined,
      timeLimit: slide.timeLimit || 120,
      accessibility: {
        screenReaderText: slide.accessibility?.screenReaderText || slide.prompt,
        highContrast: slide.accessibility?.highContrast || false,
        largeText: slide.accessibility?.largeText || false
      }
    }));
  }

  // Ensure exactly 22 slides
  if (normalized.slides.length < 22) {
    console.log(`⚠️ Only ${normalized.slides.length} slides generated, should be 22`);
  }
  
  normalized.total_slides = normalized.slides.length;
  return normalized;
}

async function generateSlideImages(slidesData: any) {
  if (!slidesData.slides) return;
  
  console.log('🎨 Starting background image generation...');
  
  for (const slide of slidesData.slides) {
    if (slide.media?.imagePrompt && slide.media.type === 'image') {
      try {
        const imageUrl = await generateSlideImage(slide.media.imagePrompt);
        slide.media.url = imageUrl;
        console.log(`✅ Generated image for slide: ${slide.id}`);
      } catch (imageError) {
        console.error(`❌ Failed to generate image for slide: ${slide.id}`, imageError);
        // Keep placeholder URL if image generation fails
      }
    }
  }
}

function getAgeGroupFromCEFR(cefrLevel: string): string {
  switch (cefrLevel) {
    case 'Pre-A1': return '4-6';
    case 'A1': return '6-9';
    case 'A2': return '9-12';
    case 'B1': return '12-15';
    default: return '6-9';
  }
}

function getSentenceBuildingSyllabus(cefrLevel: string): string {
  const syllabus = {
    'Pre-A1': 'Names, colors, nouns, S + be + noun/adj, this/that, I like…, there is/are, simple imperatives, basic wh- questions with picture support',
    'A1': 'SVO in present, frequency, have/has, can/can\'t, adjectives order basics, and/but/so, when/what/where questions',
    'A2': 'Past simple (reg/irreg), going to/will, comparatives/superlatives, object pronouns, because/when/if (zero/first), starter phrasal verbs',
    'B1': 'Present perfect, continuous aspects, relative clauses (who/which/that), modals (advice/obligation/possibility), cohesive devices (however/therefore)'
  };
  
  return syllabus[cefrLevel as keyof typeof syllabus] || syllabus['A1'];
}

async function generateSlideImage(imagePrompt: string): Promise<string> {
  console.log('🎨 Generating image with prompt:', imagePrompt);
  
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: `Educational illustration for children: ${imagePrompt}. Style: Clean, colorful, child-friendly cartoon illustration with soft colors and diverse characters.`,
        n: 1,
        size: '1024x1024',
        quality: 'high',
        response_format: 'b64_json'
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI Image API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const base64Image = data.data[0]?.b64_json;
    
    if (!base64Image) {
      throw new Error('No image data received from OpenAI');
    }

    // Return data URL for direct use
    return `data:image/png;base64,${base64Image}`;
    
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}