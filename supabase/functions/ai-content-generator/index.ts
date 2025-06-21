
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

    // Optimize model selection based on content type
    const model = getOptimalModel(contentRequest.type);
    const maxTokens = getOptimalTokens(contentRequest.type);
    
    const systemPrompt = createSystemPrompt(contentRequest);
    const userPrompt = createUserPrompt(contentRequest);

    // Add timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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
          model,
          isAIGenerated: true,
          generationTime: Date.now()
        }
      };

      return new Response(JSON.stringify({ content: structuredContent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Generation timed out. Please try again with a simpler request.');
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in ai-content-generator function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getOptimalModel(contentType: string): string {
  // Use faster model for simple content types
  const simpleTypes = ['worksheet', 'quiz', 'flashcards'];
  return simpleTypes.includes(contentType) ? 'gpt-4o-mini' : 'gpt-4.1-2025-04-14';
}

function getOptimalTokens(contentType: string): number {
  // Optimize token usage based on content type
  const tokenLimits = {
    'flashcards': 800,
    'quiz': 1000,
    'worksheet': 1200,
    'activity': 1500,
    'lesson_plan': 2000
  };
  return tokenLimits[contentType] || 1500;
}

function createSystemPrompt(request: ContentRequest): string {
  // Simplified, more focused system prompt
  const basePrompt = `You are an expert English teacher. Create concise, engaging ${request.type} content.

Requirements:
- Level: ${request.level}
- Topic: ${request.topic}
- Duration: ${request.duration || 30} minutes
- Be concise and practical
- Use clear, simple language
- Include only essential elements`;

  return basePrompt;
}

function createUserPrompt(request: ContentRequest): string {
  const prompts = {
    'worksheet': `Create a ${request.level} worksheet about "${request.topic}" with:
- 3-4 exercise types (fill-in-blanks, multiple choice, matching)
- Clear instructions
- Answer key`,
    
    'quiz': `Create a ${request.level} quiz about "${request.topic}" with:
- 8-10 questions (multiple choice, short answer)
- Answer key with brief explanations`,
    
    'flashcards': `Create 12-15 flashcards about "${request.topic}" for ${request.level} learners:
- Word/phrase on front
- Definition and example on back`,
    
    'activity': `Create an interactive ${request.level} activity about "${request.topic}" with:
- Clear instructions
- Materials needed
- Step-by-step procedure`,
    
    'lesson_plan': `Create a ${request.duration || 60}-minute lesson plan about "${request.topic}" for ${request.level} learners:
- Learning objectives
- Warm-up, main activities, wrap-up
- Materials needed
- Assessment`
  };

  let prompt = prompts[request.type] || `Create ${request.type} content about "${request.topic}" for ${request.level} learners.`;
  
  if (request.specificRequirements) {
    prompt += `\n\nSpecific requirements: ${request.specificRequirements}`;
  }

  return prompt;
}
