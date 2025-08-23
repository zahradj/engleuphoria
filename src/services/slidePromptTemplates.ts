// Master Prompt Template for Slide Generation
export const MASTER_SLIDE_PROMPT_TEMPLATE = `
You are an AI assistant creating professional and engaging lesson slides for ESL students. Generate exactly 20 interactive slides for this lesson.

**LESSON INFORMATION:**
- Title: {lessonTitle}
- Topic: {lessonTopic}
- CEFR Level: {cefrLevel}
- Age Group: {ageGroup}
- Learning Objectives: {learningObjectives}
- Vocabulary Focus: {vocabularyFocus}
- Grammar Focus: {grammarFocus}

**SLIDE STRUCTURE (20 slides total):**
1. **Warm-up (2 slides):** Title slide + engaging starter activity
2. **Vocabulary Preview (3 slides):** Introduction, visual matching, interactive practice
3. **Target Language (3 slides):** Grammar explanation, examples, guided practice
4. **Listening Comprehension (2 slides):** Audio activity + comprehension check
5. **Sentence Builder (2 slides):** Drag-and-drop construction activities
6. **Grammar Focus (3 slides):** Deep dive, transformation exercises, error correction
7. **Speaking Practice (2 slides):** Controlled practice + communicative task
8. **Interactive Games (2 slides):** Matching, quiz, or drag-drop activities
9. **Wrap-up (1 slide):** Review and homework assignment

**CONTENT GUIDELINES:**
- Use simple, kid-friendly language appropriate for {cefrLevel} level
- Include detailed image prompts for visual elements
- Make every slide interactive with clear instructions
- Provide teacher notes for facilitation
- Ensure cultural sensitivity and global inclusivity

**INTERACTIVE ELEMENTS TO INCLUDE:**
- Drag-and-drop activities
- Multiple choice questions
- Matching pairs
- Picture descriptions
- Fill-in-the-blank exercises
- Speaking prompts
- Listen-and-respond activities

**OUTPUT FORMAT:**
Return a valid JSON object with this exact structure:

{
  "version": "2.0",
  "theme": "mist-blue",
  "durationMin": 30,
  "metadata": {
    "CEFR": "{cefrLevel}",
    "module": 1,
    "lesson": 1,
    "targets": ["{learningObjectives}"],
    "weights": {
      "accuracy": 60,
      "fluency": 40
    }
  },
  "slides": [
    {
      "id": "slide-1",
      "type": "warmup",
      "prompt": "Slide title and engaging question or visual",
      "instructions": "Clear instructions for teacher and students",
      "media": {
        "type": "image",
        "imagePrompt": "Detailed description for AI image generation",
        "alt": "Accessibility description"
      },
      "accessibility": {
        "screenReaderText": "Description for screen readers",
        "highContrast": true,
        "largeText": true
      }
    }
  ]
}

**SLIDE TYPES TO USE:**
- warmup, vocabulary_preview, target_language, listening_comprehension
- sentence_builder, grammar_focus, controlled_practice, communicative_task
- match, drag_drop, accuracy_mcq, picture_description, review_consolidation

**IMAGE PROMPT EXAMPLES:**
- "Colorful illustration of children in a classroom raising hands, cartoon style, educational setting"
- "Simple vector icons showing daily activities: eating, sleeping, playing, studying"
- "Friendly cartoon teacher pointing to a whiteboard with grammar examples"

Generate creative, engaging content that makes learning fun and effective!
`;

export const assemblePromptForLesson = (lesson: any): string => {
  return MASTER_SLIDE_PROMPT_TEMPLATE
    .replace(/{lessonTitle}/g, lesson.title || 'Untitled Lesson')
    .replace(/{lessonTopic}/g, lesson.topic || 'General English')
    .replace(/{cefrLevel}/g, lesson.cefr_level || 'A1')
    .replace(/{ageGroup}/g, 'Children (6-12 years)')
    .replace(/{learningObjectives}/g, lesson.learning_objectives?.join(', ') || 'Improve English skills')
    .replace(/{vocabularyFocus}/g, lesson.vocabulary_focus?.join(', ') || 'Basic vocabulary')
    .replace(/{grammarFocus}/g, lesson.grammar_focus?.join(', ') || 'Simple grammar');
};

export const SLIDE_VALIDATION_SCHEMA = {
  type: "object",
  required: ["version", "theme", "durationMin", "metadata", "slides"],
  properties: {
    version: { type: "string", enum: ["2.0"] },
    theme: { type: "string", enum: ["mist-blue", "sage-sand", "default"] },
    durationMin: { type: "number", minimum: 10, maximum: 60 },
    metadata: {
      type: "object",
      required: ["CEFR", "module", "lesson", "targets", "weights"],
      properties: {
        CEFR: { type: "string" },
        module: { type: "number" },
        lesson: { type: "number" },
        targets: { type: "array", items: { type: "string" } },
        weights: {
          type: "object",
          properties: {
            accuracy: { type: "number", minimum: 0, maximum: 100 },
            fluency: { type: "number", minimum: 0, maximum: 100 }
          }
        }
      }
    },
    slides: {
      type: "array",
      minItems: 15,
      maxItems: 25,
      items: {
        type: "object",
        required: ["id", "type", "prompt"],
        properties: {
          id: { type: "string" },
          type: { type: "string" },
          prompt: { type: "string", minLength: 10 },
          instructions: { type: "string" },
          media: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["image", "video", "audio"] },
              imagePrompt: { type: "string" },
              alt: { type: "string" }
            }
          }
        }
      }
    }
  }
};