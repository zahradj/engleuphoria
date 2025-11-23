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
            model: 'google/gemini-2.5-flash', // Fast, efficient model for lesson generation
            messages: [
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
                          prompt: { 
                            type: 'string',
                            description: 'MAIN STUDENT-FACING CONTENT with full details, examples, and learning material (100-250 words depending on slide type)'
                          },
                          instructions: { type: 'string' },
                          content: { 
                            type: 'string',
                            description: 'Additional detailed content (dialogue text, story, full explanations, practice prompts)'
                          },
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
            max_completion_tokens: 4000, // Further optimized for faster response
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
  return `Create interactive ESL lesson with songs & memory activities for ${ageGroup}, ${cefrLevel} level.

LESSON: ${lessonPlan.title}
VOCABULARY: ${lessonPlan.targetLanguage?.vocabulary?.join(', ')}
GRAMMAR: ${lessonPlan.targetLanguage?.grammar?.join(', ')}
OBJECTIVES: ${lessonPlan.objectives?.join('; ')}

🎯 CRITICAL: SLIDE STRUCTURE - Every slide MUST include:
- id: unique identifier
- type: slide type
- prompt: MAIN STUDENT-FACING CONTENT (NOT just a title! Include full questions, examples, scenarios, definitions - 100-250 words)
- content: Additional detailed material (dialogue text, stories, full explanations)
- instructions: Teacher facilitation guidance
- audioText: Pronunciation/narration script
- teacherTips: Teaching suggestions

📚 CONTENT LENGTH REQUIREMENTS (Keep concise for performance):
- Vocabulary slides: prompt 60-100 words (definition + 1-2 examples + pronunciation)
- Grammar slides: prompt 80-120 words (explanation + 2 examples + rule)
- Story/dialogue slides: prompt 100-150 words (complete dialogue)
- Memory activity slides: prompt 50-80 words (instructions + key items)
- Song slides: prompt 40-60 words (lyrics summary)
- Practice slides: prompt 60-90 words (clear instructions + example)

✨ EXAMPLE VOCABULARY SLIDE:
{
  id: "slide-3",
  type: "vocabulary_preview",
  prompt: "🌟 New Word: HELLO\\n\\nDefinition: A friendly greeting word we use when we meet someone for the first time or when we see someone we know.\\n\\nExample 1: \\"Hello! How are you today?\\" (when meeting a friend)\\nExample 2: \\"I say hello to my teacher every morning.\\" (polite greeting)\\n\\nPronunciation: heh-LOH (say it with a smile!)\\n\\n🎯 Practice Task: Stand up and say hello to three different people in your classroom. Remember to smile and make eye contact!\\n\\nExtra Tip: In English, we can also say \\"Hi\\" as a shorter, more casual way to greet friends.",
  content: "This is one of the most important words in English! We use 'hello' in many situations: when we answer the phone, when we enter a room, or when we meet new people. It's always polite to say hello with a friendly voice.",
  instructions: "Show the flashcard with a big smile. Model the pronunciation 3 times slowly, then 3 times at normal speed. Have students repeat chorally, then individually. Encourage them to practice with gestures (waving hand).",
  vocabularyDetails: [{
    word: "hello",
    definition: "A friendly greeting when meeting someone",
    examples: [
      "Hello! How are you?",
      "I say hello to my teacher every morning.",
      "We say hello when we answer the phone."
    ],
    pronunciation: "heh-LOH",
    partOfSpeech: "interjection",
    collocations: ["say hello", "hello everyone", "hello there"],
    usageContext: "Used in formal and informal situations for greetings"
  }],
  media: {
    type: "image",
    imagePrompt: "Colorful cartoon child with big smile waving hello, bright classroom background, friendly atmosphere, educational illustration style"
  },
  audioText: "[Clear, enthusiastic voice] Hello! Let's say it together: Hello. [pause] Great job! One more time: Hello. [pause] Excellent!",
  teacherTips: [
    "Use exaggerated gestures (big wave) to make it memorable",
    "Practice with different emotions: happy hello, shy hello, loud hello",
    "Connect to students' native language greetings for comparison"
  ],
  gamification: {
    xpReward: 15,
    feedbackPositive: ["Great pronunciation!", "You said it perfectly!"],
    feedbackCorrection: ["Try again with a smile!", "Let's practice one more time!"]
  }
}

📋 STRUCTURE (15 slides for optimal performance):

SLIDES 1-2: WARM-UP
1. Title slide (prompt: 40-50 words with hook question, 5 XP)
2. Warm-up (prompt: 50-60 words with activity, 10 XP)

SLIDES 3-5: VOCABULARY (3 words)
- prompt: 50-70 words (definition + example + pronunciation)
- vocabularyDetails: {word, definition, examples: [1-2 sentences], pronunciation, partOfSpeech}
- imagePrompt (brief)
- gamification: {xpReward: 15, feedbackPositive: [1-2], feedbackCorrection: [1-2]}

SLIDES 6-8: PRACTICE
6. Flashcard drill (prompt: 40-50 words, 20 XP)
7. Grammar (prompt: 60 words with rule + 2 examples, 20 XP)
8. Matching game (prompt: 50 words, 25 XP)

SLIDES 9-11: INTERACTIVE
9. Drag-drop (prompt: 50 words, 25 XP)
10. Role-play (prompt: 70 words with short dialogue, 30 XP)
11. Listening (prompt: 50 words, 20 XP)

SLIDE 12: SONG
Add to "songs" array: {id, title, lyrics (1 short verse), actions: [2-3]}
12. Song activity (prompt: 40-50 words with lyrics, 25 XP)

SLIDES 13-14: ASSESSMENT
13. Quiz (prompt: 50 words, activityData with 3 questions, 20 XP)
14. Review (prompt: 40 words, 25 XP, badgeUnlock: "Quiz Master")

SLIDE 15: WRAP-UP
15. Celebration + homework (prompt: 40-50 words, 50 bonus XP)

✅ REQUIREMENTS:
- ALL slides: Concise prompt (40-70 words max)
- ALL slides: gamification with xpReward
- 10+ slides: imagePrompt (10-15 words)
- Songs array: 1 short song
- Total XP: 250-350

You are an expert ESL curriculum designer. Create engaging lesson slides for ${ageGroup}, ${cefrLevel} level.

Return JSON with exactly 15 slides:
{
  version: "4.0",
  theme: "vibrant-learning",
  durationMin: 45,
  metadata: {CEFR: "${cefrLevel}", module: 1, lesson: ${lessonPlan.lessonNumber || 1}, targets: ["vocabulary", "grammar"], weights: {accuracy: 60, fluency: 40}},
  slides: [15 concise slides],
  songs: [1 short song]
}`;
}