import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, cefrLevel, moduleNumber, lessonNumber, learningObjectives, customRequirements } = await req.json();

    console.log('Generating lesson for:', { topic, cefrLevel, moduleNumber, lessonNumber });

    const prompt = `You are an expert ESL curriculum designer creating classroom-ready lessons with COMPLETE, DETAILED content.

Create exactly 22-25 slides with this EXACT distribution:
- 1 Title slide
- 2 Warmup slides (engaging questions with visuals)
- 4 Vocabulary slides (10 total words with FULL details: word, IPA pronunciation, part of speech, definition, 3 example sentences, detailed image prompt, related words)
- 4 Grammar slides (2 grammar points, each with pattern, rule, 5-6 examples, 4 practice exercises with correct answers and feedback)
- 3 Listening comprehension slides
- 4-5 Interactive game slides (drag-drop, matching, quizzes with complete game data)
- 2 Controlled practice slides
- 2 Speaking practice slides (role-play scenarios)
- 1 Review consolidation slide

LESSON PARAMETERS:
- Topic: ${topic}
- CEFR Level: ${cefrLevel}
- Module: ${moduleNumber}, Lesson: ${lessonNumber}
- Learning Objectives: ${learningObjectives?.join(', ') || 'Develop language skills through vocabulary, grammar, and interactive practice'}
- Custom Requirements: ${customRequirements || 'None'}

CRITICAL REQUIREMENTS:
✓ NO PLACEHOLDERS - Every field must have real, complete content
✓ All vocabulary words MUST include: word, pronunciation (IPA format like "/ˈmʌð.ɚ/"), partOfSpeech (noun/verb/adjective/etc), definition (max 10 words), examples (array of 3 complete sentences), imagePrompt (detailed description 25+ words), relatedWords (array of 2-4 related terms)
✓ All grammar slides MUST include: pattern (the structure), rule (clear explanation), examples (array of 5-6 sentences with optional highlight fields), exercises (array of 4 items with type, question/sentence, options, correctAnswer, feedback)
✓ All interactive activities MUST include complete game data:
  - drag_drop: items array (with id, text, audioText, targetZone), zones array (with id, imagePrompt, acceptsItems)
  - matching_pairs: pairs array (with id, card1, card2 objects containing text or imagePrompt)
  - multiple_choice_quiz: questions array (with id, question, options[4], correctAnswer index, feedback)
  - sentence_builder: sentences array (with words, correctOrder, audioText)
  - listen_and_choose: items array (with audioText, options with imagePrompt and isCorrect)
✓ All image prompts MUST be minimum 25 words, highly descriptive (e.g., "Colorful, friendly cartoon illustration of a mother with her child, warm colors, educational style for children aged 6-10, clear facial features, simple shapes")
✓ All exercises MUST have correctAnswer and feedback fields filled

Return ONLY a valid JSON object with this structure:
{
  "title": "Lesson title",
  "topic": "${topic}",
  "cefr_level": "${cefrLevel}",
  "module_number": ${moduleNumber},
  "lesson_number": ${lessonNumber},
  "learning_objectives": ["objective1", "objective2"],
  "vocabulary_focus": ["word1", "word2"],
  "grammar_focus": ["concept1", "concept2"],
  "duration_minutes": 60,
  "slides": [
    {
      "id": "slide-1",
      "type": "warmup",
      "prompt": "Slide content/question",
      "instructions": "Teacher instructions",
      "media": {"type": "image", "alt": "Description"},
      "options": [{"id": "1", "text": "Option 1", "isCorrect": true}],
      "timeLimit": 300,
      "accessibility": {"screenReaderText": "Description"}
    }
  ]
}

Use these slide types: warmup, vocabulary_preview, target_language, listening_comprehension, sentence_builder, pronunciation_shadow, grammar_focus, accuracy_mcq, drag_drop, matching_pairs, multiple_choice_quiz, listen_and_choose, controlled_practice, communicative_task, review_consolidation.

VALIDATION RULES:
1. Every vocabulary word MUST have all 7 fields filled
2. Every grammar slide MUST have: pattern, rule, examples[5-6], exercises[4]
3. Every exercise MUST have: type, question/sentence, options, correctAnswer, feedback
4. Every image prompt MUST be minimum 25 words
5. Every interactive activity MUST have complete game data (no placeholders like "image here")

Generate the complete lesson now with ALL fields fully populated.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert ESL curriculum designer. Create professional, interactive lesson slides that follow modern language teaching methodologies. Always return valid JSON only.' 
          },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('Generated content preview:', generatedContent.substring(0, 200));

    // Parse the JSON response
    let lessonData;
    try {
      lessonData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', generatedContent);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate the lesson data structure
    if (!lessonData.slides || !Array.isArray(lessonData.slides)) {
      throw new Error('Invalid lesson structure: slides array missing');
    }

    // Perform detailed content validation
    console.log('Validating lesson content...');
    const hasVocabularyWords = lessonData.slides.some((s: any) => 
      (s.type === 'vocabulary_preview' || s.type === 'vocabulary') && s.words && s.words.length > 0
    );
    const hasGrammarExercises = lessonData.slides.some((s: any) => 
      (s.type === 'grammar_focus' || s.type === 'target_language') && s.exercises && s.exercises.length > 0
    );
    const hasInteractiveActivities = lessonData.slides.some((s: any) => 
      ['drag_drop', 'matching_pairs', 'multiple_choice_quiz', 'sentence_builder'].includes(s.type)
    );

    console.log('Content validation:', {
      totalSlides: lessonData.slides.length,
      hasVocabularyWords,
      hasGrammarExercises,
      hasInteractiveActivities
    });

    if (lessonData.slides.length < 15) {
      console.warn(`Warning: Only ${lessonData.slides.length} slides generated (recommended: 22-25)`);
    }

    // Store in Supabase
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    const { data: savedLesson, error: saveError } = await supabase
      .from('lessons_content')
      .insert({
        title: lessonData.title,
        topic: lessonData.topic,
        cefr_level: lessonData.cefr_level,
        module_number: lessonData.module_number,
        lesson_number: lessonData.lesson_number,
        slides_content: {
          version: '2.0',
          theme: 'mist-blue',
          slides: lessonData.slides,
          durationMin: lessonData.duration_minutes,
          total_slides: lessonData.slides.length,
          metadata: {
            CEFR: lessonData.cefr_level,
            module: lessonData.module_number,
            lesson: lessonData.lesson_number,
            targets: lessonData.learning_objectives,
            weights: { accuracy: 0.6, fluency: 0.4 }
          }
        },
        learning_objectives: lessonData.learning_objectives,
        vocabulary_focus: lessonData.vocabulary_focus,
        grammar_focus: lessonData.grammar_focus,
        duration_minutes: lessonData.duration_minutes,
        metadata: {
          generated_by: 'ai-lesson-generator',
          slide_count: lessonData.slides.length,
          custom_requirements: customRequirements
        }
      })
      .select()
      .single();

    if (saveError) {
      console.error('Supabase save error:', saveError);
      throw new Error(`Failed to save lesson: ${saveError.message}`);
    }

    console.log('Lesson saved successfully:', savedLesson.id);

    return new Response(JSON.stringify({
      success: true,
      lesson: savedLesson,
      message: `Generated ${lessonData.slides.length} slides for "${lessonData.title}"`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-lesson-generator:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});