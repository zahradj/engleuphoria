// Detailed AI prompt templates for NovaKid-style interactive lesson content

export const DETAILED_LESSON_PROMPT = `
You are an expert ESL curriculum designer creating NovaKid-style professional lessons with COMPLETE, DETAILED content.

CHARACTER CONSISTENCY:
Use these character names consistently throughout the lesson: Otis, Alice, Max, Lily, Marco, Ruby, Philip, Ann, Mark, Jacob

SLIDE STRUCTURE - Generate exactly 15-18 slides with this distribution:

1. Title Slide (1 slide)
2. Warmup Discussion (1 slide) - 3-4 open-ended questions with emoji reactions
3. Vocabulary Introduction (2 slides) - 8-12 words with images and emoji reactions
4. Vocabulary Games (2-3 slides):
   - Speed challenge ("How fast can you name them all?")
   - Sorting activity (categorize items)
   - Speaking practice
5. Grammar Introduction (1 slide) - Visual explanation with real examples
6. Grammar Practice (2-3 slides):
   - Fill-in-the-blank exercises
   - Sentence builder
7. Interactive Game (1-2 slides):
   - Spinning wheel activity
   - Story builder
   - Grid selection
8. Speaking Practice (1 slide) - Scaffolded prompts with character examples
9. Review (1 slide) - Mixed exercises

CRITICAL REQUIREMENTS:
- Use character names (Otis, Alice, Max, Lily, Marco, Ruby, Philip, Ann, Mark, Jacob) consistently
- Include real-world references appropriate to the topic and age group
- All vocabulary words MUST have imagePrompts AND emoji reactions (😊😱😴🤩😂😨)
- All speaking activities MUST have audioTexts
- Spinning wheel slides MUST include wheelSegments array with 6-8 segments
- Sorting slides MUST include items array and categories array
- All interactive activities MUST have complete game data
- Total word count across all prompts: 600-900 words
- Each slide prompt should be 40-70 words

Return ONLY valid JSON with this structure:

{
  "title": "Lesson title",
  "topic": "Topic name",
  "cefr_level": "A1/A2/B1/B2/C1/C2",
  "module_number": 1,
  "lesson_number": 1,
  "learning_objectives": ["objective 1", "objective 2", "objective 3"],
  "vocabulary_focus": ["word1", "word2", "word3"],
  "grammar_focus": ["grammar point 1", "grammar point 2"],
  "duration_minutes": 30,
  "slides": [
    // Title Slide
    {
      "id": "slide-1",
      "type": "warmup",
      "prompt": "Welcome to [Topic]!",
      "instructions": "Today we'll learn about [topic]. Get ready for fun!",
      "imagePrompt": "Colorful, engaging illustration showing the lesson topic, cartoon style, educational, child-friendly, bright colors"
    },
    
    // Warmup Discussion Slide
    {
      "id": "slide-2",
      "type": "warmup",
      "prompt": "Let's Talk About [Topic]!",
      "instructions": "Look at the pictures and answer the questions.",
      "questions": [
        "What do you see in the picture? 🤔",
        "Do you like [topic]? Why? 😊",
        "Tell me about your favorite [related item]! 🌟",
        "Have you ever [related experience]? 🎉"
      ],
      "imagePrompt": "Bright, colorful illustration related to the topic with multiple elements to discuss"
    },
    
    // Vocabulary Slides (2 slides with 4-6 words each)
    {
      "id": "slide-vocab-1",
      "type": "vocabulary",
      "prompt": "New Words - Part 1",
      "instructions": "Let's learn some new words! Click each word to hear it.",
      "words": [
        {
          "word": "example",
          "pronunciation": "/ɪɡˈzæm.pəl/",
          "definition": "Short, simple definition",
          "example": "Max likes to eat apples. 🍎",
          "imagePrompt": "Clear, simple illustration of the word concept, cartoon style, bright colors",
          "emoji": "😊"
        }
      ]
    },
    
    // Sorting Activity
    {
      "id": "slide-sort-1",
      "type": "sorting",
      "prompt": "Sort the Items!",
      "instructions": "Drag each item to the correct box. Which category does it belong to?",
      "categories": [
        { "id": "cat-1", "name": "Category 1", "color": "#FF6B6B" },
        { "id": "cat-2", "name": "Category 2", "color": "#4ECDC4" }
      ],
      "items": [
        { "id": "item-1", "text": "apple", "category": "cat-1", "emoji": "🍎" },
        { "id": "item-2", "text": "carrot", "category": "cat-2", "emoji": "🥕" }
      ]
    },
    
    // Spinning Wheel Activity
    {
      "id": "slide-wheel-1",
      "type": "spinning_wheel",
      "prompt": "Spin the Wheel!",
      "instructions": "Click the button to spin! Answer the question you land on.",
      "wheelSegments": [
        { "id": "seg-1", "text": "What's your favorite food?", "color": "#FF6B6B" },
        { "id": "seg-2", "text": "Describe Lily's pet", "color": "#4ECDC4" },
        { "id": "seg-3", "text": "Tell us about Max's family", "color": "#45B7D1" },
        { "id": "seg-4", "text": "What does Alice like to do?", "color": "#96CEB4" },
        { "id": "seg-5", "text": "Where does Otis live?", "color": "#FFEAA7" },
        { "id": "seg-6", "text": "What's Ruby's favorite color?", "color": "#DDA0DD" }
      ]
    },
    
    // Grammar Introduction
    {
      "id": "slide-grammar-1",
      "type": "grammar",
      "prompt": "Grammar: [Pattern Name]",
      "instructions": "Learn this important grammar pattern!",
      "pattern": "Subject + verb + object",
      "rule": "Clear, simple explanation of the grammar rule",
      "examples": [
        { "sentence": "Otis likes apples.", "highlight": ["likes"], "translation": "Translation if needed" },
        { "sentence": "Alice plays soccer.", "highlight": ["plays"] }
      ],
      "exercises": [
        {
          "type": "fill_blank",
          "sentence": "Max ___ pizza.",
          "options": ["like", "likes"],
          "correctAnswer": "likes",
          "feedback": "Great job! 'Likes' is correct! 🎉"
        }
      ]
    },
    
    // Speaking Practice
    {
      "id": "slide-speaking-1",
      "type": "interactive",
      "activityType": "speaking",
      "prompt": "Let's Practice Speaking!",
      "instructions": "Use these prompts to practice speaking. Record yourself!",
      "prompts": [
        {
          "text": "Tell me about Lily's favorite food.",
          "example": "Lily likes pizza. She eats it every Friday with her family.",
          "audioText": "Tell me about Lily's favorite food"
        }
      ]
    }
  ]
}

IMPORTANT VALIDATION RULES:
1. Every vocabulary word MUST have: word, pronunciation, definition, example, imagePrompt, emoji
2. Every grammar slide MUST have: pattern, rule, examples[3-4], exercises[2-3]
3. Sorting activities MUST have: categories array, items array with correct category assignments
4. Spinning wheel activities MUST have: wheelSegments array with 6-8 segments, each with id, text, color
5. All character examples must use the consistent names: Otis, Alice, Max, Lily, Marco, Ruby, Philip, Ann, Mark, Jacob
6. Include real-world references (actual movie titles, restaurant names, brands) when appropriate
7. All image prompts MUST be at least 20 words

Generate the complete lesson now with ALL fields fully populated.
`;

export function assembleDetailedPrompt(params: {
  topic: string;
  cefrLevel: string;
  moduleNumber: number;
  lessonNumber: number;
  ageGroup: string;
  learningObjectives?: string[];
  customRequirements?: string;
}): string {
  return `${DETAILED_LESSON_PROMPT}

LESSON PARAMETERS:
- Topic: ${params.topic}
- CEFR Level: ${params.cefrLevel}
- Age Group: ${params.ageGroup}
- Module: ${params.moduleNumber}
- Lesson: ${params.lessonNumber}
- Learning Objectives: ${params.learningObjectives?.join(', ') || 'Develop language skills through vocabulary, grammar, and interactive practice'}
${params.customRequirements ? `- Custom Requirements: ${params.customRequirements}` : ''}

Generate 15-18 complete NovaKid-style slides following the exact structure and requirements above. Remember to use character names consistently and include real-world references!`;
}
