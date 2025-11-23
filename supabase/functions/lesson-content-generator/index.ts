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
    console.log('Step 1: Generating enhanced slide structure with gamification...');
    const slidePrompt = buildSlidePrompt(lessonPlan, ageGroup, cefrLevel);
    
    // Retry logic for provider errors - reduced to prevent timeout
    let aiData;
    let lastError;
    const maxRetries = 2; // Reduced from 3 to avoid edge function timeout
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`AI generation attempt ${attempt}/${maxRetries}...`);
        
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'openai/gpt-5-mini', // Reliable for structured output
            messages: [
              {
                role: 'user',
                content: slidePrompt
              }
            ],
            response_format: {
              type: 'json_schema',
              json_schema: {
                name: 'lesson_slides',
                strict: true,
                schema: {
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
                        targets: { type: 'array', items: { type: 'string' } }
                      },
                      required: ['CEFR', 'module', 'lesson', 'targets'],
                      additionalProperties: false
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
                          audioText: { type: 'string' },
                          imagePrompt: { type: 'string' }
                        },
                        required: ['id', 'type', 'prompt', 'instructions'],
                        additionalProperties: false
                      }
                    }
                  },
                  required: ['version', 'theme', 'durationMin', 'metadata', 'slides'],
                  additionalProperties: false
                }
              }
            },
            max_completion_tokens: 3000
          }),
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error(`AI generation error (attempt ${attempt}):`, errorText);
          
          // Handle rate limiting
          if (aiResponse.status === 429) {
            throw new Error('Rate limit exceeded. Please try again in a few moments.');
          }
          
          throw new Error(`AI generation failed: ${aiResponse.statusText}`);
        }

        aiData = await aiResponse.json();
        
        // Check for provider errors in the response
        if (aiData.error) {
          console.error(`Provider error (attempt ${attempt}):`, JSON.stringify(aiData.error, null, 2));
          throw new Error(`AI provider error: ${aiData.error.message || 'Unknown provider error'}`);
        }
        
        // Extract from JSON response (using response_format instead of tools)
        const content = aiData.choices?.[0]?.message?.content;
        if (!content) {
          console.error(`No content in response (attempt ${attempt}):`, JSON.stringify(aiData, null, 2));
          throw new Error('AI did not return structured output');
        }
        
        // Success! Break out of retry loop
        console.log(`✓ AI generation successful on attempt ${attempt}`);
        break;
        
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, error);
        
        // Don't retry on certain errors
        if (error instanceof Error) {
          if (error.message.includes('Rate limit') || error.message.includes('not configured')) {
            throw error;
          }
        }
        
        // If this was the last attempt, throw the error
        if (attempt === maxRetries) {
          throw new Error(`Failed after ${maxRetries} attempts. Last error: ${lastError instanceof Error ? lastError.message : 'Unknown error'}`);
        }
        
        // Wait before retrying (fixed delay to prevent timeout)
        const waitTime = 1000; // Fixed 1s delay instead of exponential backoff
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    // Extract content after successful generation
    const content = aiData.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('AI did not return structured output after successful generation');
    }

    let slidesData;
    try {
      slidesData = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Content:', content.substring(0, 500));
      throw new Error(`Failed to parse AI response: ${parseError.message}`);
    }

    const slides = slidesData.slides || [];
    console.log(`Generated ${slides.length} slides`);

    // Step 2: Extract image prompts
    const imagePrompts = slides
      .filter((slide: any) => slide.imagePrompt)
      .reduce((acc: any, slide: any, idx: number) => {
        acc[`slide-${slide.id}`] = slide.imagePrompt;
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

    // Step 4: Use slides without media generation to avoid timeouts
    // Media can be generated later via separate batch jobs
    const enrichedSlides = slides;
    console.log('Skipping media generation for performance - will be added via batch jobs');

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
          imagesCount: Object.keys(imagePrompts).length,
          audioCount: Object.keys(audioTexts).length
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
        imageCount: Object.keys(imagePrompts).length,
        audioCount: Object.keys(audioTexts).length,
        slides: enrichedSlides,
        message: 'Lesson created. Media generation in progress...'
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
  return `You are an expert ESL curriculum designer creating NovaKid-style interactive lesson slides for ${ageGroup}, ${cefrLevel} level.

LESSON DETAILS:
- Title: ${lessonPlan.title}
- Vocabulary: ${lessonPlan.targetLanguage?.vocabulary?.join(', ')}
- Grammar: ${lessonPlan.targetLanguage?.grammar?.join(', ')}
- Objectives: ${lessonPlan.objectives?.join('; ')}

REQUIRED OUTPUT: Create exactly 20-25 slides following this structure:

SLIDES 1-2: WARM-UP
1. Title slide: prompt with engaging hook question (50 words)
2. Warm-up activity: discussion questions or movement activity (60 words)

SLIDES 3-7: VOCABULARY & PRACTICE
3-5. Vocabulary slides: Each with definition, example, pronunciation (60 words each)
     Include imagePrompt: "Bright colorful cartoon [word], child-friendly style, educational"
6. Vocabulary game: Speed challenge or matching (50 words)
7. Grammar introduction: Rule + 2 examples (70 words)

SLIDES 8-12: INTERACTIVE ACTIVITIES
8. Grammar practice: Fill-in-blank with 3 questions (60 words)
9. Spinning wheel OR sorting activity (50 words)
     For spinning wheel: Include wheelSegments: [{text, color}] with 6 segments
     For sorting: Include sortItems: [{item, category}] with 6 items
10. Story builder OR role-play: Short dialogue or mad-libs (80 words)
11. Listening comprehension: Short story with questions (70 words)
12. Speaking practice: Guided prompts with character examples (60 words)

SLIDES 13-15: REVIEW & WRAP-UP
13. Review game: Quiz with 3-4 questions (50 words)
14. Interactive review: Mixed practice activities (50 words)
15. Celebration: Summary + homework assignment (50 words)

CHARACTER NAMES TO USE: Otis, Alice, Max, Lily, Marco, Ruby, Philip, Ann (use consistently in examples)

EMOJI REACTIONS: Include these in vocabulary slides: 😊😱😴🤩😂😨

Each slide must have:
- id: "slide-1" through "slide-15"
- type: (warmup, vocabulary, grammar, interactive, speaking, review, etc.)
- prompt: Main student-facing content (40-80 words, full instructions and examples)
- instructions: Teacher guidance (30-50 words)
- audioText: Narration script (optional, 20-40 words)
- imagePrompt: Image generation prompt (optional, 15-20 words)

Return valid JSON matching the required schema with version, theme, durationMin, metadata, and slides array.`;
}