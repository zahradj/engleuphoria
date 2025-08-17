import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

export default async function handler(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!openaiApiKey) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();
    
    console.log('🎯 Curriculum generator request:', body);

    // Handle full curriculum generation
    if (body.action === 'generate_full_curriculum') {
      return await generateFullCurriculum(supabase, body.batchSize || 10);
    }

    // Handle single lesson generation (original functionality)
    const { 
      topic, 
      cefr_level, 
      grammar_focus, 
      vocabulary_theme,
      lesson_objectives,
      target_age_group = "adults",
      specific_requirements = "",
      lesson_number = 1,
      is_review_lesson = false
    } = body;

    if (!topic || !cefr_level) {
      return new Response(
        JSON.stringify({ error: 'Topic and CEFR level are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lessonData = await generateSingleLesson({
      topic,
      cefr_level,
      grammar_focus,
      vocabulary_theme,
      lesson_objectives,
      target_age_group,
      specific_requirements,
      lesson_number,
      is_review_lesson
    });

    // Save to database
    const { data: lessonRecord, error: insertError } = await supabase
      .from('systematic_lessons')
      .insert([lessonData])
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to save lesson', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        lesson: lessonRecord,
        message: 'Lesson generated and saved successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in curriculum generator:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function generateFullCurriculum(supabase: any, batchSize: number = 10) {
  console.log('🏗️ Starting full curriculum generation...');
  
  try {
    // Get all curriculum levels
    const { data: levels, error: levelsError } = await supabase
      .from('curriculum_levels')
      .select('*')
      .order('level_order');

    if (levelsError || !levels || levels.length === 0) {
      throw new Error('No curriculum levels found');
    }

    console.log(`📚 Found ${levels.length} curriculum levels`);

    const cefrConfig = {
      'Pre-A1': { lessons: 50, topics: getTopicsForLevel('Pre-A1'), difficulty: 1, duration: 30 },
      'A1': { lessons: 60, topics: getTopicsForLevel('A1'), difficulty: 1, duration: 45 },
      'A2': { lessons: 60, topics: getTopicsForLevel('A2'), difficulty: 2, duration: 45 },
      'B1': { lessons: 60, topics: getTopicsForLevel('B1'), difficulty: 3, duration: 60 },
      'B2': { lessons: 60, topics: getTopicsForLevel('B2'), difficulty: 4, duration: 60 },
      'C1': { lessons: 60, topics: getTopicsForLevel('C1'), difficulty: 5, duration: 60 },
      'C2': { lessons: 60, topics: getTopicsForLevel('C2'), difficulty: 6, duration: 60 }
    };

    let totalGenerated = 0;
    const generationErrors = [];

    for (const level of levels) {
      const config = cefrConfig[level.cefr_level as keyof typeof cefrConfig];
      if (!config) continue;

      console.log(`🎯 Generating ${config.lessons} lessons for ${level.cefr_level}...`);

      // Check if lessons already exist for this level
      const { data: existingLessons } = await supabase
        .from('systematic_lessons')
        .select('lesson_number')
        .eq('curriculum_level_id', level.id);

      const existingNumbers = new Set(existingLessons?.map(l => l.lesson_number) || []);
      const lessonsToGenerate = [];

      // Prepare lesson generation requests
      for (let i = 1; i <= config.lessons; i++) {
        if (!existingNumbers.has(i)) {
          const topicIndex = (i - 1) % config.topics.length;
          const topic = config.topics[topicIndex];
          const isReviewLesson = i % 5 === 0; // Every 5th lesson is a review
          
          lessonsToGenerate.push({
            curriculum_level_id: level.id,
            lesson_number: i,
            topic,
            cefr_level: level.cefr_level,
            difficulty: config.difficulty,
            duration: config.duration,
            is_review_lesson: isReviewLesson
          });
        }
      }

      console.log(`📝 Need to generate ${lessonsToGenerate.length} lessons for ${level.cefr_level}`);

      // Generate lessons in batches
      for (let batch = 0; batch < lessonsToGenerate.length; batch += batchSize) {
        const batchLessons = lessonsToGenerate.slice(batch, batch + batchSize);
        console.log(`🔄 Processing batch ${Math.floor(batch/batchSize) + 1} for ${level.cefr_level} (${batchLessons.length} lessons)`);

        const batchPromises = batchLessons.map(async (lessonConfig) => {
          try {
            const lessonData = await generateSingleLesson({
              topic: lessonConfig.topic,
              cefr_level: lessonConfig.cefr_level,
              grammar_focus: getGrammarForLevel(lessonConfig.cefr_level, lessonConfig.lesson_number),
              vocabulary_theme: lessonConfig.topic,
              lesson_objectives: generateLessonObjectives(lessonConfig.topic, lessonConfig.cefr_level),
              target_age_group: "adults",
              specific_requirements: lessonConfig.is_review_lesson ? "This is a review lesson. Focus on consolidating previously learned material." : "",
              lesson_number: lessonConfig.lesson_number,
              is_review_lesson: lessonConfig.is_review_lesson
            });

            // Add curriculum-specific fields
            lessonData.curriculum_level_id = lessonConfig.curriculum_level_id;
            lessonData.lesson_number = lessonConfig.lesson_number;
            lessonData.difficulty_level = lessonConfig.difficulty;
            lessonData.estimated_duration = lessonConfig.duration;
            lessonData.is_review_lesson = lessonConfig.is_review_lesson;
            lessonData.status = 'published';

            return lessonData;
          } catch (error) {
            console.error(`❌ Failed to generate lesson ${lessonConfig.lesson_number} for ${lessonConfig.cefr_level}:`, error);
            generationErrors.push(`${lessonConfig.cefr_level} Lesson ${lessonConfig.lesson_number}: ${error.message}`);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        const successfulLessons = batchResults.filter(lesson => lesson !== null);

        if (successfulLessons.length > 0) {
          // Insert batch to database
          const { error: insertError } = await supabase
            .from('systematic_lessons')
            .insert(successfulLessons);

          if (insertError) {
            console.error('❌ Batch insert error:', insertError);
            generationErrors.push(`Database error for ${level.cefr_level} batch: ${insertError.message}`);
          } else {
            totalGenerated += successfulLessons.length;
            console.log(`✅ Successfully inserted ${successfulLessons.length} lessons for ${level.cefr_level}`);
          }
        }

        // Small delay between batches to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`🎉 Curriculum generation complete! Generated ${totalGenerated} lessons total.`);

    return new Response(
      JSON.stringify({
        success: true,
        total_generated: totalGenerated,
        errors: generationErrors,
        message: `Successfully generated ${totalGenerated} lessons across all CEFR levels`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Full curriculum generation failed:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to generate full curriculum',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function generateSingleLesson(params: any) {
  const { 
    topic, 
    cefr_level, 
    grammar_focus, 
    vocabulary_theme,
    lesson_objectives,
    target_age_group,
    specific_requirements,
    lesson_number,
    is_review_lesson
  } = params;

  const reviewInstructions = is_review_lesson 
    ? "\n\nIMPORTANT: This is a REVIEW LESSON. Focus on consolidating and practicing previously learned vocabulary, grammar, and skills. Include revision activities and assessment elements."
    : "";

  const prompt = `You are an expert English curriculum architect and lesson designer. Create a comprehensive, interactive 30-minute English lesson that is whiteboard-compatible and gamified.

LESSON SPECIFICATIONS:
- Topic: ${topic}
- CEFR Level: ${cefr_level}
- Grammar Focus: ${grammar_focus || 'Context-appropriate grammar'}
- Vocabulary Theme: ${vocabulary_theme || topic}
- Target Age Group: ${target_age_group}
- Lesson Number: ${lesson_number}
- Review Lesson: ${is_review_lesson ? 'Yes' : 'No'}
${reviewInstructions}

LEARNING OBJECTIVES:
${Array.isArray(lesson_objectives) ? lesson_objectives.join('\n- ') : lesson_objectives || `
- Master key vocabulary related to ${topic}
- Apply grammar structures in context
- Develop speaking and listening skills
- Build confidence in real-life communication`}

SPECIAL REQUIREMENTS:
${specific_requirements || 'None'}

Create a lesson with the following structure (30 minutes total):

🌟 WARM-UP / HOOK (3 minutes)
- Engaging opening activity to activate prior knowledge
- Connect to students' experiences

📚 VOCABULARY INTRODUCTION (6 minutes)
- 8-12 key words with visual supports
- Interactive presentation techniques
- Clear pronunciation practice

⚡ GRAMMAR FOCUS (5 minutes)
- Target grammar structure with examples
- Concept checking questions (CCQs)
- Form, meaning, and pronunciation

🎮 GAMIFIED ACTIVITIES (10 minutes)
Create 3 interactive whiteboard activities:
1. Drag-and-drop vocabulary matching
2. Grammar gap-fill or reordering exercise
3. Role-play scenario or speaking game

🗣️ SPEAKING PRACTICE (4 minutes)
- Controlled and freer practice activities
- Pair/group work with clear instructions

🏆 REVIEW & ASSESSMENT (2 minutes)
- Quick quiz or exit ticket
- Badge/achievement award
- Lesson recap

Return your response as a JSON object with this exact structure:

{
  "title": "Engaging lesson title",
  "topic": "${topic}",
  "grammar_focus": "Main grammar point",
  "vocabulary_set": ["word1", "word2", "word3", ...],
  "communication_outcome": "What students can do after the lesson",
  "lesson_objectives": ["objective1", "objective2", ...],
  "slides_content": {
    "slides": [
      {
        "slide_number": 1,
        "title": "Slide title",
        "content": "Detailed slide content with instructions",
        "duration": 3,
        "activity_type": "warm_up"
      }
    ],
    "total_slides": 8,
    "gamification": {
      "points_system": "How students earn points",
      "badges": ["badge1", "badge2"],
      "interactive_elements": ["element1", "element2"]
    }
  },
  "activities": [
    {
      "name": "Activity name",
      "type": "interactive_type",
      "duration": 5,
      "instructions": "Clear teacher instructions",
      "materials": "Required materials",
      "interaction_pattern": "individual/pair/group"
    }
  ],
  "gamified_elements": {
    "points_activities": ["Points for participation", "Points for correct answers"],
    "achievement_unlocks": ["Speaking Badge", "Vocabulary Master"],
    "progress_tracking": "Lesson completion percentage"
  },
  "homework_extension": "Optional homework task"
}

Ensure all content is age-appropriate, culturally sensitive, and pedagogically sound. Make activities highly interactive and whiteboard-friendly.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-2024-08-06',
        messages: [
          {
            role: 'system',
            content: 'You are an expert English curriculum architect. Always respond with valid JSON only. No additional text or explanations outside the JSON structure.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse the JSON response
    let lessonData;
    try {
      lessonData = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', content);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Validate and enhance the lesson data
    const processedLesson = {
      title: lessonData.title || `${cefr_level} Lesson ${lesson_number}: ${topic}`,
      topic: lessonData.topic || topic,
      grammar_focus: lessonData.grammar_focus || grammar_focus || 'General grammar',
      vocabulary_set: Array.isArray(lessonData.vocabulary_set) ? lessonData.vocabulary_set : [],
      communication_outcome: lessonData.communication_outcome || `Students can discuss ${topic}`,
      lesson_objectives: Array.isArray(lessonData.lesson_objectives) ? lessonData.lesson_objectives : [],
      slides_content: lessonData.slides_content || { slides: [], total_slides: 0, gamification: {} },
      activities: Array.isArray(lessonData.activities) ? lessonData.activities : [],
      gamified_elements: lessonData.gamified_elements || {},
      homework_extension: lessonData.homework_extension || null,
      created_at: new Date().toISOString(),
      metadata: {
        generated_by: 'ai',
        generation_model: 'gpt-4o-2024-08-06',
        generation_timestamp: new Date().toISOString(),
        target_age_group,
        specific_requirements
      }
    };

    return processedLesson;

  } catch (error) {
    console.error('Error generating lesson:', error);
    throw error;
  }
}

// Helper functions for curriculum generation
function getTopicsForLevel(level: string): string[] {
  const topics = {
    'Pre-A1': [
      'Greetings and Introductions', 'Numbers and Counting', 'Colors and Shapes', 'Family Members',
      'Body Parts', 'Food and Drinks', 'Animals', 'Toys and Games', 'Classroom Objects',
      'Weather', 'Days of the Week', 'Months and Seasons', 'Clothes', 'Transportation',
      'My House', 'Feelings', 'Actions', 'School Life', 'Friends', 'Hobbies'
    ],
    'A1': [
      'Personal Information', 'Daily Routines', 'Family and Friends', 'Food and Restaurants',
      'Shopping', 'Travel and Transportation', 'Weather and Seasons', 'Sports and Hobbies',
      'Work and Jobs', 'Health and Body', 'Home and Neighborhood', 'Time and Dates',
      'Clothes and Fashion', 'Entertainment', 'Technology', 'School and Education',
      'Holidays and Celebrations', 'Animals and Pets', 'Countries and Nationalities', 'Feelings and Emotions'
    ],
    'A2': [
      'Past Experiences', 'Future Plans', 'Comparing Things', 'Giving Advice', 'Describing People',
      'Travel Stories', 'Cultural Differences', 'Environmental Issues', 'Technology in Daily Life',
      'Health and Fitness', 'Education Systems', 'Work and Career', 'Media and News',
      'Relationships', 'Cooking and Recipes', 'Money and Banking', 'City vs Country Life',
      'Social Media', 'Volunteering', 'Learning Languages'
    ],
    'B1': [
      'Current Affairs', 'Social Issues', 'Career Development', 'Innovation and Technology',
      'Environmental Conservation', 'Cultural Traditions', 'Healthcare Systems', 'Education and Learning',
      'Business and Entrepreneurship', 'Travel and Tourism', 'Literature and Arts',
      'Scientific Discoveries', 'Political Systems', 'Global Communication', 'Economics',
      'Social Psychology', 'Urban Planning', 'Digital Revolution', 'Sustainable Living', 'International Relations'
    ],
    'B2': [
      'Globalization', 'Artificial Intelligence', 'Climate Change Solutions', 'Ethical Dilemmas',
      'Space Exploration', 'Genetic Engineering', 'Renewable Energy', 'Mental Health Awareness',
      'Cryptocurrency and Finance', 'Virtual Reality', 'Medical Breakthroughs', 'Automation and Jobs',
      'Cultural Preservation', 'Privacy in Digital Age', 'Sustainable Development', 'Bioethics',
      'Quantum Computing', 'Social Entrepreneurship', 'Neuroscience', 'Philosophical Debates'
    ],
    'C1': [
      'Complex Societal Issues', 'Advanced Scientific Concepts', 'Philosophical Movements',
      'Economic Theories', 'Political Ideologies', 'Literary Analysis', 'Artistic Movements',
      'Historical Perspectives', 'Psychological Theories', 'Technological Ethics',
      'Global Governance', 'Cultural Anthropology', 'Environmental Philosophy', 'Legal Systems',
      'Cognitive Science', 'Sociological Phenomena', 'Linguistic Evolution', 'Mathematical Concepts',
      'Architectural Theory', 'Comparative Religion'
    ],
    'C2': [
      'Theoretical Physics', 'Advanced Philosophy', 'Complex Literature', 'Scientific Research',
      'Academic Discourse', 'Professional Expertise', 'Specialized Fields', 'Critical Analysis',
      'Abstract Concepts', 'Interdisciplinary Studies', 'Research Methodology', 'Academic Writing',
      'Specialized Terminology', 'Complex Argumentation', 'Advanced Linguistics', 'Cultural Studies',
      'Professional Communication', 'Expert Knowledge', 'Academic Presentations', 'Research Ethics'
    ]
  };

  return topics[level as keyof typeof topics] || topics['B1'];
}

function getGrammarForLevel(level: string, lessonNumber: number): string {
  const grammarProgression = {
    'Pre-A1': ['Present tense "to be"', 'Articles a/an', 'Plural nouns', 'Simple adjectives'],
    'A1': ['Present simple', 'Present continuous', 'Past simple', 'Future with going to', 'Modal can/can\'t'],
    'A2': ['Past continuous', 'Present perfect', 'Comparatives and superlatives', 'Modal should/must', 'First conditional'],
    'B1': ['Past perfect', 'Second conditional', 'Passive voice', 'Reported speech', 'Present perfect continuous'],
    'B2': ['Third conditional', 'Mixed conditionals', 'Advanced passive forms', 'Subjunctive mood', 'Complex sentence structures'],
    'C1': ['Advanced conditionals', 'Participle clauses', 'Inversion', 'Cleft sentences', 'Advanced modal verbs'],
    'C2': ['Complex grammatical structures', 'Stylistic devices', 'Register variation', 'Advanced syntax', 'Discourse markers']
  };

  const grammar = grammarProgression[level as keyof typeof grammarProgression] || grammarProgression['B1'];
  return grammar[(lessonNumber - 1) % grammar.length];
}

function generateLessonObjectives(topic: string, level: string): string[] {
  const baseObjectives = [
    `Understand and use key vocabulary related to ${topic}`,
    `Apply appropriate grammar structures in context`,
    `Develop fluency in speaking about ${topic}`,
    `Improve listening comprehension skills`
  ];

  const levelSpecificObjectives = {
    'Pre-A1': [`Recognize basic words about ${topic}`, 'Use simple phrases in context'],
    'A1': [`Form simple sentences about ${topic}`, 'Ask and answer basic questions'],
    'A2': [`Express opinions about ${topic}`, 'Describe experiences related to ${topic}`],
    'B1': [`Discuss ${topic} in detail`, 'Present arguments and opinions'],
    'B2': [`Analyze complex aspects of ${topic}`, 'Participate in debates and discussions`],
    'C1': [`Critically evaluate ${topic}`, 'Use sophisticated language structures`],
    'C2': [`Demonstrate expertise in discussing ${topic}`, 'Use precise and nuanced language`]
  };

  const specific = levelSpecificObjectives[level as keyof typeof levelSpecificObjectives] || levelSpecificObjectives['B1'];
  return [...baseObjectives, ...specific];
}