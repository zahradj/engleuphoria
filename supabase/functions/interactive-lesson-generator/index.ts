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
    const { 
      topic, 
      cefrLevel, 
      ageGroup, 
      duration, 
      vocabularyList, 
      grammarFocus, 
      learningObjectives,
      selectedActivities 
    } = await req.json();
    
    console.log('Generating interactive lesson:', { topic, cefrLevel, ageGroup });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build comprehensive prompt
    const prompt = buildLessonPrompt({
      topic,
      cefrLevel,
      ageGroup,
      duration,
      vocabularyList,
      grammarFocus,
      learningObjectives,
      selectedActivities
    });

    console.log('Calling AI to generate lesson structure...');
    
    let aiData;
    const maxRetries = 2;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [{ role: 'user', content: prompt }],
            response_format: {
              type: 'json_schema',
              json_schema: {
                name: 'interactive_lesson',
                strict: true,
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    topic: { type: 'string' },
                    totalScreens: { type: 'number' },
                    estimatedMinutes: { type: 'number' },
                    screens: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          screenNumber: { type: 'number' },
                          screenType: { type: 'string' },
                          title: { type: 'string' },
                          content: { type: 'object', additionalProperties: true },
                          durationSeconds: { type: 'number' },
                          xpReward: { type: 'number' }
                        },
                        required: ['screenNumber', 'screenType', 'title', 'content'],
                        additionalProperties: false
                      }
                    },
                    audioManifest: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          text: { type: 'string' },
                          type: { type: 'string' }
                        },
                        required: ['id', 'text', 'type'],
                        additionalProperties: false
                      }
                    },
                    totalXP: { type: 'number' },
                    badgesAvailable: { type: 'array', items: { type: 'string' } }
                  },
                  required: ['title', 'topic', 'totalScreens', 'screens'],
                  additionalProperties: false
                }
              }
            },
            max_completion_tokens: 4000
          }),
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error(`AI error (attempt ${attempt}):`, errorText);
          if (aiResponse.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
          }
          throw new Error(`AI generation failed: ${aiResponse.statusText}`);
        }

        aiData = await aiResponse.json();
        
        if (aiData.error) {
          throw new Error(`AI error: ${aiData.error.message}`);
        }
        
        console.log(`✓ AI generation successful on attempt ${attempt}`);
        break;
        
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    const content = aiData.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('AI did not return content');
    }

    const lessonData = JSON.parse(content);
    console.log(`Generated ${lessonData.screens?.length || 0} screens`);

    // Save to database
    console.log('Saving lesson to database...');
    
    const { data: savedLesson, error: saveError } = await supabaseClient
      .from('interactive_lessons')
      .insert({
        title: lessonData.title,
        topic,
        cefr_level: cefrLevel,
        age_group: ageGroup,
        duration_minutes: duration,
        vocabulary_list: vocabularyList,
        grammar_focus: grammarFocus,
        learning_objectives: learningObjectives,
        selected_activities: selectedActivities,
        screens_data: lessonData.screens,
        audio_manifest: lessonData.audioManifest || [],
        total_xp: lessonData.totalXP || 0,
        badges_available: lessonData.badgesAvailable || [],
        status: 'active'
      })
      .select()
      .single();

    if (saveError) {
      console.error('Save error:', saveError);
      throw saveError;
    }

    console.log(`Lesson saved with ID: ${savedLesson.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        lesson: savedLesson,
        message: 'Interactive lesson created successfully!'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Interactive lesson generation error:', error);
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

function buildLessonPrompt(params: any): string {
  const activityList = params.selectedActivities.join(', ');
  
  return `You are an expert ESL curriculum designer. Create a complete interactive lesson with EXACTLY 20 screens.

LESSON REQUIREMENTS:
Topic: ${params.topic}
CEFR Level: ${params.cefrLevel}
Age Group: ${params.ageGroup}
Duration: ${params.duration} minutes
Vocabulary: ${params.vocabularyList.join(', ')}
Grammar Focus: ${params.grammarFocus.join(', ') || 'None specified'}
Learning Objectives: ${params.learningObjectives.join('; ')}
Activity Types: ${activityList}

SCREEN DISTRIBUTION (exactly 20 screens):
1. Home Screen - Welcome with mascot
2. Intro Screen - Learning objectives
3-6. Vocabulary Screens (4 screens) - Word cards with images, audio placeholders, definitions, example sentences
7-8. Grammar Screens (2 screens) - Grammar explanations with examples
9-11. Interactive Game Screens (3 screens from: ${activityList})
12. Dialogue Screen - Role-play conversation
13. Speaking Practice Screen - Pronunciation practice
14. Listening Comprehension Screen - Audio story with questions
15. Reading Screen - Short story
16. Sentence Builder Screen - Drag words to build sentences
17-18. Quiz Screens (2 screens) - Multiple choice questions
19. Badge/Reward Screen - Achievements unlocked
20. Lesson Complete Screen - Summary and next steps

SCREEN TYPES AND CONTENT FORMAT:

For "vocabulary" screens:
{
  "screenType": "vocabulary",
  "title": "Learn New Words",
  "content": {
    "words": [
      {
        "word": "family",
        "ipa": "/ˈfæm.ə.li/",
        "partOfSpeech": "noun",
        "definition": "A group of people related by blood or marriage",
        "examples": ["My family is very large.", "I love spending time with my family."],
        "imagePrompt": "happy diverse family portrait",
        "audioPlaceholder": "audio/vocab/family.mp3"
      }
    ]
  }
}

For "matching" game screens:
{
  "screenType": "matching",
  "title": "Match the Words",
  "content": {
    "pairs": [
      { "word": "mother", "image": "woman with child", "correctMatch": 1 },
      { "word": "father", "image": "man with child", "correctMatch": 2 }
    ],
    "instructions": "Drag the words to match the pictures"
  }
}

For "dragdrop" screens:
{
  "screenType": "dragdrop",
  "title": "Sort the Items",
  "content": {
    "categories": ["Family Members", "Friends"],
    "items": ["mother", "father", "sister", "classmate", "neighbor"],
    "correctAnswers": { "Family Members": ["mother", "father", "sister"], "Friends": ["classmate", "neighbor"] }
  }
}

For "quiz" screens:
{
  "screenType": "quiz",
  "title": "Quick Quiz",
  "content": {
    "questions": [
      {
        "question": "Who is your mother's daughter?",
        "options": ["Sister", "Brother", "Cousin", "Aunt"],
        "correctAnswer": "Sister",
        "feedback": "Correct! Your mother's daughter is your sister."
      }
    ]
  }
}

AUDIO MANIFEST:
Create audioManifest array with:
- All vocabulary pronunciations
- Dialogue lines
- Story narration
- Example sentences
Format: { "id": "vocab_family", "text": "family", "type": "vocabulary" }

XP & BADGES:
- Award 10-50 XP per screen based on difficulty
- Badge examples: "Vocabulary Master", "Grammar Guru", "Conversation Star"

Generate complete, ready-to-use lesson data with all 20 screens filled with real content.`;
}
