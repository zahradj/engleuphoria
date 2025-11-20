import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { unitId, lessonIndex, lessonPlan, ageGroup, cefrLevel } = await req.json();
    
    console.log(`Starting lesson content generation for unit ${unitId}, lesson ${lessonIndex}`);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Step 1: Generate slide structure using Lovable AI
    console.log('Step 1: Generating slide structure...');
    const slidePrompt = buildSlidePrompt(lessonPlan, ageGroup, cefrLevel);
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert ESL curriculum designer. Create comprehensive, engaging lesson slides with clear instructions and interactive elements. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: slidePrompt
          }
        ],
        max_tokens: 4000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI generation error:', errorText);
      throw new Error(`AI generation failed: ${aiResponse.statusText}`);
    }

    const aiData = await aiResponse.json();
    let generatedText = aiData.choices?.[0]?.message?.content || '';
    
    // Clean and parse JSON
    let cleanedText = generatedText.trim();
    if (cleanedText.includes('```')) {
      const match = cleanedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        cleanedText = match[1].trim();
      }
    }
    
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    let slidesData;
    try {
      slidesData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Attempted to parse:', cleanedText.substring(0, 500));
      throw new Error(`Failed to parse AI response: ${parseError.message}`);
    }

    const slides = slidesData.slides || [];
    console.log(`Generated ${slides.length} slides`);

    // Step 2: Extract image prompts
    const imagePrompts = slides
      .filter((slide: any) => slide.media?.imagePrompt)
      .reduce((acc: any, slide: any, idx: number) => {
        acc[`slide-${slide.id}`] = slide.media.imagePrompt;
        return acc;
      }, {});

    console.log(`Extracted ${Object.keys(imagePrompts).length} image prompts`);

    // Step 3: Extract audio scripts
    const audioTexts = slides
      .filter((slide: any) => slide.audioText)
      .reduce((acc: any, slide: any) => {
        acc[`audio-${slide.id}`] = slide.audioText;
        return acc;
      }, {});

    console.log(`Extracted ${Object.keys(audioTexts).length} audio scripts`);

    // Step 4: Generate images in batch (if any)
    let imageResults: any = {};
    if (Object.keys(imagePrompts).length > 0) {
      console.log('Step 4: Generating images...');
      try {
        const { data: imgData, error: imgError } = await supabaseClient.functions.invoke(
          'batch-generate-lesson-images',
          {
            body: {
              lessonId: `${unitId}-lesson-${lessonIndex}`,
              imagePrompts
            }
          }
        );

        if (imgError) {
          console.error('Image generation error:', imgError);
        } else {
          imageResults = imgData?.results || {};
          console.log(`Generated ${Object.keys(imageResults).length} images`);
        }
      } catch (imgErr) {
        console.error('Image generation failed:', imgErr);
      }
    }

    // Step 5: Generate audio in batch (if any)
    let audioResults: any = {};
    if (Object.keys(audioTexts).length > 0) {
      console.log('Step 5: Generating audio...');
      try {
        const { data: audioData, error: audioError } = await supabaseClient.functions.invoke(
          'batch-generate-lesson-audio',
          {
            body: {
              lessonId: `${unitId}-lesson-${lessonIndex}`,
              audioTexts
            }
          }
        );

        if (audioError) {
          console.error('Audio generation error:', audioError);
        } else {
          audioResults = audioData?.results || {};
          console.log(`Generated ${Object.keys(audioResults).length} audio files`);
        }
      } catch (audioErr) {
        console.error('Audio generation failed:', audioErr);
      }
    }

    // Step 6: Merge media URLs into slides
    const enrichedSlides = slides.map((slide: any) => {
      const slideImageKey = `slide-${slide.id}`;
      const slideAudioKey = `audio-${slide.id}`;
      
      return {
        ...slide,
        media: slide.media ? {
          ...slide.media,
          url: imageResults[slideImageKey] || slide.media.url
        } : undefined,
        audioUrl: audioResults[slideAudioKey] || slide.audioUrl
      };
    });

    // Step 7: Save to systematic_lessons
    console.log('Step 7: Saving to database...');
    const { data: savedLesson, error: saveError } = await supabaseClient
      .from('systematic_lessons')
      .insert({
        title: lessonPlan.title,
        age_group: ageGroup,
        cefr_level: cefrLevel,
        lesson_data: {
          ...slidesData,
          slides: enrichedSlides,
          metadata: {
            ...slidesData.metadata,
            totalSlides: enrichedSlides.length,
            imagesGenerated: Object.keys(imageResults).length,
            audioGenerated: Object.keys(audioResults).length,
            lessonPlan: lessonPlan
          }
        }
      })
      .select()
      .single();

    if (saveError) {
      console.error('Save error:', saveError);
      throw saveError;
    }

    console.log(`Lesson content saved with ID: ${savedLesson.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        lessonId: savedLesson.id,
        totalSlides: enrichedSlides.length,
        imageCount: Object.keys(imageResults).length,
        audioCount: Object.keys(audioResults).length,
        slides: enrichedSlides
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Lesson content generation error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

function buildSlidePrompt(lessonPlan: any, ageGroup: string, cefrLevel: string): string {
  return `You are creating 20-25 interactive ESL slides from this lesson plan:

**Lesson**: ${lessonPlan.title}
**CEFR Level**: ${cefrLevel}
**Age Group**: ${ageGroup}
**Objectives**: ${lessonPlan.objectives?.join(', ')}
**Grammar**: ${lessonPlan.targetLanguage?.grammar?.join(', ')}
**Vocabulary**: ${lessonPlan.targetLanguage?.vocabulary?.join(', ')}

**Lesson Flow**:
- Warm-up (5 min): ${lessonPlan.warmUp}
- Presentation (10 min): ${lessonPlan.presentation}
- Controlled Practice (10-15 min): ${lessonPlan.controlledPractice}
- Freer Practice (15 min): ${lessonPlan.freerPractice}
- Assessment (5 min): ${lessonPlan.assessment}

Create exactly 20-25 slides following this structure:
1. Title slide (warmup type)
2. Warm-up activity (2 slides) - based on: ${lessonPlan.warmUp}
3. Vocabulary introduction (3 slides) - visual + practice
4. Grammar presentation (3 slides) - based on: ${lessonPlan.targetLanguage?.grammar?.[0]}
5. Listening activity (2 slides) - audio + comprehension
6. Interactive practice (4 slides) - drag-drop, matching, quiz
7. Speaking practice (2 slides) - controlled + free
8. Reading activity (2 slides)
9. Game/Review (2 slides) - gamified activity
10. Wrap-up (1 slide) - summary + homework

For EACH slide provide:
- id: "slide-{number}"
- type: warmup|vocabulary_preview|grammar_focus|listening_comprehension|drag_drop|match|quiz|controlled_practice|communicative_task|review_consolidation
- prompt: Clear title and main content
- instructions: Step-by-step teacher + student instructions
- content: Detailed slide content (questions, options, correct answers for interactive elements)
- media: { type: "image", imagePrompt: "detailed AI image generation prompt suitable for children, colorful, educational, cartoon style", alt: "description" }
- audioText: Text to be converted to speech for pronunciation/instructions (if applicable)
- interactionType: drag_drop|multiple_choice|matching|fill_blank|speaking|listening (if interactive)
- teacherTips: Array of facilitation tips

**IMPORTANT**: 
- Make slides age-appropriate for ${ageGroup}
- Use simple language for ${cefrLevel} level
- Include detailed imagePrompt for slides needing visuals (at least 15 slides should have images)
- Include audioText for pronunciation practice and key instructions (at least 10 slides)
- Make activities interactive and gamified
- Ensure cultural sensitivity

Return ONLY valid JSON with this structure:
{
  "version": "2.0",
  "theme": "mist-blue",
  "durationMin": 45,
  "metadata": {
    "CEFR": "${cefrLevel}",
    "module": 1,
    "lesson": ${lessonPlan.lessonNumber || 1},
    "targets": ${JSON.stringify(lessonPlan.objectives || [])},
    "weights": { "accuracy": 60, "fluency": 40 }
  },
  "slides": [...]
}`;
}