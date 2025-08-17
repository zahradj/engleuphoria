import { supabase } from '@/integrations/supabase/client';

export interface CurriculumLevel {
  id: string;
  name: string;
  cefr_level: string;
  level_order: number;
  description?: string;
  target_lessons?: number;
  estimated_hours?: number;
}

export interface SystematicLesson {
  id: string;
  curriculum_level_id: string;
  lesson_number: number;
  title: string;
  topic: string;
  grammar_focus?: string;
  vocabulary_set: string[];
  communication_outcome?: string;
  lesson_objectives: string[];
  slides_content: any;
  activities: any[];
  gamified_elements: any;
  is_review_lesson: boolean;
  prerequisite_lessons?: string[];
  difficulty_level: number;
  estimated_duration: number;
  status: 'draft' | 'published' | 'archived';
}

export interface StudentProgress {
  id: string;
  student_id: string;
  curriculum_level_id: string;
  current_lesson_number: number;
  completed_lessons: number[];
  mastered_vocabulary: string[];
  grammar_mastery: any;
  overall_progress_percentage: number;
  badges_earned: any[];
  total_points: number;
}

class CurriculumService {
  async getCurriculumLevels(): Promise<CurriculumLevel[]> {
    const { data, error } = await supabase
      .from('curriculum_levels')
      .select('*')
      .order('level_order');
    
    if (error) throw error;
    return data || [];
  }

  async getLessonsForLevel(levelId: string): Promise<SystematicLesson[]> {
    const { data, error } = await supabase
      .from('systematic_lessons')
      .select('*')
      .eq('curriculum_level_id', levelId)
      .order('lesson_number');
    
    if (error) throw error;
    return data || [];
  }

  async createSystematicLesson(lesson: Partial<SystematicLesson>): Promise<SystematicLesson> {
    const { data, error } = await supabase
      .from('systematic_lessons')
      .insert([lesson])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateLesson(id: string, updates: Partial<SystematicLesson>): Promise<SystematicLesson> {
    const { data, error } = await supabase
      .from('systematic_lessons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getStudentProgress(studentId: string, levelId: string): Promise<StudentProgress | null> {
    const { data, error } = await supabase
      .from('student_curriculum_progress')
      .select('*')
      .eq('student_id', studentId)
      .eq('curriculum_level_id', levelId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateStudentProgress(progress: Partial<StudentProgress>): Promise<StudentProgress> {
    const { data, error } = await supabase
      .from('student_curriculum_progress')
      .upsert([progress])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Template for lesson structure
  getLessonTemplate(): any {
    return {
      slides: [
        {
          type: 'title',
          title: '',
          objectives: []
        },
        {
          type: 'vocabulary',
          title: 'New Vocabulary',
          words: [],
          images: []
        },
        {
          type: 'grammar',
          title: 'Grammar Focus',
          explanation: '',
          examples: []
        },
        {
          type: 'activity',
          title: 'Interactive Practice',
          activity_type: 'drag_drop',
          content: {}
        },
        {
          type: 'speaking',
          title: 'Speaking Practice',
          dialogues: [],
          role_plays: []
        },
        {
          type: 'listening',
          title: 'Listening Practice',
          audio_url: '',
          questions: []
        },
        {
          type: 'writing',
          title: 'Writing Practice',
          prompts: [],
          guided_tasks: []
        },
        {
          type: 'review',
          title: 'Lesson Review',
          quiz_questions: [],
          badges: []
        }
      ],
      gamification: {
        points_available: 100,
        badges: [],
        progress_milestones: [],
        mini_games: []
      }
    };
  }

  // CEFR progression topics
  getCEFRTopics(level: string): string[] {
    const topics = {
      'Pre-A1': [
        'Greetings & Introductions', 'Numbers & Age', 'Classroom Objects', 'Colors',
        'Family Members', 'Body Parts', 'Daily Routines', 'Food & Drinks',
        'Animals', 'Clothes', 'Weather', 'Telling Time'
      ],
      'A1': [
        'Personal Information', 'Home & Family', 'Shopping', 'Food & Restaurants',
        'Travel & Transportation', 'Health', 'Work & Jobs', 'Hobbies',
        'Weather & Seasons', 'Directions', 'Past Activities', 'Future Plans'
      ],
      'A2': [
        'Past Experiences', 'Future Plans', 'Comparisons', 'Describing People',
        'Technology', 'Environment', 'Culture', 'Entertainment',
        'Education', 'Relationships', 'Problem Solving', 'Opinions'
      ],
      'B1': [
        'Work & Career', 'Education & Learning', 'Travel & Tourism', 'Health & Lifestyle',
        'Technology & Innovation', 'Environment & Nature', 'Arts & Culture', 'Social Issues',
        'Personal Development', 'Communication', 'Problem Solving', 'Decision Making'
      ],
      'B2': [
        'Global Issues', 'Scientific Topics', 'Business & Economics', 'Politics & Society',
        'Media & Communication', 'Innovation & Change', 'Ethics & Values', 'Psychology',
        'Philosophy', 'Academic Writing', 'Research Skills', 'Critical Thinking'
      ],
      'C1': [
        'Complex Social Issues', 'Academic Discourse', 'Professional Communication', 'Research & Analysis',
        'Abstract Concepts', 'Cultural Studies', 'Literature & Arts', 'Scientific Research',
        'Business Strategy', 'Leadership', 'Innovation', 'Global Perspectives'
      ],
      'C2': [
        'Advanced Academic Topics', 'Professional Expertise', 'Cultural Analysis', 'Literary Criticism',
        'Scientific Research', 'Philosophical Discourse', 'Advanced Business', 'Leadership',
        'Innovation & Creativity', 'Global Issues', 'Complex Communication', 'Mastery Tasks'
      ]
    };
    
    return topics[level as keyof typeof topics] || [];
  }
}

export const curriculumService = new CurriculumService();