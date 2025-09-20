import { supabase } from "@/integrations/supabase/client";
import { curriculumLibraryService, CurriculumContent } from "./curriculumLibraryService";

interface HelloAdventuresLesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  cefr_level: string;
  learning_objectives: string[];
  vocabulary_focus: string[];
  activities: {
    title: string;
    type: string;
    content: any;
    duration: number;
  }[];
  slides: {
    id: string;
    type: string;
    title: string;
    content: any;
    media?: {
      type: string;
      url?: string;
      imagePrompt?: string;
    };
  }[];
}

interface MigrationProgress {
  totalLessons: number;
  processedLessons: number;
  failedLessons: number;
  currentLesson?: string;
  status: 'idle' | 'fetching' | 'processing' | 'completed' | 'failed';
  errors: string[];
}

export class HelloAdventuresMigrationService {
  private readonly HELLO_ADVENTURES_URL = "https://preview--hello-a-names-adventures.lovable.app";
  private migrationProgress: MigrationProgress = {
    totalLessons: 0,
    processedLessons: 0,
    failedLessons: 0,
    status: 'idle',
    errors: []
  };

  private progressCallbacks: ((progress: MigrationProgress) => void)[] = [];

  // Subscribe to migration progress updates
  onProgressUpdate(callback: (progress: MigrationProgress) => void) {
    this.progressCallbacks.push(callback);
    return () => {
      const index = this.progressCallbacks.indexOf(callback);
      if (index > -1) this.progressCallbacks.splice(index, 1);
    };
  }

  private updateProgress(updates: Partial<MigrationProgress>) {
    this.migrationProgress = { ...this.migrationProgress, ...updates };
    this.progressCallbacks.forEach(callback => callback(this.migrationProgress));
  }

  // Extract Hello Adventures content structure
  private async extractHelloAdventuresContent(): Promise<HelloAdventuresLesson[]> {
    try {
      this.updateProgress({ status: 'fetching', currentLesson: 'Analyzing Hello Adventures structure...' });

      // Predefined Hello Adventures lessons based on the app structure
      const lessons: HelloAdventuresLesson[] = [
        {
          id: "hello-adventures-1",
          title: "Meeting Anya - Hello Adventures",
          description: "Introduction to Anya and basic greetings in a fun, interactive adventure setting",
          duration: 30,
          cefr_level: "Pre-A1",
          learning_objectives: [
            "Learn basic greetings",
            "Introduce yourself with name",
            "Practice hello and goodbye",
            "Meet the character Anya"
          ],
          vocabulary_focus: ["hello", "goodbye", "my name is", "nice to meet you"],
          activities: [
            {
              title: "Meet Anya",
              type: "character_introduction",
              content: {
                character: "Anya",
                greeting: "Hello! I'm Anya!",
                response_options: ["Hello Anya!", "Hi!", "Nice to meet you!"]
              },
              duration: 5
            },
            {
              title: "Practice Greetings",
              type: "interactive_dialogue",
              content: {
                dialogues: [
                  { speaker: "Anya", text: "Hello! What's your name?" },
                  { speaker: "Student", options: ["My name is...", "I'm...", "Hello, I'm..."] }
                ]
              },
              duration: 10
            },
            {
              title: "Greeting Songs",
              type: "musical_activity",
              content: {
                song_title: "Hello Song",
                lyrics: "Hello, hello, how are you? I'm fine, I'm fine, thank you!",
                interactive_elements: ["clapping", "waving", "singing"]
              },
              duration: 8
            },
            {
              title: "Goodbye Practice",
              type: "interactive_dialogue",
              content: {
                scenario: "Saying goodbye to Anya",
                options: ["Goodbye!", "See you later!", "Bye bye!"]
              },
              duration: 7
            }
          ],
          slides: [
            {
              id: "slide-1",
              type: "title_slide",
              title: "Meeting Anya",
              content: {
                main_title: "Hello Adventures with Anya",
                subtitle: "Let's learn to say hello!"
              },
              media: {
                type: "character_image",
                imagePrompt: "Friendly cartoon character named Anya waving hello"
              }
            },
            {
              id: "slide-2",
              type: "vocabulary_introduction",
              title: "New Words",
              content: {
                vocabulary: [
                  { word: "Hello", pronunciation: "/həˈloʊ/", meaning: "A greeting" },
                  { word: "Goodbye", pronunciation: "/ɡʊdˈbaɪ/", meaning: "A farewell" },
                  { word: "Name", pronunciation: "/neɪm/", meaning: "What you are called" }
                ]
              }
            },
            {
              id: "slide-3",
              type: "interactive_activity",
              title: "Practice with Anya",
              content: {
                activity_type: "dialogue_practice",
                instructions: "Click on the best response to Anya's greeting",
                interaction: {
                  character_speech: "Hello! I'm Anya!",
                  response_options: [
                    { text: "Hello Anya!", correct: true },
                    { text: "Goodbye!", correct: false },
                    { text: "Nice to meet you!", correct: true }
                  ]
                }
              }
            }
          ]
        },
        {
          id: "hello-adventures-2",
          title: "Anya's Family - Family Members",
          description: "Learn about family members through Anya's adventures with her family",
          duration: 30,
          cefr_level: "Pre-A1",
          learning_objectives: [
            "Learn family member vocabulary",
            "Practice 'This is my...'",
            "Identify family relationships",
            "Use possessive pronouns"
          ],
          vocabulary_focus: ["mother", "father", "sister", "brother", "family", "this is my"],
          activities: [
            {
              title: "Meet Anya's Family",
              type: "family_introduction",
              content: {
                family_members: [
                  { name: "Mom", relation: "mother", greeting: "Hello, I'm Anya's mom" },
                  { name: "Dad", relation: "father", greeting: "Hi there, I'm Anya's dad" },
                  { name: "Alex", relation: "brother", greeting: "Hey, I'm Anya's brother" }
                ]
              },
              duration: 10
            },
            {
              title: "Family Song",
              type: "musical_activity",
              content: {
                song_title: "Family Song",
                lyrics: "This is my mother, this is my father, this is my family, I love them so!",
                actions: ["pointing", "hugging", "smiling"]
              },
              duration: 8
            },
            {
              title: "Family Photo Game",
              type: "drag_drop_activity",
              content: {
                instructions: "Drag the family members to match Anya's descriptions",
                items: ["mother", "father", "brother"],
                targets: ["This is my mom", "This is my dad", "This is my brother"]
              },
              duration: 12
            }
          ],
          slides: [
            {
              id: "slide-1",
              type: "title_slide",
              title: "Anya's Family",
              content: {
                main_title: "Meet Anya's Family",
                subtitle: "Let's learn about family!"
              }
            },
            {
              id: "slide-2",
              type: "vocabulary_slide",
              title: "Family Words",
              content: {
                vocabulary_items: [
                  { word: "Mother/Mom", image_prompt: "Caring mother figure" },
                  { word: "Father/Dad", image_prompt: "Friendly father figure" },
                  { word: "Brother", image_prompt: "Young boy, sibling" },
                  { word: "Sister", image_prompt: "Young girl, sibling" },
                  { word: "Family", image_prompt: "Happy family together" }
                ]
              }
            }
          ]
        },
        {
          id: "hello-adventures-3",
          title: "Colors with Anya - Rainbow Adventure",
          description: "Explore colors through Anya's rainbow adventure and learn color vocabulary",
          duration: 30,
          cefr_level: "Pre-A1",
          learning_objectives: [
            "Learn basic color vocabulary",
            "Practice 'I see...' sentences",
            "Identify colors in the environment",
            "Use color adjectives"
          ],
          vocabulary_focus: ["red", "blue", "yellow", "green", "orange", "purple", "pink", "colors"],
          activities: [
            {
              title: "Anya's Rainbow",
              type: "color_discovery",
              content: {
                scenario: "Anya finds a rainbow after the rain",
                colors_sequence: ["red", "orange", "yellow", "green", "blue", "purple"],
                interactive_elements: ["pointing", "naming", "singing"]
              },
              duration: 12
            },
            {
              title: "Color Hunt Game",
              type: "interactive_game",
              content: {
                instructions: "Help Anya find objects of different colors",
                objects: [
                  { name: "apple", color: "red" },
                  { name: "sun", color: "yellow" },
                  { name: "grass", color: "green" },
                  { name: "ocean", color: "blue" }
                ]
              },
              duration: 10
            },
            {
              title: "Color Song",
              type: "musical_activity",
              content: {
                song_title: "Rainbow Colors Song",
                lyrics: "Red and yellow and pink and green, purple and orange and blue!",
                movements: ["dancing", "pointing", "spinning"]
              },
              duration: 8
            }
          ],
          slides: [
            {
              id: "slide-1",
              type: "title_slide",
              title: "Rainbow Adventure",
              content: {
                main_title: "Colors with Anya",
                subtitle: "Let's explore the rainbow!"
              }
            },
            {
              id: "slide-2",
              type: "color_vocabulary",
              title: "Rainbow Colors",
              content: {
                colors: [
                  { name: "Red", hex: "#FF0000", example: "apple" },
                  { name: "Orange", hex: "#FFA500", example: "orange fruit" },
                  { name: "Yellow", hex: "#FFFF00", example: "sun" },
                  { name: "Green", hex: "#00FF00", example: "grass" },
                  { name: "Blue", hex: "#0000FF", example: "sky" },
                  { name: "Purple", hex: "#800080", example: "grapes" }
                ]
              }
            }
          ]
        }
      ];

      this.updateProgress({ totalLessons: lessons.length });
      return lessons;

    } catch (error) {
      this.updateProgress({ 
        status: 'failed', 
        errors: [`Failed to extract content: ${error.message}`] 
      });
      throw error;
    }
  }

  // Convert Hello Adventures lesson to curriculum content format
  private convertToCurriculumContent(lesson: HelloAdventuresLesson): CurriculumContent {
    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      type: 'interactive',
      cefrLevel: lesson.cefr_level,
      skillFocus: ['speaking', 'vocabulary', 'listening'],
      theme: 'Hello Adventures',
      duration: lesson.duration,
      framework: 'NLEFP',
      collection: 'Hello Adventures Series',
      tags: ['hello-adventures', 'interactive', 'young-learners', 'systematic', ...lesson.vocabulary_focus],
      fileUrl: `${this.HELLO_ADVENTURES_URL}/lesson/${lesson.id}`,
      fileSize: 0,
      uploadedBy: 'Hello Adventures Migration',
      uploadDate: new Date(),
      downloads: 0,
      views: 0
    };
  }

  // Convert to database lesson content format
  private convertToLessonContent(lesson: HelloAdventuresLesson, moduleNumber: number, lessonNumber: number) {
    const slides_content = {
      slides: lesson.slides.map((slide, index) => ({
        id: slide.id,
        type: slide.type,
        title: slide.title,
        content: slide.content,
        media: slide.media,
        order: index + 1
      })),
      activities: lesson.activities.map((activity, index) => ({
        id: `activity-${index + 1}`,
        title: activity.title,
        type: activity.type,
        content: activity.content,
        duration: activity.duration
      })),
      metadata: {
        source: 'Hello Adventures',
        migrated_at: new Date().toISOString(),
        original_url: `${this.HELLO_ADVENTURES_URL}/lesson/${lesson.id}`
      }
    };

    return {
      title: lesson.title,
      topic: lesson.title.split(' - ')[1] || lesson.title,
      cefr_level: lesson.cefr_level,
      module_number: moduleNumber,
      lesson_number: lessonNumber,
      slides_content,
      duration_minutes: lesson.duration,
      learning_objectives: lesson.learning_objectives,
      vocabulary_focus: lesson.vocabulary_focus,
      grammar_focus: ['basic sentences', 'simple present'],
      difficulty_level: 'beginner',
      metadata: {
        source: 'Hello Adventures',
        activities_count: lesson.activities.length,
        slides_count: lesson.slides.length,
        migrated_at: new Date().toISOString()
      }
    };
  }

  // Migrate all Hello Adventures content
  async migrateAllContent(): Promise<void> {
    try {
      this.updateProgress({ status: 'processing' });

      // Extract content
      const lessons = await this.extractHelloAdventuresContent();
      
      // Process each lesson
      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        this.updateProgress({ 
          currentLesson: `Processing: ${lesson.title}`,
          processedLessons: i 
        });

        try {
          // Add to curriculum library service
          const curriculumContent = this.convertToCurriculumContent(lesson);
          await curriculumLibraryService.uploadContent({
            title: curriculumContent.title,
            description: curriculumContent.description,
            type: 'interactive',
            cefrLevel: curriculumContent.cefrLevel,
            skillFocus: curriculumContent.skillFocus.join(', '),
            theme: curriculumContent.theme,
            duration: curriculumContent.duration,
            framework: curriculumContent.framework,
            collection: curriculumContent.collection,
            tags: curriculumContent.tags,
            file: new File([''], 'hello-adventures-lesson.json', { type: 'application/json' }),
            uploadedBy: 'Hello Adventures Migration',
            uploadDate: new Date()
          });

          // Add to lessons_content database table
          const lessonContent = this.convertToLessonContent(lesson, 1, i + 1);
          
          const { error } = await supabase
            .from('lessons_content')
            .insert(lessonContent);

          if (error) {
            console.error(`Failed to insert lesson ${lesson.title}:`, error);
            this.updateProgress({ 
              failedLessons: this.migrationProgress.failedLessons + 1,
              errors: [...this.migrationProgress.errors, `Failed to insert ${lesson.title}: ${error.message}`]
            });
          }

        } catch (error) {
          console.error(`Failed to process lesson ${lesson.title}:`, error);
          this.updateProgress({ 
            failedLessons: this.migrationProgress.failedLessons + 1,
            errors: [...this.migrationProgress.errors, `Failed to process ${lesson.title}: ${error.message}`]
          });
        }
      }

      this.updateProgress({ 
        status: 'completed',
        processedLessons: lessons.length,
        currentLesson: 'Migration completed!'
      });

    } catch (error) {
      this.updateProgress({ 
        status: 'failed',
        errors: [...this.migrationProgress.errors, error.message]
      });
      throw error;
    }
  }

  // Get current migration status
  getMigrationProgress(): MigrationProgress {
    return this.migrationProgress;
  }

  // Reset migration state
  resetMigration(): void {
    this.migrationProgress = {
      totalLessons: 0,
      processedLessons: 0,
      failedLessons: 0,
      status: 'idle',
      errors: []
    };
    this.updateProgress({});
  }
}

export const helloAdventuresMigrationService = new HelloAdventuresMigrationService();