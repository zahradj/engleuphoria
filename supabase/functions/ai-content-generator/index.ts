
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentRequest {
  type: 'worksheet' | 'activity' | 'lesson_plan' | 'quiz' | 'flashcards';
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  specificRequirements?: string;
  studentAge?: string;
  learningObjectives?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contentRequest: ContentRequest = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating AI content:', contentRequest);

    const systemPrompt = createSystemPrompt(contentRequest);
    const userPrompt = createUserPrompt(contentRequest);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(data.error?.message || 'Failed to generate content');
    }

    const generatedContent = data.choices[0].message.content;
    console.log('AI content generated successfully');

    // Structure the response
    const structuredContent = {
      id: `ai_${Date.now()}`,
      title: `AI-Generated ${contentRequest.type.replace('_', ' ')}: ${contentRequest.topic}`,
      type: contentRequest.type,
      topic: contentRequest.topic,
      level: contentRequest.level,
      duration: contentRequest.duration || 30,
      content: generatedContent,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: 'gpt-4.1-2025-04-14',
        isAIGenerated: true
      }
    };

    return new Response(JSON.stringify({ content: structuredContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-content-generator function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function createSystemPrompt(request: ContentRequest): string {
  return `You are an expert English language teacher and educational content creator. Create high-quality, engaging educational content that is:

1. Age-appropriate and level-appropriate for ${request.level} students
2. Pedagogically sound with clear learning objectives
3. Interactive and engaging
4. Well-structured and easy to follow
5. Culturally sensitive and inclusive

Content Type: ${request.type}
Level: ${request.level}
Topic: ${request.topic}
${request.duration ? `Duration: ${request.duration} minutes` : ''}

Format your response as structured educational content with clear sections, instructions, and learning objectives.`;
}

function createUserPrompt(request: ContentRequest): string {
  const basePrompt = `Create a ${request.type} about "${request.topic}" for ${request.level} level English learners`;
  
  let specificPrompt = '';
  
  switch (request.type) {
    case 'worksheet':
      specificPrompt = `Include:
- Clear instructions
- 3-5 different exercise types (fill-in-blanks, multiple choice, matching, etc.)
- Answer key
- Learning objectives
- Estimated completion time`;
      break;
    case 'activity':
      specificPrompt = `Include:
- Clear activity instructions
- Materials needed
- Step-by-step procedure
- Learning objectives
- Variations for different skill levels
- Assessment criteria`;
      break;
    case 'lesson_plan':
      specificPrompt = `Include:
- Lesson objectives
- Materials needed
- Warm-up activity (5-10 min)
- Main activities with timing
- Practice exercises
- Wrap-up and assessment
- Homework suggestions`;
      break;
    case 'quiz':
      specificPrompt = `Include:
- 10-15 questions of various types
- Clear instructions
- Answer key with explanations
- Scoring rubric`;
      break;
    case 'flashcards':
      specificPrompt = `Include:
- 15-20 vocabulary cards
- Clear definitions
- Example sentences
- Usage notes`;
      break;
  }

  if (request.specificRequirements) {
    specificPrompt += `\n\nSpecific requirements: ${request.specificRequirements}`;
  }

  if (request.learningObjectives && request.learningObjectives.length > 0) {
    specificPrompt += `\n\nLearning objectives: ${request.learningObjectives.join(', ')}`;
  }

  return `${basePrompt}\n\n${specificPrompt}`;
}
