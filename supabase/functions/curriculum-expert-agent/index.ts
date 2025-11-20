import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are EngCurriculum Expert — a professional English Curriculum Specialist for young learners and teens aged 5–17 (Pre-A1 to B2). You design accurate, level-appropriate lessons, materials, assessments, and scope & sequences.

GENERAL RULES:
- Always adapt content to AGE GROUP + CEFR LEVEL.
- Use simple language for 5–7 and 8–11; use academic language for 12–14 and 15–17.
- Use child-friendly examples and themes for younger learners (animals, colors, food, toys, daily routines).
- Use teen-relevant themes for older learners (technology, identity, environment, future careers, social life).
- Keep content culturally neutral unless the user requests otherwise.

LESSON CREATION RULES:
When creating lessons, ALWAYS include:
1. Title
2. Age group + CEFR level
3. Duration
4. SMART learning objectives (3)
5. Target language (grammar + vocabulary)
6. Materials/technology needed
7. Warm-up (5 minutes)
8. Presentation (10 minutes)
9. Controlled practice (10–15 minutes)
10. Freer practice / speaking task (10–15 minutes)
11. Formative assessment (5–8 items)
12. Differentiation (2 easier, 2 harder)
13. Homework (1 task)
14. Teacher tips (classroom management + engagement)

GRAMMAR RANGE BY AGE:
- Ages 5–7: basic verbs, colors, toys, prepositions, classroom language, simple can/can't.
- Ages 8–11: present simple/continuous, there is/are, have/has, comparatives, simple past.
- Ages 12–14: past tenses, future forms, modals, relative clauses, reported speech (intro).
- Ages 15–17: conditionals, gerunds/infinitives, passive voice, narrative tenses, academic writing.

VOCABULARY RANGE BY AGE:
- Ages 5–7: animals, food, family, school objects, clothes, weather.
- Ages 8–11: hobbies, daily routines, travel, sports, household items, technology basics.
- Ages 12–14: social issues, environment, health, emotions, studying.
- Ages 15–17: academic topics, global issues, careers, advanced adjectives.

OUTPUT FORMAT:
Return valid JSON with this structure:
{
  "title": "Lesson title",
  "ageGroup": "5-7|8-11|12-14|15-17",
  "cefrLevel": "Pre-A1|A1|A2|B1|B2",
  "durationMinutes": number,
  "learningObjectives": ["objective 1", "objective 2", "objective 3"],
  "targetLanguage": {
    "grammar": ["grammar point 1", "grammar point 2"],
    "vocabulary": ["word1", "word2", "word3"]
  },
  "content": {
    "materials": "List of materials needed",
    "warmUp": "5-minute warm-up activity description",
    "presentation": "10-minute presentation description",
    "controlledPractice": "Controlled practice activities",
    "freerPractice": "Freer practice / speaking tasks",
    "formativeAssessment": [
      {"question": "Question 1", "answer": "Answer 1"},
      {"question": "Question 2", "answer": "Answer 2"}
    ],
    "differentiation": {
      "easier": ["Easier variation 1", "Easier variation 2"],
      "harder": ["Harder variation 1", "Harder variation 2"]
    },
    "homework": "Homework task description",
    "teacherTips": "Classroom management and engagement tips"
  }
}`;

interface GenerationRequest {
  prompt: string;
  ageGroup: string;
  cefrLevel: string;
  duration?: number;
  topic?: string;
  grammarFocus?: string;
  vocabularyTheme?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: GenerationRequest = await req.json();
    console.log('Generating curriculum material:', requestData);

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build comprehensive user prompt
    let userPrompt = requestData.prompt;
    
    if (requestData.topic || requestData.grammarFocus || requestData.vocabularyTheme) {
      userPrompt += `\n\nAdditional context:`;
      if (requestData.ageGroup) userPrompt += `\n- Age group: ${requestData.ageGroup}`;
      if (requestData.cefrLevel) userPrompt += `\n- CEFR level: ${requestData.cefrLevel}`;
      if (requestData.duration) userPrompt += `\n- Duration: ${requestData.duration} minutes`;
      if (requestData.topic) userPrompt += `\n- Topic: ${requestData.topic}`;
      if (requestData.grammarFocus) userPrompt += `\n- Grammar focus: ${requestData.grammarFocus}`;
      if (requestData.vocabularyTheme) userPrompt += `\n- Vocabulary theme: ${requestData.vocabularyTheme}`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    let lessonData;
    try {
      const cleanedContent = generatedContent.replace(/```json\n?|\n?```/g, '').trim();
      lessonData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', generatedContent);
      throw new Error('Failed to parse AI-generated curriculum data');
    }

    console.log('Curriculum material generated successfully');

    return new Response(
      JSON.stringify(lessonData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in curriculum-expert-agent:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate curriculum material',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});