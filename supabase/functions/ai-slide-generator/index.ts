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
    // Get all content without slides
    const { data: contentItems, error } = await supabase
      .from('systematic_lessons')
      .select('*')
      .is('slides_content', null)
      .limit(50); // Process in batches to avoid timeouts

    if (error) {
      throw new Error(`Failed to fetch content: ${error.message}`);
    }

    if (!contentItems || contentItems.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No content items need slide generation',
          generated_count: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📚 Found ${contentItems.length} content items to process`);

    let successCount = 0;
    const errors = [];

    // Process items in smaller batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < contentItems.length; i += batchSize) {
      const batch = contentItems.slice(i, i + batchSize);
      console.log(`🔄 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(contentItems.length/batchSize)}`);

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
      
      // Small delay between batches
      if (i + batchSize < contentItems.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`🎉 Batch slide generation complete! Generated slides for ${successCount}/${contentItems.length} items.`);

    return new Response(
      JSON.stringify({
        success: true,
        generated_count: successCount,
        total_processed: contentItems.length,
        errors: errors,
        message: `Successfully generated slides for ${successCount} content items`
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
  const prompt = `You are an expert instructional designer creating interactive slides for an English lesson. 

LESSON DETAILS:
- Title: ${contentItem.title}
- Topic: ${contentItem.topic}
- Level: ${contentItem.level_info?.cefr_level || 'B1'}
- Grammar Focus: ${contentItem.grammar_focus || 'General'}
- Duration: ${contentItem.estimated_duration || 45} minutes
- Vocabulary: ${JSON.stringify(contentItem.vocabulary_set || [])}
- Objectives: ${JSON.stringify(contentItem.lesson_objectives || [])}

Create 10 interactive slides with Engleuphoria branding for classroom use. Include gamified activities, speaking practice, and review sections.

SLIDE REQUIREMENTS:
1. Title Slide - Welcome with Engleuphoria branding
2. Warm-up Activity - Engaging opener
3. Learning Objectives - Clear goals
4. Vocabulary Introduction - Visual key words
5. Grammar Focus - Target structures
6. Gamified Activity 1 - Drag & Drop matching
7. Gamified Activity 2 - Multiple choice quiz
8. Speaking Practice - Real conversation tasks
9. Review Activity - Consolidation exercise
10. Wrap-up & Rewards - Achievement celebration

Each slide should have:
- Engleuphoria color scheme (blue/purple gradients)
- Interactive elements suitable for whiteboards
- Clear instructions for teachers
- Student engagement features
- Time allocations
- Learning objectives alignment

Return ONLY a JSON object with this structure:
{
  "slides": [
    {
      "slide_number": 1,
      "title": "Slide title",
      "content": "Detailed content with instructions",
      "duration": 3,
      "activity_type": "title|warm_up|objectives|vocabulary|grammar|activity|speaking|review|wrap_up",
      "interactive_elements": ["element1", "element2"],
      "teacher_notes": "Instructions for the teacher",
      "gamification": {
        "points_possible": 10,
        "badges": ["badge_name"],
        "challenges": ["challenge_description"]
      }
    }
  ],
  "total_slides": 10,
  "total_duration": 45,
  "gamification": {
    "total_points": 100,
    "achievement_badges": ["Vocabulary Master", "Grammar Champion", "Speaking Star"],
    "progress_tracking": "Lesson completion percentage"
  }
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content: 'You are an expert instructional designer. Always respond with valid JSON only. No additional text outside the JSON structure.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
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
    
    // Validate and enhance slides data
    return {
      slides: slidesData.slides || [],
      total_slides: slidesData.total_slides || 10,
      total_duration: slidesData.total_duration || 45,
      gamification: slidesData.gamification || {},
      generated_at: new Date().toISOString(),
      generated_by: 'ai-slide-generator'
    };
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    throw new Error('Invalid JSON response from OpenAI');
  }
}