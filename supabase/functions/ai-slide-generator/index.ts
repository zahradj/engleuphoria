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
    const { content_id, content_type, batch_generate } = await req.json();
    
    console.log('🎨 AI Slide Generator request:', { content_id, content_type, batch_generate });

    if (batch_generate) {
      return await generateSlidesForAllContent(supabase);
    } else if (content_id) {
      return await generateSlidesForContent(supabase, content_id, content_type);
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
          const slidesData = await generateSlidesData(item);
          
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

async function generateSlidesForContent(supabase: any, contentId: string, contentType: string) {
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

    const slidesData = await generateSlidesData(contentItem);

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

async function generateSlidesData(contentItem: any) {
  // Extract CEFR level and age group for kid-specific content
  const cefrLevel = contentItem.level_info?.cefr_level || 'A1';
  const ageGroup = getAgeGroupFromCEFR(cefrLevel);
  const isEarlyAge = ageGroup.includes('4-6') || ageGroup.includes('6-9');
  
  const prompt = `You are an expert in child language learning, creating interactive slides for ages ${ageGroup} using the 1:1 Kids Program curriculum.

LESSON DETAILS:
- Title: ${contentItem.title}
- Topic: ${contentItem.topic}
- CEFR Level: ${cefrLevel}
- Age Group: ${ageGroup}
- Grammar Focus: ${contentItem.grammar_focus || 'Sentence Building'}
- Duration: ${contentItem.estimated_duration || 45} minutes
- Vocabulary: ${JSON.stringify(contentItem.vocabulary_set || [])}
- Target Sentences: ${JSON.stringify(contentItem.lesson_objectives || [])}

CRITICAL: Follow the "Placement Test – Daily Routine" slide style exactly:
- Large tap targets (minimum 44px)
- Picture-led activities for early ages
- Clear, simple language
- Child-safe imagery with OpenAI-generated image prompts
- Calm, encouraging feedback

CREATE EXACTLY 20 SLIDES following this comprehensive blueprint:
1. Warmup Introduction: Welcome slide with lesson overview
2. Vocabulary Preview 1: Introduce first set of vocabulary with images
3. Vocabulary Preview 2: Introduce second set of vocabulary with images  
4. Target Language Presentation: Form → meaning → use with examples
5. Listening Comprehension: Audio/visual activity with target language
6. Sentence Builder 1: Drag words/chunks into correct order
7. Sentence Builder 2: Advanced sentence construction
8. Pronunciation Practice: Model + shadow with audio feedback
9. Grammar Focus: Targeted grammar explanation with examples
10. Accuracy Drill 1: Multiple choice questions
11. Accuracy Drill 2: Transform/error-fix exercises
12. Picture Description: Describe images using target language
13. Controlled Practice: Guided sentence production
14. Micro-input Activity: Listen/read and rebuild sentences
15. Role-play Setup: Communicative task preparation
16. Role-play Activity: Interactive communication task
17. Fluency Sprint 1: Timed speaking with word bank
18. Fluency Sprint 2: Free production with prompts
19. Review & Consolidation: Summary of key points
20. Exit Check: Assessment with rewards/achievements

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
      "type": "warmup|target_language|sentence_builder|pronunciation_shadow|accuracy_mcq|transform|error_fix|micro_input|communicative_task|fluency_sprint|exit_check|picture_choice|labeling|tpr_phonics",
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

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in child language learning and instructional design. Create ONLY valid JSON. Focus on sentence-building progression and age-appropriate activities.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_completion_tokens: 8000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content received from OpenAI');
  }

  try {
    const slidesData = JSON.parse(content);
    
    // Generate images for slides with image prompts
    if (slidesData.slides) {
      for (const slide of slidesData.slides) {
        if (slide.media?.imagePrompt && slide.media.type === 'image') {
          try {
            const imageUrl = await generateSlideImage(slide.media.imagePrompt);
            slide.media.url = imageUrl;
          } catch (imageError) {
            console.error('Failed to generate image for slide:', slide.id, imageError);
            // Keep placeholder URL if image generation fails
          }
        }
      }
    }
    
    // Validate and enhance slides data
    return {
      ...slidesData,
      generated_at: new Date().toISOString(),
      generated_by: 'ai-slide-generator-k12-v3.0',
      total_slides: slidesData.slides?.length || 0
    };
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    throw new Error('Invalid JSON response from OpenAI');
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