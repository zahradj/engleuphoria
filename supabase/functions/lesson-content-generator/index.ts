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
            model: 'openai/gpt-5-mini', // Switched to OpenAI for more reliability
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
                description: 'Generate enhanced interactive ESL lesson slides with gamification',
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
                          teacherTips: { type: 'array', items: { type: 'string' } },
                          vocabularyDetails: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                word: { type: 'string' },
                                definition: { type: 'string' },
                                examples: { type: 'array', items: { type: 'string' } },
                                pronunciation: { type: 'string' },
                                partOfSpeech: { type: 'string' },
                                collocations: { type: 'array', items: { type: 'string' } },
                                usageContext: { type: 'string' }
                              }
                            }
                          },
                          gamification: {
                            type: 'object',
                            properties: {
                              xpReward: { type: 'number' },
                              badgeUnlock: { type: 'string' },
                              achievementCriteria: { type: 'string' },
                              feedbackPositive: { type: 'array', items: { type: 'string' } },
                              feedbackCorrection: { type: 'array', items: { type: 'string' } },
                              streakBonus: { type: 'boolean' }
                            }
                          },
                          activityData: {
                            type: 'object',
                            properties: {
                              gameType: { type: 'string' },
                              difficulty: { type: 'string' },
                              timeLimit: { type: 'number' },
                              questions: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                  properties: {
                                    question: { type: 'string' },
                                    options: { type: 'array', items: { type: 'string' } },
                                    correctAnswer: { type: 'string' },
                                    explanation: { type: 'string' },
                                    hint: { type: 'string' }
                                  }
                                }
                              }
                            }
                          },
                          soundEffects: {
                            type: 'object',
                            properties: {
                              backgroundMusic: { type: 'string' },
                              successSound: { type: 'boolean' },
                              errorSound: { type: 'boolean' },
                              transitionSound: { type: 'boolean' }
                            }
                          }
                        }
                      }
                    },
                    songs: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          title: { type: 'string' },
                          purpose: { type: 'string' },
                          melody: { type: 'string' },
                          lyrics: { type: 'string' },
                          actions: { type: 'array', items: { type: 'string' } },
                          audioScript: { type: 'string' },
                          visualPrompt: { type: 'string' },
                          repetitionStrategy: { type: 'string' }
                        }
                      }
                    }
                  },
                  required: ['version', 'theme', 'durationMin', 'metadata', 'slides']
                }
              }
            }],
            tool_choice: { type: 'function', function: { name: 'generate_lesson_slides' } },
            max_completion_tokens: 16000, // Increased for complex lesson generation
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
        
        // Extract from tool call
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
        if (!toolCall) {
          console.error(`No tool call in response (attempt ${attempt}):`, JSON.stringify(aiData, null, 2));
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
    
    // Extract tool call after successful generation
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('AI did not return structured output after successful generation');
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
  return `Create interactive ESL lesson with songs & memory activities for ${ageGroup}, ${cefrLevel} level.

LESSON: ${lessonPlan.title}
VOCABULARY: ${lessonPlan.targetLanguage?.vocabulary?.join(', ')}
GRAMMAR: ${lessonPlan.targetLanguage?.grammar?.join(', ')}
OBJECTIVES: ${lessonPlan.objectives?.join('; ')}

STRUCTURE (25 slides):

SLIDES 1-2: WARM-UP
- Title + hook question
- Warm-up activity (10 XP, imagePrompt, audioText)

SLIDES 3-8: VOCABULARY (6 words)
Each word needs:
- vocabularyDetails: {word, definition (8 words max), examples: [2 sentences], pronunciation, partOfSpeech}
- imagePrompt (colorful, simple)
- audioText (pronunciation)
- gamification: {xpReward: 15, feedbackPositive: ["Great!"], feedbackCorrection: ["Try again!"]}

SLIDES 9-13: MEMORY ACTIVITIES
9. Flashcard drill (type: memory_flashcard, 6 words, 20 XP, badgeUnlock: "Memory Master")
10. Association game (type: memory_association, 6 pairs, 20 XP)
11. Recall challenge (type: memory_recall, 6 questions, 25 XP, streakBonus: true)
12. Mnemonic rhyme (type: memory_mnemonic, simple rhyme with 6 words, 15 XP)
13. Repetition chant (type: memory_repetition, word→definition pattern, 15 XP)

SLIDES 14-18: PRACTICE
14-15. Grammar (activityData with 4 questions, 20 XP each)
16. Matching game (gameType: matching, 6 pairs, 25 XP, badgeUnlock: "Game Champion")
17. Drag-drop (gameType: drag_drop, 5 sentences, 25 XP, streakBonus: true)
18. Role-play (6-line dialogue, teacherTips, 30 XP)

SLIDES 19-20: SONG
Add to "songs" array:
{
  id: "song-1",
  title: "[Song about ${lessonPlan.title}]",
  purpose: "Reinforce: [6 words]",
  melody: "Simple tune (e.g., Twinkle Twinkle style)",
  lyrics: "[2 verses, 40 seconds, use all 6 words]",
  actions: ["[Action 1]", "[Action 2]", "[Action 3]", "[Action 4]"],
  audioScript: "[Narrate lyrics with rhythm]",
  visualPrompt: "Kids singing with actions, colorful, cartoon",
  repetitionStrategy: "Sing 3x: teacher, students, with actions"
}
Slide 19: Teach song/actions (20 XP)
Slide 20: Sing-along (35 XP, badgeUnlock: "Super Singer")

SLIDES 21-23: ASSESSMENT
Quiz with activityData containing 8 questions:
- Multiple choice (4 questions)
- Fill-in-blank (2 questions)
- Matching (2 questions)
Each: 15 XP, hints, explanations
Slide 23: badgeUnlock: "Quiz Master"

SLIDES 24-25: WRAP-UP
24. XP summary (total 400-500 XP), badges earned, 50 bonus XP
25. Homework: review song, practice with family

REQUIREMENTS:
- All slides: gamification {xpReward, feedbackPositive: [2 phrases], feedbackCorrection: [2 phrases]}
- 20+ slides: imagePrompt (brief, colorful, age-appropriate)
- 15+ slides: audioText (pronunciation/instructions)
- Songs array: 1 complete song with lyrics & actions

Return:
{
  version: "4.0",
  theme: "vibrant-learning",
  durationMin: 45,
  metadata: {CEFR: "${cefrLevel}", module: 1, lesson: ${lessonPlan.lessonNumber || 1}, targets: [...], weights: {accuracy: 60, fluency: 40}},
  slides: [25 slides],
  songs: [1 song]
}`;
}