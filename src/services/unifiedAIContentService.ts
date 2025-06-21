
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface AIContentRequest {
  type: 'worksheet' | 'activity' | 'lesson_plan' | 'quiz' | 'flashcards';
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  specificRequirements?: string;
  studentAge?: string;
  learningObjectives?: string[];
}

export interface AIGeneratedContent {
  id: string;
  title: string;
  type: string;
  topic: string;
  level: string;
  duration: number;
  content: string;
  metadata: {
    generatedAt: string;
    model?: string;
    isAIGenerated: boolean;
    isMockData?: boolean;
  };
}

export interface ContentLibraryItem extends AIGeneratedContent {
  downloads?: number;
  rating?: number;
  tags?: string[];
  isPublic?: boolean;
  createdBy?: string;
}

class UnifiedAIContentService {
  private contentLibrary: ContentLibraryItem[] = [];
  private isDemoMode: boolean;

  constructor() {
    this.isDemoMode = !isSupabaseConfigured();
    this.loadStoredContent();
  }

  async generateContent(request: AIContentRequest): Promise<AIGeneratedContent> {
    if (this.isDemoMode) {
      return this.generateMockContent(request);
    }

    try {
      const { data, error } = await supabase.functions.invoke('ai-content-generator', {
        body: request
      });

      if (error) {
        console.error('AI generation error:', error);
        throw new Error(error.message || 'Failed to generate content');
      }

      const generatedContent = data.content;
      this.addToLibrary(generatedContent);
      return generatedContent;
    } catch (error) {
      console.error('Failed to generate AI content, falling back to mock:', error);
      return this.generateMockContent(request);
    }
  }

  private generateMockContent(request: AIContentRequest): AIGeneratedContent {
    const mockContent = this.createEnhancedMockContent(request);
    const generatedContent: AIGeneratedContent = {
      id: `mock_${Date.now()}`,
      title: `${request.type.charAt(0).toUpperCase() + request.type.slice(1).replace('_', ' ')}: ${request.topic}`,
      type: request.type,
      topic: request.topic,
      level: request.level,
      duration: request.duration || 30,
      content: mockContent,
      metadata: {
        generatedAt: new Date().toISOString(),
        isAIGenerated: true,
        isMockData: true
      }
    };

    this.addToLibrary(generatedContent);
    return generatedContent;
  }

  private createEnhancedMockContent(request: AIContentRequest): string {
    const { type, topic, level } = request;
    const levelText = level.charAt(0).toUpperCase() + level.slice(1);

    switch (type) {
      case 'worksheet':
        return this.generateWorksheetContent(topic, level);
      case 'activity':
        return this.generateActivityContent(topic, level);
      case 'lesson_plan':
        return this.generateLessonPlanContent(topic, level);
      case 'quiz':
        return this.generateQuizContent(topic, level);
      case 'flashcards':
        return this.generateFlashcardsContent(topic, level);
      default:
        return `# ${levelText} Level Content: ${topic}\n\nThis is enhanced mock content for ${topic} at ${level} level.`;
    }
  }

  private generateWorksheetContent(topic: string, level: string): string {
    const exercises = this.getTopicExercises(topic, level);
    
    return `# ${topic} Worksheet - ${level.charAt(0).toUpperCase() + level.slice(1)} Level

## Learning Objectives
By the end of this worksheet, students will be able to:
- Use vocabulary related to ${topic}
- Apply grammar structures in context
- Demonstrate understanding through various exercises

## Exercise 1: Fill in the Blanks
Complete the sentences with the correct words about ${topic}:

${exercises.fillInTheBlanks.map((item, index) => `${index + 1}. ${item}`).join('\n')}

## Exercise 2: Multiple Choice
Choose the best answer:

${exercises.multipleChoice.map((item, index) => `${index + 1}. ${item.question}\n   a) ${item.options[0]}\n   b) ${item.options[1]}\n   c) ${item.options[2]}\n   d) ${item.options[3]}`).join('\n\n')}

## Exercise 3: Matching
Match the words with their definitions:

${exercises.matching.map((item, index) => `${index + 1}. ${item.word} - ${item.definition}`).join('\n')}

## Answer Key
[Answers would be provided here]

---
*Estimated completion time: 20-30 minutes*`;
  }

  private generateActivityContent(topic: string, level: string): string {
    return `# Interactive Activity: ${topic} (${level.charAt(0).toUpperCase() + level.slice(1)} Level)

## Activity Overview
Engaging interactive activity to practice ${topic} through speaking, listening, and collaborative exercises.

## Materials Needed
- Whiteboard or flip chart
- Index cards
- Timer
- Audio equipment (optional)

## Procedure

### Warm-up (5 minutes)
1. Quick brainstorming about ${topic}
2. Students share one word related to ${topic}

### Main Activity (20 minutes)
1. **Vocabulary Introduction** (5 min)
   - Present key ${topic} vocabulary
   - Practice pronunciation

2. **Interactive Practice** (10 min)
   - Role-play scenarios involving ${topic}
   - Pair and group work activities

3. **Application** (5 min)
   - Real-world application exercises
   - Creative expression activities

### Wrap-up (5 minutes)
1. Review key learning points
2. Quick assessment activity
3. Preview next lesson

## Assessment
- Participation in activities
- Correct use of vocabulary
- Engagement level

## Variations
- For lower levels: Provide more visual support
- For higher levels: Add complexity and discussion elements

---
*Total time: 30 minutes*`;
  }

  private generateLessonPlanContent(topic: string, level: string): string {
    return `# Lesson Plan: ${topic} (${level.charAt(0).toUpperCase() + level.slice(1)} Level)

## Lesson Objectives
Students will be able to:
1. Use ${topic}-related vocabulary accurately
2. Understand and apply relevant grammar structures
3. Engage in meaningful communication about ${topic}

## Materials
- Textbook pages related to ${topic}
- Visual aids and flashcards
- Audio/video resources
- Handouts and worksheets

## Lesson Structure (60 minutes)

### 1. Warm-up and Review (10 minutes)
- Greet students and check attendance
- Quick review of previous lesson
- Introduce today's topic: ${topic}

### 2. Presentation (15 minutes)
- Introduce key vocabulary
- Present grammar structures
- Provide examples and explanations
- Check understanding

### 3. Practice (20 minutes)
- Controlled practice exercises
- Guided practice activities
- Error correction and feedback

### 4. Production (10 minutes)
- Freer practice activities
- Role-plays or discussions
- Creative tasks

### 5. Wrap-up and Homework (5 minutes)
- Summarize key points
- Assign homework related to ${topic}
- Preview next lesson

## Assessment
- Formative assessment during activities
- Check understanding through questioning
- Monitor student participation

## Homework
Complete exercises 1-5 on page [X] about ${topic}

## Notes for Teacher
- Prepare extra activities for fast finishers
- Have additional support ready for struggling students
- Consider cultural sensitivity when discussing ${topic}

---
*This lesson plan is adaptable based on class needs and time constraints.*`;
  }

  private generateQuizContent(topic: string, level: string): string {
    const questions = this.getTopicQuestions(topic, level);
    
    return `# ${topic} Quiz - ${level.charAt(0).toUpperCase() + level.slice(1)} Level

## Instructions
- Read each question carefully
- Choose the best answer for multiple choice questions
- Write complete answers for short answer questions
- Total time: 20 minutes

## Part A: Multiple Choice (5 points each)

${questions.multipleChoice.map((q, index) => 
  `${index + 1}. ${q.question}\n   a) ${q.options[0]}\n   b) ${q.options[1]}\n   c) ${q.options[2]}\n   d) ${q.options[3]}\n`
).join('\n')}

## Part B: Fill in the Blanks (3 points each)

${questions.fillInBlanks.map((q, index) => `${index + 1}. ${q}`).join('\n')}

## Part C: Short Answer (10 points each)

${questions.shortAnswer.map((q, index) => `${index + 1}. ${q}`).join('\n')}

## Scoring
- Multiple Choice: 25 points
- Fill in the Blanks: 15 points  
- Short Answer: 20 points
- **Total: 60 points**

## Answer Key
[Complete answer key would be provided separately]

---
*Good luck!*`;
  }

  private generateFlashcardsContent(topic: string, level: string): string {
    const vocabulary = this.getTopicVocabulary(topic, level);
    
    return `# ${topic} Flashcards - ${level.charAt(0).toUpperCase() + level.slice(1)} Level

## How to Use These Flashcards
1. Read the word/phrase on the front
2. Try to recall the definition
3. Check the back for the answer
4. Practice pronunciation
5. Use in sentences

## Vocabulary Cards

${vocabulary.map((item, index) => 
  `### Card ${index + 1}
**Front:** ${item.word}
**Back:** ${item.definition}
**Example:** ${item.example}
**Pronunciation:** ${item.pronunciation || 'N/A'}
---`
).join('\n\n')}

## Study Tips
- Review cards daily for best retention
- Practice using words in sentences
- Group similar words together
- Test yourself regularly

## Additional Activities
- Create your own sentences using these words
- Draw pictures to represent the vocabulary
- Practice with a partner
- Use words in conversation

---
*Review these cards regularly for best results!*`;
  }

  private getTopicExercises(topic: string, level: string) {
    const exercises = {
      animals: {
        fillInTheBlanks: [
          "The _____ has a long trunk. (elephant)",
          "Birds use their _____ to fly. (wings)",
          "A _____ lives in the ocean and is very big. (whale)"
        ],
        multipleChoice: [
          {
            question: "Which animal gives us milk?",
            options: ["Dog", "Cow", "Cat", "Horse"]
          },
          {
            question: "What sound does a cat make?",
            options: ["Bark", "Moo", "Meow", "Chirp"]
          }
        ],
        matching: [
          { word: "Dog", definition: "A pet that barks" },
          { word: "Fish", definition: "Lives in water" },
          { word: "Bird", definition: "Can fly in the sky" }
        ]
      },
      food: {
        fillInTheBlanks: [
          "I eat _____ for breakfast. (cereal)",
          "_____ is a red fruit. (apple)",
          "We drink _____ when we're thirsty. (water)"
        ],
        multipleChoice: [
          {
            question: "Which is a vegetable?",
            options: ["Apple", "Carrot", "Cake", "Ice cream"]
          },
          {
            question: "What do we use to eat soup?",
            options: ["Fork", "Spoon", "Knife", "Hands"]
          }
        ],
        matching: [
          { word: "Breakfast", definition: "First meal of the day" },
          { word: "Lunch", definition: "Meal at midday" },
          { word: "Dinner", definition: "Evening meal" }
        ]
      }
    };

    return exercises[topic.toLowerCase()] || {
      fillInTheBlanks: [
        `The ${topic} is very important in our daily life.`,
        `People often use ${topic} for different purposes.`,
        `Learning about ${topic} helps us understand the world better.`
      ],
      multipleChoice: [
        {
          question: `What is most important about ${topic}?`,
          options: ["Option A", "Option B", "Option C", "Option D"]
        }
      ],
      matching: [
        { word: "Basic", definition: "Simple and fundamental" },
        { word: "Important", definition: "Having great value" },
        { word: "Useful", definition: "Helpful and practical" }
      ]
    };
  }

  private getTopicQuestions(topic: string, level: string) {
    return {
      multipleChoice: [
        {
          question: `What is the main purpose of learning about ${topic}?`,
          options: ["Entertainment", "Education", "Exercise", "All of the above"]
        },
        {
          question: `Which word is most related to ${topic}?`,
          options: ["Important", "Difficult", "Expensive", "Colorful"]
        }
      ],
      fillInBlanks: [
        `${topic} is very _____ in our daily life.`,
        `Students should learn about _____ to improve their knowledge.`,
        `The teacher explained _____ clearly to the class.`
      ],
      shortAnswer: [
        `Explain why ${topic} is important.`,
        `Give an example of how you use ${topic} in your life.`,
        `What did you learn about ${topic} today?`
      ]
    };
  }

  private getTopicVocabulary(topic: string, level: string) {
    const vocabularySets = {
      animals: [
        { word: "Dog", definition: "A domestic animal that barks", example: "My dog likes to play fetch." },
        { word: "Cat", definition: "A small pet that meows", example: "The cat is sleeping on the sofa." },
        { word: "Bird", definition: "An animal that can fly", example: "I saw a beautiful bird in the garden." },
        { word: "Fish", definition: "An animal that lives in water", example: "We keep fish in an aquarium." },
        { word: "Elephant", definition: "A large animal with a trunk", example: "The elephant is the biggest land animal." }
      ],
      food: [
        { word: "Apple", definition: "A red or green fruit", example: "I eat an apple every day." },
        { word: "Bread", definition: "Food made from wheat", example: "We buy fresh bread from the bakery." },
        { word: "Milk", definition: "White liquid from cows", example: "Children drink milk to grow strong." },
        { word: "Vegetable", definition: "Healthy plant food", example: "Carrots are my favorite vegetable." },
        { word: "Water", definition: "Clear liquid we drink", example: "Drink water to stay healthy." }
      ]
    };

    return vocabularySets[topic.toLowerCase()] || [
      { word: "Basic", definition: "Simple and fundamental", example: `This is a basic example of ${topic}.` },
      { word: "Important", definition: "Having great value", example: `${topic} is important to learn.` },
      { word: "Useful", definition: "Helpful and practical", example: `This information about ${topic} is useful.` },
      { word: "Interesting", definition: "Engaging and fascinating", example: `I find ${topic} very interesting.` },
      { word: "Educational", definition: "Related to learning", example: `This ${topic} lesson is educational.` }
    ];
  }

  private addToLibrary(content: AIGeneratedContent) {
    const libraryItem: ContentLibraryItem = {
      ...content,
      downloads: 0,
      rating: 0,
      tags: [content.topic, content.level, content.type],
      isPublic: false,
      createdBy: 'ai'
    };

    this.contentLibrary.unshift(libraryItem);
    this.saveContentLibrary();
  }

  getContentLibrary(): ContentLibraryItem[] {
    return this.contentLibrary;
  }

  clearLibrary() {
    this.contentLibrary = [];
    this.saveContentLibrary();
  }

  exportContent(content: ContentLibraryItem): string {
    const dataStr = JSON.stringify(content, null, 2);
    return dataStr;
  }

  private loadStoredContent() {
    if (this.isDemoMode) {
      try {
        const stored = localStorage.getItem('ai_content_library');
        if (stored) {
          this.contentLibrary = JSON.parse(stored);
        }
      } catch (error) {
        console.error('Failed to load stored content:', error);
      }
    }
  }

  private saveContentLibrary() {
    if (this.isDemoMode) {
      try {
        localStorage.setItem('ai_content_library', JSON.stringify(this.contentLibrary));
      } catch (error) {
        console.error('Failed to save content library:', error);
      }
    }
  }

  isDemoModeActive(): boolean {
    return this.isDemoMode;
  }
}

export const unifiedAIContentService = new UnifiedAIContentService();
