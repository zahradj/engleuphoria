
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
    
    console.log('AI Content Generation Request:', {
      type: contentRequest.type,
      topic: contentRequest.topic,
      level: contentRequest.level,
      hasApiKey: !!openAIApiKey
    });

    if (!contentRequest.topic || !contentRequest.level || !contentRequest.type) {
      throw new Error('Missing required fields: topic, level, and type are required');
    }

    if (!openAIApiKey) {
      console.log('OpenAI API key not configured, using mock content');
      const mockContent = generateMockContent(contentRequest);
      return new Response(JSON.stringify({ content: mockContent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const model = getOptimalModel(contentRequest.type);
    const maxTokens = getOptimalTokens(contentRequest.type);
    
    const systemPrompt = createSystemPrompt(contentRequest);
    const userPrompt = createUserPrompt(contentRequest);

    console.log('Calling OpenAI with model:', model);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

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

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to generate content');
      }

      const data = await response.json();
      const generatedContent = data.choices[0].message.content;
      
      console.log('AI content generated successfully');

      const structuredContent = {
        id: `ai_${Date.now()}`,
        title: `${contentRequest.type.replace('_', ' ').toUpperCase()}: ${contentRequest.topic}`,
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
    
    // Fallback to mock content on error
    try {
      const contentRequest: ContentRequest = await req.json();
      const mockContent = generateMockContent(contentRequest);
      console.log('Falling back to mock content');
      
      return new Response(JSON.stringify({ content: mockContent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (fallbackError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }
});

function getOptimalModel(contentType: string): string {
  const simpleTypes = ['worksheet', 'quiz', 'flashcards'];
  return simpleTypes.includes(contentType) ? 'gpt-4o-mini' : 'gpt-4o-mini';
}

function getOptimalTokens(contentType: string): number {
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
  return `You are an expert English teacher creating educational content. 

Create engaging, practical ${request.type.replace('_', ' ')} content for ${request.level} level students.

Requirements:
- Topic: ${request.topic}
- Level: ${request.level} 
- Duration: ${request.duration || 30} minutes
- Use clear, simple language appropriate for the level
- Include practical exercises and examples
- Make content engaging and interactive
- Provide clear instructions for teachers/students`;
}

function createUserPrompt(request: ContentRequest): string {
  const prompts = {
    'worksheet': `Create a comprehensive ${request.level} worksheet about "${request.topic}" including:
- 4-5 different exercise types (fill-in-blanks, multiple choice, matching, short answer)
- Clear instructions for each section
- Progressive difficulty within the level
- Answer key at the end
- Estimated completion time: ${request.duration || 30} minutes`,
    
    'quiz': `Create a ${request.level} quiz about "${request.topic}" with:
- 10-12 varied questions (multiple choice, true/false, short answer)
- Questions that test different aspects of the topic
- Clear, unambiguous wording
- Complete answer key with brief explanations
- Suitable for ${request.duration || 20} minute completion`,
    
    'flashcards': `Create 15-20 flashcards about "${request.topic}" for ${request.level} learners:
- Front: Key word, phrase, or question
- Back: Definition, translation, or answer with example sentence
- Include pronunciation guides where helpful
- Cover essential vocabulary and concepts
- Organize from basic to more advanced within the level`,
    
    'activity': `Create an interactive ${request.level} classroom activity about "${request.topic}":
- Clear learning objectives
- Step-by-step instructions for the teacher
- Materials needed (if any)
- Student interaction guidelines
- Duration: ${request.duration || 30} minutes
- Assessment/wrap-up suggestions`,
    
    'lesson_plan': `Create a complete ${request.duration || 60}-minute lesson plan about "${request.topic}" for ${request.level} students:
- Learning objectives (what students will achieve)
- Warm-up activity (5-10 minutes)
- Main teaching phase with activities (30-40 minutes)
- Practice exercises (10-15 minutes)
- Wrap-up and assessment (5 minutes)
- Required materials and resources
- Homework assignment suggestions`
  };

  let prompt = prompts[request.type] || `Create ${request.type} content about "${request.topic}" for ${request.level} learners.`;
  
  if (request.specificRequirements) {
    prompt += `\n\nSpecific requirements: ${request.specificRequirements}`;
  }

  if (request.learningObjectives && request.learningObjectives.length > 0) {
    prompt += `\n\nLearning objectives to address: ${request.learningObjectives.join(', ')}`;
  }

  return prompt;
}

function generateMockContent(request: ContentRequest) {
  const mockContent = {
    id: `mock_${Date.now()}`,
    title: `${request.type.replace('_', ' ').toUpperCase()}: ${request.topic}`,
    type: request.type,
    topic: request.topic,
    level: request.level,
    duration: request.duration || 30,
    content: getMockContentByType(request),
    metadata: {
      generatedAt: new Date().toISOString(),
      model: 'mock',
      isAIGenerated: false,
      generationTime: Date.now()
    }
  };
  
  return mockContent;
}

function getMockContentByType(request: ContentRequest): string {
  const { type, topic, level } = request;
  
  switch (type) {
    case 'worksheet':
      return `# ${topic.toUpperCase()} WORKSHEET (${level.toUpperCase()} LEVEL)

## Exercise 1: Vocabulary Matching
Match the words with their meanings:
1. ${topic}-related word 1 → Definition A
2. ${topic}-related word 2 → Definition B
3. ${topic}-related word 3 → Definition C

## Exercise 2: Fill in the Blanks
Complete the sentences about ${topic}:
1. The _______ is very important for ${topic}.
2. Students learn about _______ in their ${topic} classes.
3. _______ helps us understand ${topic} better.

## Exercise 3: Multiple Choice
Choose the correct answer:
1. What is the most important aspect of ${topic}?
   a) Option A  b) Option B  c) Option C  d) Option D

## Answer Key
Exercise 1: 1-A, 2-B, 3-C
Exercise 2: 1-topic, 2-concepts, 3-practice
Exercise 3: 1-b

*Generated for ${level} level students*`;

    case 'activity':
      return `# INTERACTIVE ACTIVITY: ${topic.toUpperCase()}

## Learning Objectives
- Students will understand key concepts about ${topic}
- Students will practice ${topic}-related vocabulary
- Students will engage in meaningful conversation about ${topic}

## Materials Needed
- Whiteboard/flipchart
- ${topic} vocabulary cards
- Timer

## Activity Steps (${request.duration || 30} minutes)

### Warm-up (5 minutes)
- Quick brainstorm about ${topic}
- Students share what they already know

### Main Activity (20 minutes)
- Divide class into teams
- ${topic} vocabulary game
- Role-play scenarios related to ${topic}

### Wrap-up (5 minutes)
- Teams share their favorite new words
- Quick review of key concepts

## Assessment
- Observe student participation
- Check understanding through Q&A
- Note vocabulary usage

*Designed for ${level} level students*`;

    case 'lesson_plan':
      return `# LESSON PLAN: ${topic.toUpperCase()}
**Level:** ${level.toUpperCase()} | **Duration:** ${request.duration || 60} minutes

## Learning Objectives
By the end of this lesson, students will be able to:
- Identify key vocabulary related to ${topic}
- Use ${topic} concepts in conversation
- Apply ${topic} knowledge in practical situations

## Lesson Structure

### Opening (10 minutes)
- Welcome and review previous lesson
- Introduce today's topic: ${topic}
- Activate prior knowledge

### Presentation (15 minutes)
- Introduce new ${topic} vocabulary
- Explain key concepts with examples
- Visual aids and demonstrations

### Practice (20 minutes)
- Controlled practice activities
- Pair work with ${topic} dialogues
- Group exercises and games

### Production (10 minutes)
- Free practice activities
- Students create their own ${topic} scenarios
- Peer feedback and sharing

### Wrap-up (5 minutes)
- Summary of key points
- Preview next lesson
- Assign homework

## Materials
- ${topic} vocabulary flashcards
- Audio/video materials
- Worksheets and handouts

## Homework
Complete exercises 1-3 on ${topic} (workbook pages TBD)

*Adapted for ${level} level learners*`;

    case 'quiz':
      return `# ${topic.toUpperCase()} QUIZ (${level.toUpperCase()} LEVEL)

## Instructions
Answer all questions. Time limit: ${request.duration || 20} minutes.

## Questions

### Multiple Choice (5 points each)
1. Which of the following best describes ${topic}?
   a) Option A  b) Option B  c) Option C  d) Option D

2. What is most important when learning about ${topic}?
   a) Memorization  b) Practice  c) Understanding  d) All of the above

### True or False (3 points each)
3. ${topic} is essential for language learning. (T/F)
4. Students should avoid practicing ${topic} daily. (T/F)

### Short Answer (10 points each)
5. Explain why ${topic} is important for ${level} students.
6. Give an example of how you would use ${topic} in daily life.

## Answer Key
1. c  2. d  3. T  4. F
5. Sample answer: ${topic} is important because...
6. Sample answer: I would use ${topic} when...

**Total: 40 points**`;

    case 'flashcards':
      return `# ${topic.toUpperCase()} FLASHCARDS (${level.toUpperCase()} LEVEL)

## Card Set: Essential ${topic} Vocabulary

**Card 1**
Front: Key ${topic} term 1
Back: Definition and example sentence for ${level} learners

**Card 2** 
Front: Key ${topic} term 2
Back: Clear explanation with practical usage

**Card 3**
Front: Key ${topic} term 3  
Back: Simple definition + pronunciation guide

**Card 4**
Front: Important ${topic} phrase 1
Back: Meaning and context for use

**Card 5**
Front: Important ${topic} phrase 2
Back: Translation and example dialogue

**Card 6**
Front: ${topic} concept 1
Back: Explanation suitable for ${level} level

**Card 7**
Front: ${topic} concept 2
Back: Clear definition with visual cue suggestion

**Card 8**
Front: Common ${topic} expression
Back: When and how to use this expression

## Study Tips
- Review cards daily for best retention
- Practice using new words in sentences
- Test yourself regularly

*Optimized for ${level} level vocabulary building*`;

    default:
      return `# ${type.toUpperCase()}: ${topic.toUpperCase()}

Custom ${type} content about ${topic} for ${level} level students.

This would include:
- Relevant vocabulary and concepts
- Age-appropriate explanations
- Interactive elements
- Clear learning objectives
- Practice opportunities

*Generated content for ${level} level learners*`;
  }
}
