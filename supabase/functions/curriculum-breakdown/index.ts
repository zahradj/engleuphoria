import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { operation, curriculumId, unitInfo } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    if (operation === 'generate-units') {
      return await generateUnits(supabaseClient, curriculumId);
    } else if (operation === 'generate-lessons') {
      return await generateLessons(supabaseClient, unitInfo);
    } else {
      throw new Error('Invalid operation');
    }
  } catch (error) {
    console.error('Error in curriculum-breakdown:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateUnits(supabaseClient: any, curriculumId: string) {
  console.log('Generating units for curriculum:', curriculumId);
  
  // Fetch curriculum
  const { data: curriculum, error: fetchError } = await supabaseClient
    .from('curriculum_programs')
    .select('*')
    .eq('id', curriculumId)
    .single();
    
  if (fetchError) throw new Error(`Failed to fetch curriculum: ${fetchError.message}`);
  
  const programData = curriculum.program_data || {};
  const units = programData.units || [];
  
  if (units.length === 0) {
    throw new Error('No units found in curriculum to expand');
  }
  
  console.log(`Found ${units.length} units to expand`);
  
  const generatedUnitIds = [];
  
  // Generate detailed units one by one
  for (const unit of units) {
    const prompt = `You are a curriculum expert. Given this unit outline from a curriculum, generate a detailed, comprehensive unit plan.

INPUT:
- Unit Number: ${unit.unitNumber}
- Title: ${unit.title}
- Duration: ${unit.weeks} weeks
- CEFR Level: ${unit.cefrLevel}
- Focus Areas: ${unit.focusAreas?.join(', ')}
- Age Group: ${curriculum.age_group}

Generate a detailed unit plan with:
1. 3-5 clear learning objectives in SMART format (Specific, Measurable, Achievable, Relevant, Time-bound)
2. Grammar focus points (array of specific grammar topics to be covered)
3. Vocabulary themes (array of thematic word sets)
4. Skills focus (specify which skills: listening, speaking, reading, writing)
5. Assessment methods (both formative and summative)
6. Week-by-week breakdown showing progression
7. Required materials and resources
8. Teacher implementation notes with practical tips

Return ONLY valid JSON (no markdown, no code blocks) in this exact structure:
{
  "learning_objectives": ["objective 1", "objective 2", "objective 3"],
  "grammar_focus": ["grammar point 1", "grammar point 2"],
  "vocabulary_themes": ["theme 1", "theme 2"],
  "skills_focus": ["speaking", "listening"],
  "assessment_methods": ["method 1", "method 2"],
  "weeklyBreakdown": [
    {"week": 1, "focus": "description", "activities": ["activity 1"]},
    {"week": 2, "focus": "description", "activities": ["activity 1"]}
  ],
  "materials": ["material 1", "material 2"],
  "teacherNotes": "implementation guidance here"
}`;

    console.log('Calling Lovable AI for unit:', unit.title);
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a curriculum expert. Always return valid JSON responses without markdown formatting.' },
          { role: 'user', content: prompt }
        ],
      }),
    });
    
    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', errorText);
      throw new Error(`AI generation failed: ${aiResponse.statusText}`);
    }
    
    const aiData = await aiResponse.json();
    const generatedText = aiData.choices?.[0]?.message?.content || '';
    
    // Clean and parse JSON response with better error handling
    let cleanedText = generatedText.trim();
    
    // Remove markdown code blocks
    if (cleanedText.includes('```')) {
      const match = cleanedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        cleanedText = match[1].trim();
      }
    }
    
    // Try to find JSON object/array if there's extra text
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }
    
    let unitDetails;
    try {
      unitDetails = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Attempted to parse:', cleanedText.substring(0, 500));
      throw new Error(`Failed to parse AI response: ${parseError.message}`);
    }
    
    // Save to curriculum_units table
    const { data: savedUnit, error: saveError } = await supabaseClient
      .from('curriculum_units')
      .insert({
        program_id: curriculumId,
        title: unit.title,
        unit_number: unit.unitNumber,
        duration_weeks: unit.weeks || 4,
        age_group: curriculum.age_group,
        cefr_level: unit.cefrLevel || curriculum.cefr_level,
        learning_objectives: unitDetails.learning_objectives || [],
        grammar_focus: unitDetails.grammar_focus || [],
        vocabulary_themes: unitDetails.vocabulary_themes || [],
        skills_focus: unitDetails.skills_focus || [],
        assessment_methods: unitDetails.assessment_methods || [],
        unit_data: {
          weeklyBreakdown: unitDetails.weeklyBreakdown || [],
          materials: unitDetails.materials || [],
          teacherNotes: unitDetails.teacherNotes || '',
          lessons: [] // Will be populated later
        },
        created_by: curriculum.created_by
      })
      .select()
      .single();
      
    if (saveError) {
      console.error('Error saving unit:', saveError);
      throw new Error(`Failed to save unit: ${saveError.message}`);
    }
    
    console.log('Saved unit:', savedUnit.id);
    generatedUnitIds.push(savedUnit.id);
  }
  
  return new Response(
    JSON.stringify({ 
      success: true,
      message: `Generated ${generatedUnitIds.length} units`,
      units: generatedUnitIds 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateLessons(supabaseClient: any, unitInfo: any) {
  console.log('Generating lessons for unit:', unitInfo.title);
  
  const lessonCount = Math.min(5, Math.max(3, unitInfo.durationWeeks || 4));
  
  const prompt = `You are a lesson planning expert. Generate ${lessonCount} detailed, sequential lesson plans for this unit.

UNIT INFORMATION:
- Unit: ${unitInfo.title}
- Age Group: ${unitInfo.ageGroup}
- CEFR Level: ${unitInfo.cefrLevel}
- Duration per lesson: 45 minutes
- Grammar Focus: ${unitInfo.grammarFocus?.join(', ')}
- Vocabulary: ${unitInfo.vocabularyThemes?.join(', ')}
- Overall Objectives: ${unitInfo.objectives?.join('; ')}

Generate ${lessonCount} progressive lesson plans. Each lesson should build on the previous one.

Return ONLY valid JSON (no markdown, no code blocks) as an array of lesson objects in this exact structure:
[
  {
    "lessonNumber": 1,
    "title": "engaging lesson title",
    "objectives": ["objective 1", "objective 2"],
    "targetLanguage": {
      "grammar": ["grammar point"],
      "vocabulary": ["word1", "word2", "word3"]
    },
    "materials": ["flashcards", "worksheets"],
    "warmUp": "5-minute engaging starter activity description",
    "presentation": "10-minute presentation of new language with examples",
    "controlledPractice": "10-15 minute guided practice activities",
    "freerPractice": "15-minute communicative tasks for using language freely",
    "assessment": "5-minute wrap-up and checking understanding",
    "homework": "optional homework suggestion",
    "differentiation": {
      "easier": "variation for struggling students",
      "harder": "extension for advanced students"
    },
    "teacherTips": "practical classroom management tips"
  }
]

Ensure:
- Lessons progress from simpler to more complex
- Vocabulary is recycled across lessons
- Activities are age-appropriate for ${unitInfo.ageGroup}
- Each lesson is complete and ready to teach`;

  console.log('Calling Lovable AI for lessons');
  
  const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: 'You are a lesson planning expert. Always return valid JSON responses without markdown formatting.' },
        { role: 'user', content: prompt }
      ],
    }),
  });
  
  if (!aiResponse.ok) {
    const errorText = await aiResponse.text();
    console.error('Lovable AI error:', errorText);
    throw new Error(`AI generation failed: ${aiResponse.statusText}`);
  }
  
  const aiData = await aiResponse.json();
  const generatedText = aiData.choices?.[0]?.message?.content || '';
  
  // Clean and parse JSON response with better error handling
  let cleanedText = generatedText.trim();
  
  // Remove markdown code blocks
  if (cleanedText.includes('```')) {
    const match = cleanedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
      cleanedText = match[1].trim();
    }
  }
  
  // Try to find JSON array if there's extra text
  const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    cleanedText = jsonMatch[0];
  }
  
  let lessons;
  try {
    lessons = JSON.parse(cleanedText);
    
    // Ensure it's an array
    if (!Array.isArray(lessons)) {
      console.error('AI returned non-array:', lessons);
      throw new Error('AI response is not an array');
    }
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    console.error('Attempted to parse:', cleanedText.substring(0, 500));
    throw new Error(`Failed to parse AI response: ${parseError.message}`);
  }
  
  console.log(`Generated ${lessons.length} lessons`);
  
  return new Response(
    JSON.stringify({ 
      success: true,
      message: `Generated ${lessons.length} lessons`,
      lessons 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
