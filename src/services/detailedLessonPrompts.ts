// Detailed AI prompt templates for rich interactive lesson content

export const DETAILED_LESSON_PROMPT = `
You are an expert ESL curriculum designer creating classroom-ready lessons with COMPLETE, DETAILED content.

Create exactly 22-25 slides with this EXACT distribution:
- 1 Title slide
- 2 Warmup slides (engaging questions with visuals)
- 4 Vocabulary slides (10 total words with FULL details)
- 4 Grammar slides (2 grammar points, each with examples + exercises)
- 3 Listening comprehension slides
- 4-5 Interactive game slides (drag-drop, matching, quizzes)
- 2 Controlled practice slides
- 2 Speaking practice slides (role-play scenarios)
- 1 Review consolidation slide

CRITICAL REQUIREMENTS:
✓ NO PLACEHOLDERS - Every field must have real, complete content
✓ All vocabulary words MUST include: word, IPA pronunciation, part of speech, definition, 3 example sentences, detailed image prompt, related words
✓ All grammar slides MUST include: pattern, rule, 5-6 examples, 4 practice exercises with feedback
✓ All interactive activities MUST include: complete data for games (items, correct answers, feedback)
✓ All image prompts MUST be at least 25 words and highly detailed
✓ All exercises MUST have correct answers and feedback messages

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
  "duration_minutes": 60,
  "slides": [
    // Title Slide
    {
      "id": "slide-1",
      "type": "warmup",
      "prompt": "Engaging lesson title",
      "instructions": "Welcome message and lesson overview",
      "media": {
        "type": "image",
        "imagePrompt": "Colorful, engaging illustration showing the lesson topic, cartoon style, educational, child-friendly, bright colors, clear focal point",
        "alt": "Lesson introduction image"
      }
    },
    
    // Vocabulary Slides (4 slides with detailed words)
    {
      "id": "slide-vocab-1",
      "type": "vocabulary_preview",
      "prompt": "New Vocabulary - Family Members",
      "instructions": "Learn these new words. Click on each card to hear the pronunciation.",
      "words": [
        {
          "word": "mother",
          "pronunciation": "/ˈmʌð.ɚ/",
          "partOfSpeech": "noun",
          "definition": "A woman who has a child",
          "examples": [
            "This is my mother.",
            "My mother cooks delicious food.",
            "I love my mother very much."
          ],
          "imagePrompt": "Warm, friendly cartoon illustration of a smiling mother with her child, wearing casual clothes, bright colors, educational style for children aged 6-10, simple shapes, clear facial features",
          "relatedWords": ["mom", "mama", "parent", "mommy"]
        },
        {
          "word": "father",
          "pronunciation": "/ˈfɑː.ðɚ/",
          "partOfSpeech": "noun",
          "definition": "A man who has a child",
          "examples": [
            "This is my father.",
            "My father goes to work every day.",
            "I help my father wash the car."
          ],
          "imagePrompt": "Friendly cartoon illustration of a father figure with his child, wearing a shirt and casual pants, warm expression, educational style for children, bright colors, simple design",
          "relatedWords": ["dad", "papa", "parent", "daddy"]
        }
      ]
    },
    
    // Grammar Slides (4 slides with exercises)
    {
      "id": "slide-grammar-1",
      "type": "grammar_focus",
      "prompt": "Grammar Focus: This is / These are",
      "instructions": "We use 'This is' for one thing. We use 'These are' for more than one thing.",
      "pattern": "This is + singular / These are + plural",
      "rule": "Use 'This is' when talking about ONE person or thing. Use 'These are' when talking about TWO OR MORE people or things.",
      "examples": [
        {
          "sentence": "This is my book.",
          "highlight": ["This is"],
          "explanation": "One book → This is"
        },
        {
          "sentence": "These are my books.",
          "highlight": ["These are"],
          "explanation": "More than one book → These are"
        },
        {
          "sentence": "This is my mother.",
          "highlight": ["This is"],
          "explanation": "One person → This is"
        },
        {
          "sentence": "These are my parents.",
          "highlight": ["These are"],
          "explanation": "Two people → These are"
        }
      ],
      "exercises": [
        {
          "type": "fill_blank",
          "sentence": "___ my pencil.",
          "options": ["This is", "These are"],
          "correctAnswer": "This is",
          "feedback": "Perfect! 'This is' is correct because we have ONE pencil. Great job! 🎉"
        },
        {
          "type": "fill_blank",
          "sentence": "___ my friends.",
          "options": ["This is", "These are"],
          "correctAnswer": "These are",
          "feedback": "Excellent! 'These are' is correct because we have MORE THAN ONE friend. Well done! ⭐"
        },
        {
          "type": "multiple_choice",
          "question": "Which sentence is CORRECT?",
          "options": [
            "This is my shoes.",
            "These are my shoes.",
            "This are my shoes.",
            "These is my shoes."
          ],
          "correctAnswer": 1,
          "feedback": "Yes! 'These are my shoes' is correct because 'shoes' is plural (more than one). Amazing! 🌟"
        }
      ],
      "imagePrompt": "Educational diagram showing 'This is' with one object (single apple) and 'These are' with multiple objects (three apples), colorful, clear labels, cartoon style, simple illustration for children"
    },
    
    // Interactive Game Slides (5 different activity types)
    {
      "id": "slide-game-1",
      "type": "drag_drop",
      "activityType": "match_words_images",
      "prompt": "Match the Words to the Pictures",
      "instructions": "Drag each word to the correct picture. Listen to the word if you need help!",
      "items": [
        {
          "id": "item-1",
          "text": "mother",
          "audioText": "mother",
          "targetZone": "zone-1"
        },
        {
          "id": "item-2",
          "text": "father",
          "audioText": "father",
          "targetZone": "zone-2"
        },
        {
          "id": "item-3",
          "text": "sister",
          "audioText": "sister",
          "targetZone": "zone-3"
        },
        {
          "id": "item-4",
          "text": "brother",
          "audioText": "brother",
          "targetZone": "zone-4"
        }
      ],
      "zones": [
        {
          "id": "zone-1",
          "imagePrompt": "Cartoon illustration of a mother character, friendly face, warm expression, educational style",
          "acceptsItems": ["item-1"]
        },
        {
          "id": "zone-2",
          "imagePrompt": "Cartoon illustration of a father character, friendly face, casual clothes, educational style",
          "acceptsItems": ["item-2"]
        },
        {
          "id": "zone-3",
          "imagePrompt": "Cartoon illustration of a sister character, young girl, friendly expression, educational style",
          "acceptsItems": ["item-3"]
        },
        {
          "id": "zone-4",
          "imagePrompt": "Cartoon illustration of a brother character, young boy, friendly expression, educational style",
          "acceptsItems": ["item-4"]
        }
      ],
      "correctFeedback": "Fantastic! You matched all the words correctly! 🎉",
      "incorrectFeedback": "Not quite! Try again. Listen to the words if you need help. 🎧"
    },
    {
      "id": "slide-game-2",
      "type": "matching_pairs",
      "activityType": "memory_game",
      "prompt": "Memory Game - Find the Matching Pairs",
      "instructions": "Click on two cards to flip them. Find all the matching pairs!",
      "pairs": [
        {
          "id": "pair-1",
          "card1": { "text": "mother", "type": "word" },
          "card2": { "imagePrompt": "Simple icon of a mother figure", "type": "image" }
        },
        {
          "id": "pair-2",
          "card1": { "text": "father", "type": "word" },
          "card2": { "imagePrompt": "Simple icon of a father figure", "type": "image" }
        },
        {
          "id": "pair-3",
          "card1": { "text": "sister", "type": "word" },
          "card2": { "imagePrompt": "Simple icon of a sister figure", "type": "image" }
        },
        {
          "id": "pair-4",
          "card1": { "text": "brother", "type": "word" },
          "card2": { "imagePrompt": "Simple icon of a brother figure", "type": "image" }
        }
      ],
      "successMessage": "Amazing! You found all the pairs! You're a memory master! 🏆"
    },
    {
      "id": "slide-game-3",
      "type": "multiple_choice_quiz",
      "activityType": "quiz",
      "prompt": "Family Quiz - Test Your Knowledge!",
      "instructions": "Choose the correct answer for each question.",
      "questions": [
        {
          "id": "q1",
          "question": "What do we call a woman who has a child?",
          "options": [
            "Mother",
            "Father",
            "Sister",
            "Brother"
          ],
          "correctAnswer": 0,
          "feedback": "Correct! A mother is a woman who has a child. 🎉"
        },
        {
          "id": "q2",
          "question": "Which sentence is correct?",
          "options": [
            "This are my father.",
            "This is my father.",
            "These is my father.",
            "These are my father."
          ],
          "correctAnswer": 1,
          "feedback": "Yes! 'This is my father' is correct because we use 'This is' for one person. ⭐"
        }
      ]
    },
    {
      "id": "slide-game-4",
      "type": "sentence_builder",
      "activityType": "word_order",
      "prompt": "Build the Sentences",
      "instructions": "Drag the words to make correct sentences.",
      "sentences": [
        {
          "id": "sent-1",
          "words": ["This", "is", "my", "mother"],
          "correctOrder": ["This", "is", "my", "mother"],
          "translation": "This is my mother.",
          "audioText": "This is my mother"
        },
        {
          "id": "sent-2",
          "words": ["These", "are", "my", "parents"],
          "correctOrder": ["These", "are", "my", "parents"],
          "translation": "These are my parents.",
          "audioText": "These are my parents"
        }
      ],
      "successFeedback": "Perfect sentences! You're doing great! 🌟"
    },
    {
      "id": "slide-game-5",
      "type": "listen_and_choose",
      "activityType": "listening_game",
      "prompt": "Listen and Choose",
      "instructions": "Listen to the word and click on the correct picture.",
      "items": [
        {
          "id": "listen-1",
          "audioText": "mother",
          "options": [
            {
              "id": "opt-1",
              "imagePrompt": "Cartoon illustration of a mother",
              "isCorrect": true
            },
            {
              "id": "opt-2",
              "imagePrompt": "Cartoon illustration of a father",
              "isCorrect": false
            },
            {
              "id": "opt-3",
              "imagePrompt": "Cartoon illustration of a sister",
              "isCorrect": false
            }
          ],
          "correctFeedback": "That's right! You heard 'mother' and chose the correct picture! 👏",
          "incorrectFeedback": "Not quite! Listen again and try to find the mother. 🎧"
        }
      ]
    }
  ]
}

IMPORTANT VALIDATION RULES:
1. Every vocabulary word MUST have all 7 fields filled (word, pronunciation, partOfSpeech, definition, examples[3], imagePrompt, relatedWords)
2. Every grammar slide MUST have: pattern, rule, examples[5-6], exercises[4]
3. Every exercise MUST have: type, question/sentence, options, correctAnswer, feedback
4. Every image prompt MUST be minimum 25 words, highly descriptive
5. Every interactive activity MUST have complete game data (no placeholders)
6. All audio text fields must be filled for pronunciation activities

Generate the complete lesson now with ALL fields fully populated.
`;

export function assembleDetailedPrompt(params: {
  topic: string;
  cefrLevel: string;
  moduleNumber: number;
  lessonNumber: number;
  learningObjectives?: string[];
  customRequirements?: string;
}): string {
  return `${DETAILED_LESSON_PROMPT}

LESSON PARAMETERS:
- Topic: ${params.topic}
- CEFR Level: ${params.cefrLevel}
- Module: ${params.moduleNumber}
- Lesson: ${params.lessonNumber}
- Learning Objectives: ${params.learningObjectives?.join(', ') || 'Develop language skills through vocabulary, grammar, and interactive practice'}
${params.customRequirements ? `- Custom Requirements: ${params.customRequirements}` : ''}

Generate 22-25 complete slides following the exact structure and requirements above.`;
}
