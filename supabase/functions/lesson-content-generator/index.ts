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

    // Step 1: Generate slide structure using Lovable AI with structured output
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
            content: 'You are an expert ESL curriculum designer. Create comprehensive, engaging lesson slides with clear instructions and interactive elements.'
          },
          {
            role: 'user',
            content: slidePrompt
          }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'generate_lesson_slides',
            description: 'Generate interactive ESL lesson slides',
            parameters: {
              type: 'object',
              properties: {
                version: { type: 'string' },
                theme: { type: 'string' },
                durationMin: { type: 'number' },
                metadata: {
                  type: 'object',
                  properties: {
                    CEFR: { type: 'string' },
                    module: { type: 'number' },
                    lesson: { type: 'number' },
                    targets: { type: 'array', items: { type: 'string' } },
                    weights: { type: 'object' }
                  }
                },
                slides: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      type: { type: 'string' },
                      prompt: { type: 'string' },
                      instructions: { type: 'string' },
                      content: { type: 'object' },
                      media: { type: 'object' },
                      audioText: { type: 'string' },
                      interactionType: { type: 'string' },
                      teacherTips: { type: 'array', items: { type: 'string' } }
                    }
                  }
                }
              },
              required: ['version', 'theme', 'durationMin', 'metadata', 'slides']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'generate_lesson_slides' } },
        max_tokens: 8000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI generation error:', errorText);
      throw new Error(`AI generation failed: ${aiResponse.statusText}`);
    }

    const aiData = await aiResponse.json();
    
    // Extract from tool call
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error('No tool call in response:', JSON.stringify(aiData, null, 2));
      throw new Error('AI did not return structured output');
    }

    let slidesData;
    try {
      slidesData = JSON.parse(toolCall.function.arguments);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Tool call arguments:', toolCall.function.arguments.substring(0, 500));
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
    
    // Get or create a curriculum level for this CEFR level
    console.log('Looking for curriculum level:', { cefrLevel, ageGroup });
    
    // Map simple age ranges to database age group formats
    const ageGroupMapping: Record<string, string> = {
      '5-7': 'Young Learners (4-7 years)',
      '8-11': 'Elementary (8-11 years)',
      '12-14': 'Pre-Teen (10-13 years)',
      '15-17': 'Teen (14-17 years)'
    };
    
    const mappedAgeGroup = ageGroupMapping[ageGroup] || ageGroup;
    console.log('Mapped age group:', { original: ageGroup, mapped: mappedAgeGroup });
    
    let curriculumLevelId = null;
    
    // First, try to find by both CEFR level and age group
    const { data: exactMatch } = await supabaseClient
      .from('curriculum_levels')
      .select('id')
      .eq('cefr_level', cefrLevel)
      .eq('age_group', mappedAgeGroup)
      .maybeSingle();
    
    if (exactMatch) {
      curriculumLevelId = exactMatch.id;
      console.log('Found exact match:', curriculumLevelId);
    } else {
      // Try to find by CEFR level only (fallback)
      const { data: cefrMatch } = await supabaseClient
        .from('curriculum_levels')
        .select('id')
        .eq('cefr_level', cefrLevel)
        .limit(1)
        .maybeSingle();
      
      if (cefrMatch) {
        curriculumLevelId = cefrMatch.id;
        console.log('Found CEFR match:', curriculumLevelId);
      } else {
        // Create new level if none exists
        const { data: maxLevel } = await supabaseClient
          .from('curriculum_levels')
          .select('level_order')
          .order('level_order', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        const nextLevelOrder = (maxLevel?.level_order || 0) + 1;
        console.log('Creating new curriculum level with level_order:', nextLevelOrder);
        
        const { data: newLevel, error: createError } = await supabaseClient
          .from('curriculum_levels')
          .insert({
            name: `${cefrLevel} Level (${ageGroup})`,
            cefr_level: cefrLevel,
            age_group: mappedAgeGroup,
            description: `Curriculum for ${cefrLevel} level students aged ${ageGroup}`,
            level_order: nextLevelOrder
          })
          .select('id')
          .single();
        
        if (newLevel) {
          curriculumLevelId = newLevel.id;
          console.log('Created new level:', curriculumLevelId);
        } else {
          console.error('Failed to create curriculum level:', createError);
        }
      }
    }
    
    if (!curriculumLevelId) {
      throw new Error(`Failed to get or create curriculum level for ${cefrLevel} (${ageGroup})`);
    }
    
    console.log('Final curriculum_level_id:', curriculumLevelId);
    
    // Get the next available lesson number for this curriculum level
    const { data: maxLesson } = await supabaseClient
      .from('systematic_lessons')
      .select('lesson_number')
      .eq('curriculum_level_id', curriculumLevelId)
      .order('lesson_number', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    const nextLessonNumber = (maxLesson?.lesson_number || 0) + 1;
    console.log('Next lesson number:', nextLessonNumber);
    
    const { data: savedLesson, error: saveError } = await supabaseClient
      .from('systematic_lessons')
      .insert({
        curriculum_level_id: curriculumLevelId,
        lesson_number: nextLessonNumber,
        title: lessonPlan.title,
        topic: lessonPlan.targetLanguage?.vocabulary?.join(', ') || 'General English',
        grammar_focus: lessonPlan.targetLanguage?.grammar?.join(', ') || '',
        vocabulary_set: lessonPlan.targetLanguage?.vocabulary || [],
        communication_outcome: lessonPlan.objectives?.[0] || '',
        lesson_objectives: lessonPlan.objectives || [],
        slides_content: {
          version: slidesData.version,
          theme: slidesData.theme,
          durationMin: slidesData.durationMin,
          slides: enrichedSlides
        },
        activities: {
          warmUp: lessonPlan.warmUp,
          presentation: lessonPlan.presentation,
          practice: lessonPlan.controlledPractice,
          production: lessonPlan.freerPractice,
          assessment: lessonPlan.assessment
        },
        gamified_elements: {
          totalSlides: enrichedSlides.length,
          interactiveSlides: enrichedSlides.filter((s: any) => s.interactionType).length,
          imagesCount: Object.keys(imageResults).length,
          audioCount: Object.keys(audioResults).length
        },
        difficulty_level: cefrLevel === 'Pre-A1' ? 1 : cefrLevel === 'A1' ? 2 : cefrLevel === 'A2' ? 3 : 4,
        estimated_duration: 45,
        status: 'active'
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
  return `Create 20 interactive ESL slides from this lesson plan:

**Lesson**: ${lessonPlan.title}
**CEFR Level**: ${cefrLevel}
**Age Group**: ${ageGroup}
**Objectives**: ${lessonPlan.objectives?.join(', ')}
**Grammar**: ${lessonPlan.targetLanguage?.grammar?.join(', ')}
**Vocabulary**: ${lessonPlan.targetLanguage?.vocabulary?.join(', ')}

**Lesson Flow**:
- Warm-up: ${lessonPlan.warmUp}
- Presentation: ${lessonPlan.presentation}
- Practice: ${lessonPlan.controlledPractice}
- Production: ${lessonPlan.freerPractice}
- Assessment: ${lessonPlan.assessment}

Generate exactly 20 slides:
1. Title slide (warmup)
2. Warm-up (2 slides)
3. Vocabulary (3 slides with images)
4. Grammar (3 slides)
5. Listening (2 slides with audio)
6. Interactive practice (4 slides: drag-drop, matching, quiz)
7. Speaking (2 slides)
8. Reading (2 slides)
9. Review (1 slide)

Each slide must include:
- id: "slide-{number}"
- type: warmup|vocabulary_preview|grammar_focus|listening_comprehension|drag_drop|match|quiz|controlled_practice|communicative_task|review_consolidation
- prompt: Clear title
- instructions: Brief teacher/student instructions
- content: Activity details (for interactive slides: questions, options, correctAnswer)
- media: { type: "image", imagePrompt: "child-friendly, colorful, educational illustration", alt: "description" } (for visual slides)
- audioText: Text for speech (for pronunciation/instructions)
- interactionType: drag_drop|multiple_choice|matching|fill_blank|speaking|listening
- teacherTips: ["tip1", "tip2"]

Make slides age-appropriate for ${ageGroup}, simple language for ${cefrLevel}.
Include imagePrompt in at least 12 slides.
Include audioText in at least 8 slides.

Return structured data with:
- version: "2.0"
- theme: "mist-blue"
- durationMin: 45
- metadata: { CEFR: "${cefrLevel}", module: 1, lesson: ${lessonPlan.lessonNumber || 1}, targets: [...], weights: { accuracy: 60, fluency: 40 } }
- slides: [20 slide objects]`;
}