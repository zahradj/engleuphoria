import { LessonSlides, Slide } from '@/types/slides';
import { generateLessonFromTemplate, LessonTemplateConfig } from './lessonTemplateGenerator';
import { supabase } from '@/integrations/supabase/client';

export interface PreStarterProgram {
  id: string;
  title: string;
  description: string;
  modules: PreStarterModule[];
  totalLessons: number;
  estimatedWeeks: number;
}

export interface PreStarterModule {
  moduleNumber: number;
  title: string;
  description: string;
  lessons: PreStarterLesson[];
}

export interface PreStarterLesson {
  lessonNumber: number;
  title: string;
  topic: string;
  vocabularyFocus: string[];
  skills: string[];
  duration: number;
}

/**
 * Pre-Starters Program 1: "Hello Adventures"
 * First comprehensive program for very young learners (ages 3-5)
 */
export function createPreStartersProgram1(): PreStarterProgram {
  return {
    id: 'pre-starters-program-1',
    title: 'Hello Adventures - Pre-Starters Program 1',
    description: 'First steps in English for very young learners. Fun, interactive lessons with songs, games, and activities.',
    estimatedWeeks: 12,
    totalLessons: 24,
    modules: [
      {
        moduleNumber: 1,
        title: 'Hello and Me',
        description: 'Basic greetings, introductions, and personal information',
        lessons: [
          {
            lessonNumber: 1,
            title: 'Hello Song Adventures',
            topic: 'greetings',
            vocabularyFocus: ['hello', 'hi', 'bye', 'goodbye', 'good morning'],
            skills: ['listening', 'speaking', 'movement'],
            duration: 20
          },
          {
            lessonNumber: 2,
            title: 'My Name Magic',
            topic: 'names and introductions',
            vocabularyFocus: ['my name is', 'what is your name', 'I am', 'you are'],
            skills: ['speaking', 'listening', 'social interaction'],
            duration: 20
          },
          {
            lessonNumber: 3,
            title: 'Happy Faces',
            topic: 'emotions and feelings',
            vocabularyFocus: ['happy', 'sad', 'angry', 'tired', 'excited'],
            skills: ['vocabulary', 'expression', 'recognition'],
            duration: 20
          },
          {
            lessonNumber: 4,
            title: 'Body Dance Party',
            topic: 'body parts',
            vocabularyFocus: ['head', 'shoulders', 'knees', 'toes', 'hands', 'feet'],
            skills: ['listening', 'movement', 'coordination'],
            duration: 20
          },
          {
            lessonNumber: 5,
            title: 'Rainbow Colors',
            topic: 'colors',
            vocabularyFocus: ['red', 'blue', 'yellow', 'green', 'orange', 'purple'],
            skills: ['recognition', 'naming', 'creativity'],
            duration: 20
          },
          {
            lessonNumber: 6,
            title: 'Count with Me',
            topic: 'numbers 1-5',
            vocabularyFocus: ['one', 'two', 'three', 'four', 'five'],
            skills: ['counting', 'recognition', 'sequencing'],
            duration: 20
          }
        ]
      },
      {
        moduleNumber: 2,
        title: 'My World',
        description: 'Family, home, and everyday objects',
        lessons: [
          {
            lessonNumber: 7,
            title: 'My Family Tree',
            topic: 'family members',
            vocabularyFocus: ['mummy', 'daddy', 'baby', 'grandma', 'grandpa'],
            skills: ['identification', 'speaking', 'relationships'],
            duration: 20
          },
          {
            lessonNumber: 8,
            title: 'Home Sweet Home',
            topic: 'house and rooms',
            vocabularyFocus: ['house', 'bedroom', 'kitchen', 'bathroom', 'garden'],
            skills: ['spatial awareness', 'vocabulary', 'description'],
            duration: 20
          },
          {
            lessonNumber: 9,
            title: 'Toy Box Fun',
            topic: 'toys and playtime',
            vocabularyFocus: ['ball', 'doll', 'car', 'book', 'teddy bear'],
            skills: ['play vocabulary', 'preferences', 'sharing'],
            duration: 20
          },
          {
            lessonNumber: 10,
            title: 'Yummy Foods',
            topic: 'basic foods',
            vocabularyFocus: ['apple', 'banana', 'bread', 'milk', 'water'],
            skills: ['healthy choices', 'likes/dislikes', 'nutrition'],
            duration: 20
          },
          {
            lessonNumber: 11,
            title: 'Dress Up Time',
            topic: 'clothes',
            vocabularyFocus: ['shirt', 'pants', 'shoes', 'hat', 'socks'],
            skills: ['dressing', 'weather', 'self-care'],
            duration: 20
          },
          {
            lessonNumber: 12,
            title: 'Animal Friends',
            topic: 'pets and farm animals',
            vocabularyFocus: ['cat', 'dog', 'cow', 'sheep', 'duck'],
            skills: ['animal sounds', 'care', 'habitats'],
            duration: 20
          }
        ]
      },
      {
        moduleNumber: 3,
        title: 'Fun and Play',
        description: 'Activities, games, and movement',
        lessons: [
          {
            lessonNumber: 13,
            title: 'Action Song Time',
            topic: 'action verbs',
            vocabularyFocus: ['run', 'jump', 'walk', 'dance', 'clap'],
            skills: ['movement', 'following instructions', 'rhythm'],
            duration: 20
          },
          {
            lessonNumber: 14,
            title: 'Weather Window',
            topic: 'weather',
            vocabularyFocus: ['sunny', 'rainy', 'cloudy', 'windy', 'hot', 'cold'],
            skills: ['observation', 'description', 'seasons'],
            duration: 20
          },
          {
            lessonNumber: 15,
            title: 'Transport Adventures',
            topic: 'vehicles',
            vocabularyFocus: ['car', 'bus', 'train', 'plane', 'bike'],
            skills: ['transportation', 'sounds', 'movement'],
            duration: 20
          },
          {
            lessonNumber: 16,
            title: 'Shape Detectives',
            topic: 'basic shapes',
            vocabularyFocus: ['circle', 'square', 'triangle', 'star', 'heart'],
            skills: ['recognition', 'sorting', 'patterns'],
            duration: 20
          },
          {
            lessonNumber: 17,
            title: 'Big and Small',
            topic: 'size and opposites',
            vocabularyFocus: ['big', 'small', 'long', 'short', 'tall'],
            skills: ['comparison', 'observation', 'opposites'],
            duration: 20
          },
          {
            lessonNumber: 18,
            title: 'Playground Fun',
            topic: 'playground activities',
            vocabularyFocus: ['slide', 'swing', 'climb', 'play', 'friends'],
            skills: ['social play', 'safety', 'cooperation'],
            duration: 20
          }
        ]
      },
      {
        moduleNumber: 4,
        title: 'Celebrations',
        description: 'Special occasions and celebrations',
        lessons: [
          {
            lessonNumber: 19,
            title: 'Birthday Party',
            topic: 'birthdays',
            vocabularyFocus: ['birthday', 'cake', 'candles', 'present', 'party'],
            skills: ['celebration', 'counting age', 'sharing joy'],
            duration: 20
          },
          {
            lessonNumber: 20,
            title: 'Holiday Magic',
            topic: 'holidays',
            vocabularyFocus: ['Christmas', 'tree', 'star', 'gift', 'holiday'],
            skills: ['traditions', 'cultural awareness', 'excitement'],
            duration: 20
          },
          {
            lessonNumber: 21,
            title: 'Thank You Song',
            topic: 'politeness',
            vocabularyFocus: ['please', 'thank you', 'sorry', 'excuse me', 'you are welcome'],
            skills: ['manners', 'social skills', 'kindness'],
            duration: 20
          },
          {
            lessonNumber: 22,
            title: 'Story Time Magic',
            topic: 'storytelling',
            vocabularyFocus: ['story', 'book', 'once upon a time', 'the end', 'characters'],
            skills: ['listening', 'imagination', 'sequence'],
            duration: 20
          },
          {
            lessonNumber: 23,
            title: 'Music and Dance',
            topic: 'music and rhythm',
            vocabularyFocus: ['music', 'song', 'dance', 'clap', 'rhythm'],
            skills: ['rhythm', 'coordination', 'expression'],
            duration: 20
          },
          {
            lessonNumber: 24,
            title: 'Graduation Celebration',
            topic: 'achievement and progress',
            vocabularyFocus: ['well done', 'good job', 'proud', 'achievement', 'next level'],
            skills: ['self-confidence', 'pride', 'progress recognition'],
            duration: 20
          }
        ]
      }
    ]
  };
}

/**
 * Generate lesson slides for a specific pre-starter lesson
 */
export function createPreStarterLessonSlides(
  program: PreStarterProgram, 
  moduleNumber: number, 
  lessonNumber: number
): LessonSlides {
  const module = program.modules.find(m => m.moduleNumber === moduleNumber);
  const lesson = module?.lessons.find(l => l.lessonNumber === lessonNumber);
  
  if (!module || !lesson) {
    throw new Error(`Lesson ${moduleNumber}.${lessonNumber} not found in program`);
  }

  const config: LessonTemplateConfig = {
    title: lesson.title,
    topic: lesson.topic,
    cefrLevel: 'A1', // Pre-starters use A1 foundation
    module: moduleNumber,
    lesson: lessonNumber,
    duration: lesson.duration,
    learningObjectives: [
      `Learn ${lesson.vocabularyFocus.length} new words about ${lesson.topic}`,
      `Practice ${lesson.skills.join(', ')}`,
      `Have fun with interactive ${lesson.topic} activities`
    ],
    vocabularyFocus: lesson.vocabularyFocus,
    grammarFocus: ['Simple recognition', 'Basic responses', 'Movement and gestures'],
    theme: 'mist-blue'
  };

  // Generate base slides using template
  const lessonSlides = generateLessonFromTemplate(config);
  
  // Customize for pre-starters (more interactive, shorter content, more movement)
  const preStarterSlides: Slide[] = [
    // Welcome slide with song
    {
      id: `${lesson.topic}-welcome`,
      type: 'warmup',
      prompt: `🎵 ${lesson.title}`,
      instructions: `👋 Hello everyone!\n\nLet's start with our special ${lesson.topic} song!\n\nGet ready to move and have fun!`,
      media: {
        type: 'audio',
        url: '',
        alt: `Welcome song for ${lesson.title}`,
        imagePrompt: `Cheerful cartoon characters singing and dancing about ${lesson.topic}, colorful and child-friendly`
      },
      accessibility: {
        screenReaderText: `Welcome to ${lesson.title} lesson for pre-starters`,
        highContrast: false,
        largeText: true
      },
      orderIndex: 1
    },
    
    // Vocabulary introduction with images
    {
      id: `${lesson.topic}-vocabulary`,
      type: 'vocabulary_preview',
      prompt: '📚 New Words Today!',
      instructions: 'Look and listen! Can you say these words?',
      vocabulary: lesson.vocabularyFocus,
      media: {
        type: 'image',
        url: '',
        alt: `${lesson.topic} vocabulary pictures`,
        imagePrompt: `Bright, colorful illustrations of ${lesson.vocabularyFocus.join(', ')} perfect for young children learning English`
      },
      accessibility: {
        screenReaderText: `Learning new words about ${lesson.topic}`,
        highContrast: false,
        largeText: true
      },
      orderIndex: 2
    },

    // Interactive game 1 - Simple matching
    {
      id: `${lesson.topic}-match`,
      type: 'picture_choice',
      prompt: '🎯 Point and Say!',
      instructions: 'Can you find the correct picture when I say the word?',
      options: lesson.vocabularyFocus.slice(0, 4).map((word, index) => ({
        id: `opt-${index}`,
        text: word,
        image: `https://images.unsplash.com/photo-150691${5000 + index}?w=200`,
        isCorrect: index === 0
      })),
      correct: 'opt-0',
      timeLimit: 30,
      accessibility: {
        screenReaderText: `Picture identification game for ${lesson.topic}`,
        highContrast: false,
        largeText: true
      },
      orderIndex: 3
    },

    // Movement activity
    {
      id: `${lesson.topic}-movement`,
      type: 'tpr_phonics',
      prompt: '🕺 Move and Learn!',
      instructions: `Let's move our bodies and practice ${lesson.topic} words!\n\nFollow the actions and say the words!`,
      vocabulary: lesson.vocabularyFocus,
      media: {
        type: 'video',
        url: '',
        alt: `Movement activity for ${lesson.topic}`,
        imagePrompt: `Children doing fun movements and gestures related to ${lesson.topic}, energetic and joyful scene`
      },
      accessibility: {
        screenReaderText: `Physical movement activity for ${lesson.topic}`,
        highContrast: false,
        largeText: true
      },
      orderIndex: 4
    },

    // Simple listening game
    {
      id: `${lesson.topic}-listening`,
      type: 'listening_comprehension',
      prompt: '👂 Listen Carefully!',
      instructions: 'Listen to the sounds and words. Can you repeat them?',
      media: {
        type: 'audio',
        url: '',
        alt: `Listening activity for ${lesson.topic}`,
        imagePrompt: `Children listening carefully with happy expressions, learning about ${lesson.topic}`
      },
      vocabulary: lesson.vocabularyFocus,
      accessibility: {
        screenReaderText: `Listening comprehension for ${lesson.topic}`,
        highContrast: false,
        largeText: true
      },
      orderIndex: 5
    },

    // Creative activity
    {
      id: `${lesson.topic}-creative`,
      type: 'picture_description',
      prompt: '🎨 Create and Share!',
      instructions: `Draw or show us something about ${lesson.topic}!\n\nTell us about your picture!`,
      media: {
        type: 'image',
        url: '',
        alt: `Creative activity for ${lesson.topic}`,
        imagePrompt: `Children drawing and creating art about ${lesson.topic}, creative and inspiring scene`
      },
      accessibility: {
        screenReaderText: `Creative expression activity for ${lesson.topic}`,
        highContrast: false,
        largeText: true
      },
      orderIndex: 6
    },

    // Celebration and goodbye
    {
      id: `${lesson.topic}-celebration`,
      type: 'exit_check',
      prompt: '🌟 Amazing Work!',
      instructions: `You did such a great job learning about ${lesson.topic}!\n\nLet's sing our goodbye song!\n\nSee you next time! 👋`,
      media: {
        type: 'image',
        url: '',
        alt: `Celebration for completing ${lesson.topic}`,
        imagePrompt: `Happy celebration with confetti, stars, and smiling children completing their ${lesson.topic} lesson`
      },
      accessibility: {
        screenReaderText: `Lesson completion celebration for ${lesson.topic}`,
        highContrast: false,
        largeText: true
      },
      orderIndex: 7
    }
  ];

  return {
    version: '2.0',
    theme: 'mist-blue',
    durationMin: lesson.duration,
    total_slides: preStarterSlides.length,
    metadata: {
      CEFR: 'A1',
      module: moduleNumber,
      lesson: lessonNumber,
      targets: [lesson.topic, ...lesson.vocabularyFocus],
      weights: { accuracy: 40, fluency: 60 } // More focus on fluency and enjoyment for young learners
    },
    slides: preStarterSlides,
    slideOrder: preStarterSlides.map(slide => slide.id)
  };
}

/**
 * Generate and save all lessons for the first pre-starters program
 */
export async function generatePreStartersProgram1ToDatabase() {
  const program = createPreStartersProgram1();
  const results = [];
  
  console.log(`🚀 Generating Pre-Starters Program 1: ${program.title}`);
  console.log(`📚 Total: ${program.totalLessons} lessons across ${program.modules.length} modules`);
  
  for (const module of program.modules) {
    console.log(`\n📖 Module ${module.moduleNumber}: ${module.title}`);
    
    for (const lesson of module.lessons) {
      try {
        console.log(`  📝 Generating Lesson ${lesson.lessonNumber}: ${lesson.title}`);
        
        // Generate lesson slides
        const lessonSlides = createPreStarterLessonSlides(program, module.moduleNumber, lesson.lessonNumber);
        
        // Create lesson content record
        const lessonContent = {
          title: lesson.title,
          topic: lesson.topic,
          cefr_level: 'A1',
          module_number: module.moduleNumber,
          lesson_number: lesson.lessonNumber,
          duration_minutes: lesson.duration,
          learning_objectives: [
            `Learn ${lesson.vocabularyFocus.length} new words about ${lesson.topic}`,
            `Practice ${lesson.skills.join(', ')}`,
            `Have fun with interactive ${lesson.topic} activities`
          ],
          vocabulary_focus: lesson.vocabularyFocus,
          grammar_focus: ['Simple recognition', 'Basic responses', 'Movement and gestures'],
          slides_content: lessonSlides,
          is_active: true,
          difficulty_level: 'pre-starter',
          metadata: {
            program: program.id,
            program_title: program.title,
            module_title: module.title,
            skills: lesson.skills,
            age_group: '3-5 years',
            lesson_type: 'pre-starter'
          }
        };
        
        // Save to database
        const { data, error } = await supabase
          .from('lessons_content')
          .insert(lessonContent)
          .select()
          .single();
        
        if (error) {
          console.error(`❌ Failed to save lesson ${module.moduleNumber}.${lesson.lessonNumber}:`, error);
          results.push({ 
            success: false, 
            error, 
            lesson: `${module.moduleNumber}.${lesson.lessonNumber}`,
            title: lesson.title 
          });
        } else {
          console.log(`✅ Saved: ${lesson.title}`);
          results.push({ 
            success: true, 
            data, 
            lesson: `${module.moduleNumber}.${lesson.lessonNumber}`,
            title: lesson.title 
          });
        }
        
        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`❌ Failed to generate lesson ${module.moduleNumber}.${lesson.lessonNumber}:`, error);
        results.push({ 
          success: false, 
          error, 
          lesson: `${module.moduleNumber}.${lesson.lessonNumber}`,
          title: lesson.title 
        });
      }
    }
  }
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n🎉 Generation complete!`);
  console.log(`✅ Successfully generated: ${successCount}/${program.totalLessons} lessons`);
  console.log(`📚 Program: ${program.title}`);
  console.log(`⏱️ Total duration: ${program.totalLessons * 20} minutes`);
  console.log(`📅 Estimated completion: ${program.estimatedWeeks} weeks`);
  
  return {
    program,
    results,
    summary: {
      total: program.totalLessons,
      successful: successCount,
      failed: program.totalLessons - successCount
    }
  };
}