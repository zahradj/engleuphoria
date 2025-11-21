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
            max_completion_tokens: 8000, // Updated for newer OpenAI models
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
  return `Create a COMPLETE, INTERACTIVE, GAMIFIED ESL lesson with songs and memory activities for ${ageGroup} students at ${cefrLevel} level.

**LESSON PARAMETERS:**
- Title: ${lessonPlan.title}
- Topic: ${lessonPlan.targetLanguage?.vocabulary?.join(', ')}
- CEFR Level: ${cefrLevel}
- Age Group: ${ageGroup}
- Learning Objectives: ${lessonPlan.objectives?.join(', ')}
- Grammar Focus: ${lessonPlan.targetLanguage?.grammar?.join(', ')}
- Duration: 45 minutes

**CRITICAL REQUIREMENTS:**
✓ 100% accurate, age-appropriate, error-free
✓ Ready for immediate classroom use
✓ All content must be concrete and specific (no placeholders)
✓ Include detailed image prompts for every visual element
✓ Include audio scripts for all pronunciation, instructions, and narration
✓ MUST include 1-2 songs with complete lyrics, melody description, and actions
✓ MUST include 5-8 cognitive memory activities for vocabulary retention

**7-STEP LESSON STRUCTURE (25 SLIDES TOTAL):**

**STEP 1: WARM-UP (Slides 1-2)**
1. Animated title slide with engaging hook question
2. Warm-up activity to activate prior knowledge
   - Include gamification (10 XP)
   - imagePrompt for visual engagement
   - audioText for instructions

**STEP 2: VOCABULARY INTRODUCTION (Slides 3-8)**
3-8. Present 6 key vocabulary words with FULL DETAILS:
   vocabularyDetails: [{
     word: target word,
     definition: simple child-friendly explanation (max 8 words),
     examples: [3 context sentences showing real usage],
     pronunciation: phonetic guide,
     partOfSpeech: noun/verb/adjective,
     collocations: [2-3 common word combinations],
     usageContext: when/where to use
   }]
   - Include colorful imagePrompt for each word
   - Include audioText for pronunciation
   - Gamification: 15 XP per word

**STEP 3: COGNITIVE MEMORY ACTIVITIES (Slides 9-13)**
9. **Flashcard Drill**: Visual + audio repetition for all 6 vocabulary words
   - type: "memory_flashcard"
   - activityData with all 6 words, images, audio
   - Gamification: 20 XP, "Memory Master" badge

10. **Association Game**: Link words to images, actions, or sounds
    - type: "memory_association"
    - activityData with 6 pairs to match
    - Gamification: 20 XP

11. **Recall Challenge**: Students remember words from memory
    - type: "memory_recall"
    - Show image, student recalls word
    - activityData with 6 questions
    - Gamification: 25 XP, streak bonus

12. **Mnemonic Song/Rhyme**: Short catchy phrase to remember vocabulary
    - type: "memory_mnemonic"
    - Include simple rhyme using all 6 words
    - audioText for rhythm
    - Gamification: 15 XP

13. **Repetition Sequence**: Students repeat words in rhythm or chant
    - type: "memory_repetition"
    - Include pattern (word → definition → example)
    - audioText for sequence
    - Gamification: 15 XP

**STEP 4: MAIN ACTIVITY / PRACTICE (Slides 14-18)**
14-15. **Grammar Focus**: Pattern recognition, examples, guided practice
    - Include ${lessonPlan.targetLanguage?.grammar?.join(', ')}
    - activityData with 4-5 practice questions
    - Gamification: 20 XP each

16-17. **Interactive Games**:
    - Slide 16: Matching game (word-to-image pairs)
    - Slide 17: Drag-and-drop (sentence building)
    - activityData with gameType, questions, hints
    - Gamification: 25 XP each, "Game Champion" badge

18. **Role-Play Dialogue**: Student pairs practice conversation
    - Include complete 6-line dialogue using vocabulary
    - teacherTips for facilitation
    - Gamification: 30 XP

**STEP 5: SONG ACTIVITY (Slides 19-20)**
19-20. **ESL Song with Actions**:
    Include in "songs" array:
    {
      id: "song-1",
      title: "[Creative song title related to ${lessonPlan.title}]",
      purpose: "Reinforce vocabulary: [list 6 words]",
      melody: "Simple, catchy tune (describe rhythm/pattern, e.g., 'to the tune of Twinkle Twinkle')",
      lyrics: "[Complete song lyrics, 2-3 verses, 30-60 seconds total, using ALL 6 vocabulary words]",
      actions: ["Action 1 for line 1", "Action 2 for line 2", "Action 3 for line 3", ...],
      audioScript: "[Complete narrated lyrics with rhythm markers]",
      visualPrompt: "Bright, colorful illustration showing children performing song actions, cartoon style, joyful expressions",
      repetitionStrategy: "Sing 3 times: first with teacher, second with students, third with actions"
    }
    - Slide 19: Introduce song, teach actions
    - Slide 20: Sing-along with full lyrics and gestures
    - Gamification: 35 XP, "Super Singer" badge

**STEP 6: ASSESSMENT / COMPREHENSION CHECK (Slides 21-23)**
21-23. **Comprehensive Quiz**: Multiple-choice, fill-in-blank, matching
    - activityData with 8-10 questions covering:
      * Vocabulary recognition
      * Grammar application
      * Song lyrics recall
      * Memory activity review
    - Include hints and explanations
    - Gamification: 15 XP per question, "Quiz Master" badge

**STEP 7: WRAP-UP (Slides 24-25)**
24. **XP Summary & Badges Earned**:
    - Show total XP (should be 400-500)
    - Display all badges unlocked
    - Celebration animation
    - Gamification: 50 bonus XP for completion

25. **Homework & Extension Activity**:
    - Review song at home (with link/reference)
    - Practice vocabulary with family
    - Optional: Create own verse for song
    - Reflection question

**GAMIFICATION REQUIREMENTS (ALL 25 SLIDES):**
Every slide MUST include gamification object:
{
  xpReward: 10-50 (based on difficulty and activity type),
  badgeUnlock?: "Badge Name" (for milestones: slides 9, 13, 17, 20, 23, 24),
  achievementCriteria?: "Complete activity correctly",
  feedbackPositive: ["Amazing!", "You're a star!", "Fantastic work!", "Keep it up!"],
  feedbackCorrection: ["Try again!", "Think about the word...", "Remember the song!", "Look at the picture again!"],
  streakBonus?: true (for slides 11, 16, 17, 21-23)
}

**MULTIMEDIA REQUIREMENTS:**
- imagePrompt: At least 22 slides with detailed, colorful, child-friendly illustrations
- audioText: At least 18 slides with clear pronunciation, instructions, or narration
- soundEffects: At least 15 slides with background music, success sounds, transitions

**SONGS ARRAY (MANDATORY - 1-2 songs):**
Must include at least 1 complete song in separate "songs" array with:
- Full lyrics (2-3 verses)
- Melody description
- 6-8 physical actions
- Audio narration script
- Visual prompt for illustration
- Repetition strategy

**OUTPUT FORMAT:**
Return structured data with:
{
  version: "4.0",
  theme: "vibrant-learning",
  durationMin: 45,
  metadata: {
    CEFR: "${cefrLevel}",
    module: 1,
    lesson: ${lessonPlan.lessonNumber || 1},
    targets: [${lessonPlan.objectives?.map((o: string) => `"${o}"`).join(', ')}],
    weights: { accuracy: 60, fluency: 40 }
  },
  slides: [25 complete slide objects with ALL required fields],
  songs: [1-2 complete song objects with lyrics, melody, actions, audio]
}

Make every slide production-ready, age-appropriate for ${ageGroup}, and engaging for ${cefrLevel} level students!`;
}