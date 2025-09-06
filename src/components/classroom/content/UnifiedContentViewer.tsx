import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedWhiteboardCanvas } from "@/components/classroom/whiteboard/EnhancedWhiteboardCanvas";
import { EnhancedWhiteboardToolbar } from "@/components/classroom/whiteboard/EnhancedWhiteboardToolbar";
import { EnhancedContentLibrary } from "./EnhancedContentLibrary";
import { EnhancedUploadDialog } from "./EnhancedUploadDialog";
import { LessonSlideViewer } from "./LessonSlideViewer";
import { useEnhancedContentManager } from "./useEnhancedContentManager";
import { ContentItem } from "./types";
import { SoundButton } from "@/components/ui/sound-button";
import { TeacherAssignmentPanel } from "../assignment/TeacherAssignmentPanel";
import { StudentAssignmentPanel } from "../assignment/StudentAssignmentPanel";
import { Upload, Plus, BookOpen, PenTool, Gamepad2, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createGreetingsDeck, createGreetingsPPPRequest } from "@/utils/createGreetingsDeck";
interface EmbeddedContent {
  id: string;
  title: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fileType?: string;
  originalType?: string;
}
interface UnifiedContentViewerProps {
  isTeacher: boolean;
  studentName: string;
  currentUser?: {
    id: string;
    role: 'teacher' | 'student';
    name: string;
  };
}
export function UnifiedContentViewer({
  isTeacher,
  studentName,
  currentUser
}: UnifiedContentViewerProps) {
  const [activeTab, setActiveTab] = useState(() => {
    // Default to Content Library for teachers to see lessons immediately
    return isTeacher ? "content" : "whiteboard";
  });
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser" | "text" | "highlighter" | "shape" | "move">("pencil");
  const [color, setColor] = useState("#9B87F5");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [activeShape, setActiveShape] = useState<"rectangle" | "circle">("rectangle");
  const [embeddedContent, setEmbeddedContent] = useState<EmbeddedContent[]>([]);
  const [currentLessonSlides, setCurrentLessonSlides] = useState<any>(null);
  const [currentLessonTitle, setCurrentLessonTitle] = useState("");
  const [isGeneratingSlides, setIsGeneratingSlides] = useState(false);
  const [isRegeneratingWithAI, setIsRegeneratingWithAI] = useState(false);
  const [isGeneratingGreetingsPPP, setIsGeneratingGreetingsPPP] = useState(false);
  const {
    toast
  } = useToast();

  // Debug embedded content changes
  React.useEffect(() => {
    console.log('📋 EmbeddedContent state updated:', embeddedContent);
  }, [embeddedContent]);

  // Auto-load lesson from URL parameter
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('lesson');
    const skipGen = urlParams.get('skipGen');
    if (lessonId) {
      console.log('🔄 Auto-loading lesson from URL:', lessonId);
      setActiveTab('whiteboard');
      loadLessonById(lessonId, skipGen === '1');
    }
  }, []);
  const createUniversalDeck = (lesson: any) => {
    const level = lesson.cefr_level || lesson.level_info?.cefr_level || 'A1';
    const title = lesson.title || 'English Lesson';
    const objectives = lesson.learning_objectives || lesson.lesson_objectives || ['Use basic vocabulary and phrases', 'Practice listening and speaking skills', 'Engage in simple conversations'];
    const vocabulary = lesson.vocabulary_focus || ['hello', 'goodbye', 'please', 'thank you'];
    const grammar = lesson.grammar_focus || ['Simple present tense', 'Basic sentence structure'];
    const slides = [
    // Warm-up (2-3 slides)
    {
      id: "slide-1",
      type: "warmup",
      prompt: `Welcome to ${title}!`,
      instructions: "Let's start with a fun warm-up activity. Say hello to everyone and share how you're feeling today.",
      accessibility: {
        screenReaderText: `Welcome slide for ${title}`,
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-2",
      type: "warmup",
      prompt: "Quick Review",
      instructions: "Think about what you learned in the previous lesson. Share one thing you remember.",
      accessibility: {
        screenReaderText: "Quick review of previous lesson",
        highContrast: false,
        largeText: false
      }
    },
    // Introduction (2 slides)
    {
      id: "slide-3",
      type: "vocabulary_preview",
      prompt: `Today's Topic: ${title}`,
      instructions: `Learning Objectives: ${objectives.slice(0, 3).join(', ')}`,
      accessibility: {
        screenReaderText: "Today's lesson objectives",
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-4",
      type: "target_language",
      prompt: "Key Words Preview",
      instructions: `We'll learn these important words: ${vocabulary.slice(0, 6).join(', ')}`,
      accessibility: {
        screenReaderText: "Preview of key vocabulary",
        highContrast: false,
        largeText: false
      }
    },
    // Presentation / Input (5-6 slides)
    {
      id: "slide-5",
      type: "vocabulary_preview",
      prompt: "Vocabulary Focus",
      instructions: `New words: ${vocabulary.join(', ')}. Listen and repeat each word.`,
      accessibility: {
        screenReaderText: "Vocabulary presentation",
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-6",
      type: "grammar_focus",
      prompt: "Grammar Patterns",
      instructions: `Today's grammar: ${grammar.join(', ')}. Let's see some examples.`,
      accessibility: {
        screenReaderText: "Grammar pattern introduction",
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-7",
      type: "listening_comprehension",
      prompt: "Listen and Learn",
      instructions: "Listen to the examples and pay attention to pronunciation and intonation.",
      accessibility: {
        screenReaderText: "Listening comprehension activity",
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-8",
      type: "sentence_builder",
      prompt: "Example Sentences",
      instructions: "Look at these example sentences using our new vocabulary and grammar.",
      accessibility: {
        screenReaderText: "Example sentences",
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-9",
      type: "pronunciation_shadow",
      prompt: "Pronunciation Practice",
      instructions: "Repeat after me. Focus on clear pronunciation and natural rhythm.",
      accessibility: {
        screenReaderText: "Pronunciation practice",
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-10",
      type: "micro_input",
      prompt: "Context Examples",
      instructions: "See how these words and phrases are used in real conversations.",
      accessibility: {
        screenReaderText: "Contextual examples",
        highContrast: false,
        largeText: false
      }
    },
    // Guided Practice (4-5 slides)
    {
      id: "slide-11",
      type: "accuracy_mcq",
      prompt: "Quick Knowledge Check",
      instructions: "Choose the correct answer to test your understanding.",
      options: [{
        id: "opt-a",
        text: "This is the correct answer",
        isCorrect: true
      }, {
        id: "opt-b",
        text: "This is incorrect",
        isCorrect: false
      }, {
        id: "opt-c",
        text: "This is also incorrect",
        isCorrect: false
      }, {
        id: "opt-d",
        text: "This is wrong too",
        isCorrect: false
      }],
      correct: "opt-a",
      accessibility: {
        screenReaderText: "Multiple choice comprehension check",
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-12",
      type: "picture_choice",
      prompt: "Picture Match",
      instructions: "Select the picture that matches the word or sentence.",
      options: [{
        id: "pic-a",
        text: "Picture A",
        isCorrect: true
      }, {
        id: "pic-b",
        text: "Picture B",
        isCorrect: false
      }, {
        id: "pic-c",
        text: "Picture C",
        isCorrect: false
      }],
      correct: "pic-a",
      accessibility: {
        screenReaderText: "Picture matching activity",
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-13",
      type: "transform",
      prompt: "Sentence Building",
      instructions: "Use the words to create your own sentences.",
      accessibility: {
        screenReaderText: "Sentence building exercise",
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-14",
      type: "error_fix",
      prompt: "Fix the Mistakes",
      instructions: "Can you find and correct the errors in these sentences?",
      accessibility: {
        screenReaderText: "Error correction activity",
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-15",
      type: "labeling",
      prompt: "Label the Items",
      instructions: "Click on each item and choose the correct label.",
      options: [{
        id: "label-a",
        text: "Correct Label",
        isCorrect: true
      }, {
        id: "label-b",
        text: "Wrong Label",
        isCorrect: false
      }, {
        id: "label-c",
        text: "Another Wrong Label",
        isCorrect: false
      }],
      correct: "label-a",
      accessibility: {
        screenReaderText: "Interactive labeling activity",
        highContrast: false,
        largeText: false
      }
    },
    // Gamified Activities (3-4 slides)
    {
      id: "slide-16",
      type: "match",
      prompt: 'Match Words with Pictures',
      instructions: 'Connect each word with its matching picture.',
      matchPairs: [{
        id: 'pair-1',
        left: vocabulary[0] || 'Hello',
        right: 'Greeting gesture',
        leftImage: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=200'
      }, {
        id: 'pair-2',
        left: vocabulary[1] || 'Goodbye',
        right: 'Waving hand',
        leftImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200'
      }, {
        id: 'pair-3',
        left: vocabulary[2] || 'Please',
        right: 'Polite request',
        leftImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200'
      }, {
        id: 'pair-4',
        left: vocabulary[3] || 'Thank you',
        right: 'Grateful expression',
        leftImage: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=200'
      }],
      timeLimit: 120,
      accessibility: {
        screenReaderText: "Match vocabulary words with their meanings",
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-17",
      type: "drag_drop",
      prompt: 'Sort Items by Category',
      instructions: 'Drag each item to the correct category.',
      dragDropItems: [{
        id: 'apple',
        text: 'Apple',
        targetId: 'food'
      }, {
        id: 'car',
        text: 'Car',
        targetId: 'transport'
      }, {
        id: 'book',
        text: 'Book',
        targetId: 'school'
      }, {
        id: 'orange',
        text: 'Orange',
        targetId: 'food'
      }],
      dragDropTargets: [{
        id: 'food',
        text: 'Food',
        acceptsItemIds: ['apple', 'orange'],
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120'
      }, {
        id: 'transport',
        text: 'Transport',
        acceptsItemIds: ['car'],
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=120'
      }, {
        id: 'school',
        text: 'School',
        acceptsItemIds: ['book'],
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=120'
      }],
      timeLimit: 180,
      accessibility: {
        screenReaderText: "Sort items into categories activity",
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-18",
      type: "cloze",
      prompt: 'Complete the Sentences',
      instructions: 'Fill in the missing words to complete each sentence.',
      clozeText: 'My name [gap1] John. I [gap2] from England. I [gap3] English and Spanish. Nice to [gap4] you!',
      clozeGaps: [{
        id: 'gap1',
        correctAnswers: ['is'],
        options: ['is', 'are', 'am', 'be']
      }, {
        id: 'gap2',
        correctAnswers: ['am', 'come'],
        options: ['am', 'is', 'are', 'come']
      }, {
        id: 'gap3',
        correctAnswers: ['speak'],
        options: ['speak', 'speaks', 'speaking', 'spoken']
      }, {
        id: 'gap4',
        correctAnswers: ['meet'],
        options: ['meet', 'see', 'know', 'find']
      }],
      timeLimit: 300,
      accessibility: {
        screenReaderText: "Fill in the blanks sentence completion activity",
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-19",
      type: "fluency_sprint",
      prompt: "Speed Speaking",
      instructions: "How quickly can you use all the new words in sentences?",
      accessibility: {
        screenReaderText: "Fluency speed practice",
        highContrast: false,
        largeText: false
      }
    },
    // Communication Practice (3-4 slides)
    {
      id: "slide-20",
      type: "communicative_task",
      prompt: "Pair Work Practice",
      instructions: "Work with a partner to practice the new language in conversation.",
      accessibility: {
        screenReaderText: "Pair work communication practice",
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-21",
      type: "picture_description",
      prompt: "Ask and Answer",
      instructions: "Take turns asking and answering questions using today's vocabulary.",
      accessibility: {
        screenReaderText: "Question and answer practice",
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-22",
      type: "roleplay_setup",
      prompt: "Mini Role-play Scenario",
      instructions: "Act out this scenario using everything you've learned today.",
      accessibility: {
        screenReaderText: "Role-play scenario practice",
        highContrast: false,
        largeText: false
      }
    },
    // Review & Wrap-up (2-3 slides)
    {
      id: "slide-26",
      type: "review_consolidation",
      prompt: "Today's Key Points",
      instructions: `Let's review: Vocabulary (${vocabulary.slice(0, 3).join(', ')}) and Grammar (${grammar[0] || 'sentence patterns'})`,
      accessibility: {
        screenReaderText: "Lesson review and key points",
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-27",
      type: "exit_check",
      prompt: "Final Review Quiz",
      instructions: "Quick multiple choice questions to check your understanding.",
      options: [{
        id: "quiz-a",
        text: "The right answer for today's lesson",
        isCorrect: true
      }, {
        id: "quiz-b",
        text: "An incorrect option",
        isCorrect: false
      }, {
        id: "quiz-c",
        text: "Another wrong answer",
        isCorrect: false
      }, {
        id: "quiz-d",
        text: "This is also wrong",
        isCorrect: false
      }],
      correct: "quiz-a",
      accessibility: {
        screenReaderText: "Final comprehension check",
        highContrast: false,
        largeText: false
      }
    }, {
      id: "slide-28",
      type: "review_consolidation",
      prompt: "Homework & Reflection",
      instructions: "Practice using today's vocabulary in real conversations. Think about how you can use these words this week!",
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
        alt: 'Celebration',
        imagePrompt: 'Celebration with confetti and happy people learning'
      },
      accessibility: {
        screenReaderText: "Homework assignment and reflection",
        highContrast: false,
        largeText: false
      }
    }];
    return {
      version: "2.0",
      theme: "mist-blue",
      slides: slides,
      durationMin: lesson.duration_minutes || 30,
      total_slides: slides.length,
      metadata: {
        CEFR: level,
        module: lesson.module_number || 1,
        lesson: lesson.lesson_number || 1,
        targets: objectives,
        weights: {
          accuracy: 60,
          fluency: 40
        }
      },
      generated_at: new Date().toISOString(),
      generated_by: 'universal-template'
    };
  };
  const loadLessonById = async (lessonId: string, skipGeneration = false) => {
    try {
      console.log('🔄 Loading lesson:', lessonId);

      // Try multiple sources for lesson content
      let lesson = null;

      // 1. Try localStorage first (for immediate access)
      const storedLesson = localStorage.getItem('currentLessonContent');
      if (storedLesson) {
        try {
          lesson = JSON.parse(storedLesson);
          console.log('📚 Found lesson in localStorage:', lesson.title);
        } catch (e) {
          console.warn('Failed to parse stored lesson:', e);
        }
      }

      // 2. Try lessons_content table if not in localStorage
      if (!lesson) {
        const {
          data: lessonsData,
          error: lessonsError
        } = await supabase.from('lessons_content').select('*').eq('id', lessonId).single();
        if (lessonsData && !lessonsError) {
          lesson = lessonsData;
          console.log('📚 Found lesson in lessons_content:', lesson.title);
        }
      }

      // 3. Try systematic_lessons table as fallback
      if (!lesson) {
        try {
          const {
            curriculumService
          } = await import('@/services/curriculumService');
          lesson = await curriculumService.getSystematicLessonById(lessonId);
          if (lesson) {
            console.log('📚 Found lesson in systematic_lessons:', lesson.title);
          }
        } catch (e) {
          console.warn('Failed to load from systematic_lessons:', e);
        }
      }
      if (!lesson) {
        console.error('Lesson not found in any source:', lessonId);
        return;
      }
      console.log('📚 Lesson data:', lesson);

      // Clear any existing lesson content first
      setEmbeddedContent(prev => prev.filter(content => content.originalType !== 'systematic_lesson'));

      // Check if lesson needs slides generation or upgrade
      const hasValidSlides = lesson.slides_content && (lesson.slides_content.slides?.length > 0 || lesson.slides_content.total_slides > 0);
      const needsGeneration = !hasValidSlides;
      const needsUpgrade = hasValidSlides && lesson.slides_content?.slides && (lesson.slides_content.slides.length < 20 || lesson.slides_content.version !== '2.0');
      if ((needsGeneration || needsUpgrade) && !skipGeneration) {
        console.log('🎨 Generating/upgrading lesson slides:', lesson.title);
        setIsGeneratingSlides(true);

        // Show generating toast
        toast({
          title: "Generating Slides",
          description: "Creating interactive lesson slides with OpenAI..."
        });
        try {
          const {
            data,
            error
          } = await supabase.functions.invoke('ai-slide-generator', {
            body: {
              content_id: lessonId,
              content_type: 'systematic_lesson',
              generate_20_slides: true
            }
          });
          if (error) {
            throw error;
          }
          if (data?.success) {
            toast({
              title: "Slides Generated! 🎉",
              description: `Created ${data.slides?.total_slides || 22} interactive slides.`
            });

            // Update lesson with new slides
            lesson.slides_content = data.slides;
          } else {
            throw new Error(data?.error || 'Failed to generate slides');
          }
        } catch (error) {
          console.error('Failed to generate/upgrade slides:', error);
          toast({
            title: "Generation Failed",
            description: "Using fallback template. You can retry slide generation later.",
            variant: "destructive"
          });

          // Create universal interactive deck template
          const {
            createUniversalInteractiveDeck
          } = await import('@/data/sampleSlides');
          lesson.slides_content = createUniversalInteractiveDeck(lesson);
        } finally {
          setIsGeneratingSlides(false);
        }
      } else if (needsGeneration || needsUpgrade) {
        // Skip generation and use universal deck
        console.log('📋 Creating universal interactive deck for:', lesson.title);
        const {
          createUniversalInteractiveDeck
        } = await import('@/data/sampleSlides');
        lesson.slides_content = createUniversalInteractiveDeck(lesson);
      }

      // If no lesson slides exist, use sample interactive slides as fallback
      if (!lesson.slides_content || !lesson.slides_content.slides || lesson.slides_content.slides.length === 0) {
        console.log('📚 Loading sample interactive slides as fallback');
        const {
          sampleInteractiveSlides
        } = await import('@/data/sampleSlides');
        lesson.slides_content = sampleInteractiveSlides;
      }

      // Set the lesson slides for React component
      setCurrentLessonSlides(lesson.slides_content);
      setCurrentLessonTitle(lesson.title);
      setActiveTab('lesson-viewer');
      console.log('✅ Lesson loaded with slides:', lesson.slides_content);
    } catch (error) {
      console.error('Error loading lesson:', error);
      setIsGeneratingSlides(false);
    }
  };
  const regenerateSlides = async (lessonId?: string) => {
    if (!lessonId && !currentLessonSlides) return;
    setIsGeneratingSlides(true);
    toast({
      title: "Regenerating Slides",
      description: "Creating new interactive slides with OpenAI..."
    });
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('ai-slide-generator', {
        body: {
          content_id: lessonId,
          content_type: 'systematic_lesson',
          generate_20_slides: true
        }
      });
      if (error) throw error;
      if (data?.success) {
        setCurrentLessonSlides(data.slides);
        toast({
          title: "Slides Regenerated! 🎉",
          description: `Created ${data.slides?.total_slides || 22} new interactive slides.`
        });
      }
    } catch (error) {
      console.error('Failed to regenerate slides:', error);
      toast({
        title: "Regeneration Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsGeneratingSlides(false);
    }
  };
  const regenerateWithAI = async () => {
    if (!currentLessonSlides && !currentLessonTitle) {
      toast({
        title: "No Lesson Loaded",
        description: "Please load a lesson first to regenerate slides.",
        variant: "destructive"
      });
      return;
    }
    setIsRegeneratingWithAI(true);
    toast({
      title: "Regenerating with AI (PPP)",
      description: "Creating pedagogically structured slides using Presentation, Practice, Production methodology..."
    });
    try {
      // Create lesson data for AI generation based on current context
      const lessonData = {
        title: currentLessonTitle || selectedContent?.title || 'English Communication Lesson',
        topic: selectedContent?.topic || 'English Communication Skills',
        cefr_level: 'A1',
        // Default level, could be made configurable
        duration_minutes: 30,
        target_age: 'Young learners (7-12 years old)',
        learning_objectives: ['Students can use basic vocabulary appropriately', 'Students can engage in simple conversations', 'Students can practice key grammar structures'],
        vocabulary_focus: ['hello', 'goodbye', 'please', 'thank you', 'how are you'],
        grammar_focus: ['Simple present tense', 'Question formation', 'Basic sentence structure']
      };

      // Call the AI slide generator directly with lesson data
      const {
        data,
        error
      } = await supabase.functions.invoke('ai-slide-generator', {
        body: {
          action: 'generate_full_deck',
          lesson_data: lessonData,
          // Pass lesson data directly
          slide_count: 25,
          structure: 'ppp'
        }
      });
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to call AI generator');
      }
      if (data?.success) {
        console.log('✅ AI generation successful:', data);
        setCurrentLessonSlides(data.slides);
        setCurrentLessonTitle(lessonData.title);
        toast({
          title: "AI Slides Generated! 🎉",
          description: `Created ${data.slides?.total_slides || 25} pedagogically structured slides using PPP methodology.`
        });
      } else {
        console.error('AI generation failed:', data);
        throw new Error(data?.error || 'Failed to generate slides');
      }
    } catch (error) {
      console.error('Failed to regenerate with AI:', error);
      toast({
        title: "AI Generation Failed",
        description: error.message || "Failed to generate slides. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRegeneratingWithAI(false);
    }
  };
  const loadGreetingsDeck = () => {
    const greetingsDeck = createGreetingsDeck();
    setCurrentLessonSlides(greetingsDeck);
    setCurrentLessonTitle("Greetings and Introductions");
    setActiveTab('lesson-viewer');
    toast({
      title: "Greetings Lesson Loaded! 👋",
      description: "Ready-to-use interactive greetings lesson with 6 engaging slides."
    });
  };
  const generateGreetingsPPP = async () => {
    setIsGeneratingGreetingsPPP(true);
    toast({
      title: "Generating Greetings PPP Deck",
      description: "Creating 25 pedagogically structured slides for greetings and introductions..."
    });
    try {
      const requestData = createGreetingsPPPRequest();
      const {
        data,
        error
      } = await supabase.functions.invoke('ai-slide-generator', {
        body: requestData
      });
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to call AI generator');
      }
      if (data?.success) {
        console.log('✅ Greetings PPP generation successful:', data);
        setCurrentLessonSlides(data.slides);
        setCurrentLessonTitle("Greetings and Introductions (PPP)");
        setActiveTab('lesson-viewer');
        toast({
          title: "Greetings PPP Generated! 🎉",
          description: `Created ${data.slides?.total_slides || 25} structured slides using PPP methodology.`
        });
      } else {
        console.error('PPP generation failed:', data);
        throw new Error(data?.error || 'Failed to generate PPP slides');
      }
    } catch (error) {
      console.error('Failed to generate Greetings PPP:', error);

      // Fallback to basic greetings deck
      loadGreetingsDeck();
      toast({
        title: "AI Generation Failed",
        description: "Loaded basic greetings lesson instead. You can try AI generation again later.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingGreetingsPPP(false);
    }
  };
  const generateLessonSlidesHTML = (lesson: any) => {
    if (lesson.slides_content?.slides) {
      // Create self-contained HTML with embedded slide viewer
      const slidesData = lesson.slides_content;
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${lesson.title} - Interactive Slides</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .slides-viewer {
              width: 95vw;
              max-width: 1400px;
              height: 90vh;
              background: white;
              border-radius: 20px;
              box-shadow: 0 25px 50px rgba(0,0,0,0.2);
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }
            .slide-header {
              background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
              color: white;
              padding: 20px 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .slide-title {
              font-size: 1.8em;
              font-weight: 700;
            }
            .slide-nav {
              display: flex;
              gap: 15px;
              align-items: center;
            }
            .nav-button {
              background: rgba(255,255,255,0.2);
              border: none;
              color: white;
              padding: 10px 20px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 500;
              transition: all 0.3s ease;
            }
            .nav-button:hover {
              background: rgba(255,255,255,0.3);
              transform: translateY(-2px);
            }
            .nav-button:disabled {
              opacity: 0.5;
              cursor: not-allowed;
              transform: none;
            }
            .slide-content {
              flex: 1;
              padding: 40px;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            .current-slide {
              text-align: center;
              animation: slideIn 0.5s ease-out;
            }
            @keyframes slideIn {
              from { opacity: 0; transform: translateX(20px); }
              to { opacity: 1; transform: translateX(0); }
            }
            .slide-number {
              font-size: 1.5em;
              font-weight: 600;
              color: #2563eb;
              margin-bottom: 20px;
            }
            .slide-activity-type {
              background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
              color: white;
              padding: 8px 20px;
              border-radius: 20px;
              font-size: 0.9em;
              font-weight: 500;
              display: inline-block;
              margin-bottom: 25px;
              text-transform: capitalize;
            }
            .slide-text {
              font-size: 1.3em;
              line-height: 1.6;
              color: #1e293b;
              margin-bottom: 30px;
              max-width: 800px;
              margin-left: auto;
              margin-right: auto;
            }
            .interactive-elements {
              display: flex;
              flex-wrap: wrap;
              gap: 15px;
              justify-content: center;
              margin: 20px 0;
            }
            .interactive-element {
              background: #f1f5f9;
              border: 2px solid #e2e8f0;
              padding: 15px 25px;
              border-radius: 12px;
              font-weight: 500;
              color: #475569;
              transition: all 0.3s ease;
              cursor: pointer;
            }
            .interactive-element:hover {
              background: #e2e8f0;
              border-color: #2563eb;
              color: #2563eb;
              transform: translateY(-2px);
            }
            .teacher-notes {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 20px;
              margin-top: 30px;
              border-radius: 8px;
              font-style: italic;
              color: #92400e;
            }
            .progress-bar {
              background: #e2e8f0;
              height: 6px;
              border-radius: 3px;
              overflow: hidden;
              margin-top: 10px;
            }
            .progress-fill {
              height: 100%;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              transition: width 0.5s ease;
            }
            .gamification-info {
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
              border: 1px solid #0ea5e9;
              padding: 20px;
              border-radius: 12px;
              margin-top: 20px;
              text-align: left;
            }
            .points-badge {
              background: #dc2626;
              color: white;
              padding: 5px 12px;
              border-radius: 15px;
              font-size: 0.8em;
              font-weight: 600;
              margin-right: 10px;
            }
            .badges {
              display: flex;
              gap: 10px;
              margin-top: 10px;
              flex-wrap: wrap;
            }
            .badge {
              background: #fbbf24;
              color: #92400e;
              padding: 5px 12px;
              border-radius: 15px;
              font-size: 0.8em;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="slides-viewer">
            <div class="slide-header">
              <h1 class="slide-title">${lesson.title}</h1>
              <div class="slide-nav">
                <span id="slide-counter">1 / ${slidesData.slides.length}</span>
                <button class="nav-button" onclick="previousSlide()" id="prev-btn">Previous</button>
                <button class="nav-button" onclick="nextSlide()" id="next-btn">Next</button>
              </div>
            </div>
            <div class="slide-content">
              <div id="current-slide" class="current-slide"></div>
              <div class="progress-bar">
                <div class="progress-fill" id="progress-fill" style="width: ${100 / slidesData.slides.length}%"></div>
              </div>
            </div>
          </div>

          <script>
            const slidesData = ${JSON.stringify(slidesData)};
            let currentSlideIndex = 0;

            function updateSlide() {
              const slide = slidesData.slides[currentSlideIndex];
              if (!slide) return;

              const slideHtml = \`
                <div class="slide-number">Slide \${currentSlideIndex + 1} of \${slidesData.slides.length}</div>
                <div class="slide-activity-type">\${slide.type.replace('_', ' ')}</div>
                <h2 style="font-size: 2.2em; margin-bottom: 20px; color: #1e293b;">\${slide.prompt || 'Lesson Content'}</h2>
                <div class="slide-text">\${slide.instructions || slide.prompt || 'Interactive learning content'}</div>
                
                \${slide.options && slide.options.length > 0 ? \`
                  <div class="interactive-elements">
                    \${slide.options.map(option => \`<div class="interactive-element">\${option.text}</div>\`).join('')}
                  </div>
                \` : ''}
              \`;

              document.getElementById('current-slide').innerHTML = slideHtml;
              document.getElementById('slide-counter').textContent = \`\${currentSlideIndex + 1} / \${slidesData.slides.length}\`;
              document.getElementById('progress-fill').style.width = \`\${((currentSlideIndex + 1) / slidesData.slides.length) * 100}%\`;
              
              // Update navigation buttons
              document.getElementById('prev-btn').disabled = currentSlideIndex === 0;
              document.getElementById('next-btn').disabled = currentSlideIndex === slidesData.slides.length - 1;
            }

            function nextSlide() {
              if (currentSlideIndex < slidesData.slides.length - 1) {
                currentSlideIndex++;
                updateSlide();
              }
            }

            function previousSlide() {
              if (currentSlideIndex > 0) {
                currentSlideIndex--;
                updateSlide();
              }
            }

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
              if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                nextSlide();
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                previousSlide();
              }
            });

            // Initialize first slide
            updateSlide();
          </script>
        </body>
        </html>
      `;
    }

    // Fallback to HTML content
    return generateLessonHTML(lesson);
  };
  const generateLessonHTML = (lesson: any) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${lesson.title}</title>
        <style>
          body { font-family: Inter, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .lesson-container { max-width: 900px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }
          .lesson-header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; }
          .lesson-title { font-size: 2.5em; font-weight: 700; margin: 0; }
          .lesson-content { padding: 40px; }
          .section { margin-bottom: 30px; background: #fafbfc; padding: 20px; border-radius: 15px; }
          .section-title { font-size: 1.5em; font-weight: 600; color: #1e293b; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="lesson-container">
          <div class="lesson-header">
            <h1 class="lesson-title">${lesson.title}</h1>
            <p>Interactive English Lesson • CEFR Level ${lesson.level_info?.cefr_level || 'B1'}</p>
          </div>
          <div class="lesson-content">
            <div class="section">
              <h2 class="section-title">📋 Lesson Overview</h2>
              <p><strong>Topic:</strong> ${lesson.topic}</p>
              <p><strong>Grammar Focus:</strong> ${lesson.grammar_focus}</p>
              <p><strong>Duration:</strong> ${lesson.estimated_duration} minutes</p>
            </div>
            <div class="section">
              <h2 class="section-title">🎯 Learning Objectives</h2>
              <ul>
                ${(lesson.lesson_objectives || []).map((obj: string) => `<li>${obj}</li>`).join('')}
              </ul>
            </div>
            <div class="section">
              <h2 class="section-title">💬 Communication Outcome</h2>
              <p>${lesson.communication_outcome}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  const initialContent: any[] = [];
  const {
    contentItems,
    selectedContent,
    setSelectedContent,
    isUploadDialogOpen,
    openUploadDialog,
    closeUploadDialog,
    handleEnhancedUpload,
    previewFile,
    openPreview,
    closePreview,
    handleFileDelete,
    handleFileDownload
  } = useEnhancedContentManager(initialContent, studentName, isTeacher);
  const handleAddToWhiteboard = async (content: ContentItem) => {
    if (content.type === "lesson" || content.type === "curriculum") {
      // Auto-generate slides if needed
      await loadLessonById(content.id);
      return;
    }

    // Handle file-based content
    const blob = new Blob([content.content || ''], {
      type: getContentType(content.fileType)
    });
    const url = URL.createObjectURL(blob);
    const newEmbeddedContent: EmbeddedContent = {
      id: content.id,
      title: content.title,
      url,
      x: Math.random() * 200,
      y: Math.random() * 200,
      width: 400,
      height: 300,
      fileType: content.fileType,
      originalType: content.type
    };
    setEmbeddedContent(prev => [...prev, newEmbeddedContent]);
    setActiveTab("whiteboard");
  };
  const getContentType = (fileType: string | undefined): string => {
    if (!fileType) return 'text/plain';
    const typeMap: {
      [key: string]: string;
    } = {
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'html': 'text/html',
      'txt': 'text/plain',
      'json': 'application/json'
    };
    return typeMap[fileType.toLowerCase()] || 'application/octet-stream';
  };
  const handleUpdateEmbeddedContent = (id: string, updates: Partial<EmbeddedContent>) => {
    setEmbeddedContent(prev => prev.map(content => content.id === id ? {
      ...content,
      ...updates
    } : content));
  };
  const handleRemoveEmbeddedContent = (id: string) => {
    setEmbeddedContent(prev => prev.filter(content => content.id !== id));
  };
  const addContentToWhiteboard = (content: any) => {
    console.log('🎯 Adding content to whiteboard:', content);
    handleAddToWhiteboard(content);
  };
  const handleLoadLesson = (lessonId: string) => {
    console.log('📚 Loading lesson in current tab:', lessonId);
    setActiveTab('lesson-viewer');
    loadLessonById(lessonId, true); // Always skip generation for direct lesson loading
  };
  return <div className="h-full" style={{
    backgroundColor: '#FBFBFB'
  }}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-4" style={{
        backgroundColor: 'rgba(232, 249, 255, 0.6)',
        border: '1px solid rgba(196, 217, 255, 0.4)'
      }}>
          <TabsTrigger value="whiteboard" className="flex items-center gap-2 transition-all duration-300" style={{
          color: '#4F46E5'
        }}>
            <PenTool size={16} />
            Whiteboard
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2 transition-all duration-300" style={{
          color: '#4F46E5'
        }}>
            <Upload size={16} />
            Content Library
          </TabsTrigger>
          <TabsTrigger value="lesson-viewer" className="flex items-center gap-2 transition-all duration-300" style={{
          color: '#4F46E5'
        }}>
            <BookOpen size={16} />
            Lesson
            {isGeneratingSlides && <Loader2 className="h-4 w-4 animate-spin ml-1" />}
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2 transition-all duration-300" style={{
          color: '#4F46E5'
        }}>
            <Gamepad2 size={16} />
            Assignments
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="whiteboard" className="h-full m-0">
            <div className="h-full relative">
              <EnhancedWhiteboardToolbar activeTool={activeTool} setActiveTool={setActiveTool} color={color} setColor={setColor} strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} activeShape={activeShape} setActiveShape={setActiveShape} />
              <div className="h-full pt-16">
                <EnhancedWhiteboardCanvas activeTool={activeTool} color={color} strokeWidth={strokeWidth} embeddedContent={embeddedContent} onRemoveEmbeddedContent={handleRemoveEmbeddedContent} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="h-full m-0">
            <div className="h-full">
              <EnhancedContentLibrary contentItems={contentItems} selectedContent={selectedContent} onSelectContent={setSelectedContent} onAddToWhiteboard={addContentToWhiteboard} onLoadLesson={handleLoadLesson} currentUser={currentUser || {
              id: 'default',
              role: isTeacher ? 'teacher' : 'student',
              name: studentName
            }} />
            </div>
          </TabsContent>

          <TabsContent value="lesson-viewer" className="h-full m-0">
            <div className="h-full">
              {currentLessonSlides ? <div className="h-full flex flex-col">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{currentLessonTitle}</h2>
                    
                  </div>
                  <div className="flex-1">
                    <LessonSlideViewer slides={currentLessonSlides} title={currentLessonTitle} lessonId={selectedContent?.id} studentId={currentUser?.id} isTeacher={isTeacher} />
                  </div>
                </div> : <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Lesson Selected</h3>
                    <p className="text-muted-foreground mb-4">
                      Select a lesson from the Content Library to view interactive slides
                    </p>
                  </div>
                </div>}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="h-full m-0">
            <div className="h-full">
              {isTeacher ? <TeacherAssignmentPanel /> : <StudentAssignmentPanel studentName={studentName} />}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <EnhancedUploadDialog isOpen={isUploadDialogOpen} onClose={closeUploadDialog} onUpload={handleEnhancedUpload} />

      
    </div>;
}