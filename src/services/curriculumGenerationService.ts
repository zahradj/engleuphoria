import { neuroscientificContentService, NeuroEnhancedLesson } from './ai/neuroscientificContentService';
import { supabase } from '@/lib/supabase';

export interface CurriculumLevel {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  name: string;
  description: string;
  totalWeeks: number;
  lessonsPerWeek: number;
  totalLessons: number;
  skillTargets: string[];
  conversationGoals: string[];
  completionCriteria: string[];
}

export interface GeneratedCurriculum {
  id: string;
  level: CurriculumLevel;
  weeks: WeekPlan[];
  totalPages: number;
  estimatedStudyTime: number; // in hours
  neuroscientificFeatures: string[];
  progressionMap: ProgressionMapping;
  generatedAt: Date;
}

export interface WeekPlan {
  weekNumber: number;
  theme: string;
  learningObjectives: string[];
  lessons: NeuroEnhancedLesson[];
  weeklyAssessment: AssessmentPlan;
  conversationMilestones: string[];
  sentenceConstructionTargets: string[];
}

export interface AssessmentPlan {
  type: 'formative' | 'summative' | 'diagnostic';
  activities: string[];
  conversationTest: ConversationAssessment;
  grammarCheck: GrammarAssessment;
  vocabularyReview: VocabularyAssessment;
}

export interface ConversationAssessment {
  scenario: string;
  duration: number;
  requiredElements: string[];
  evaluationCriteria: string[];
}

export interface GrammarAssessment {
  structures: string[];
  contextualUse: boolean;
  accuracyTarget: number; // percentage
}

export interface VocabularyAssessment {
  activeWords: string[];
  passiveWords: string[];
  usageContexts: string[];
}

export interface ProgressionMapping {
  sentenceComplexity: {
    week1: string;
    week6: string;
    week12: string;
    finalTarget: string;
  };
  conversationAbility: {
    week1: string;
    week6: string;
    week12: string; 
    finalTarget: string;
  };
  vocabularySize: {
    starting: number;
    perWeek: number;
    finalTarget: number;
  };
}

export class CurriculumGenerationService {
  
  private curriculumLevels: CurriculumLevel[] = [
    {
      id: 'A1_FOUNDATION',
      level: 'A1',
      name: 'Foundation Builder',
      description: 'From zero to basic sentence construction and simple conversations',
      totalWeeks: 12,
      lessonsPerWeek: 4,
      totalLessons: 48,
      skillTargets: [
        'Basic sentence construction (Subject + Verb + Object)',
        'Present simple tense mastery',
        'Essential vocabulary (500 words)',
        'Basic questions and answers',
        'Simple conversation starters'
      ],
      conversationGoals: [
        'Introduce yourself and ask basic questions',
        'Talk about daily routines and preferences',
        'Express basic needs and wants',
        'Have 3-minute conversations about familiar topics'
      ],
      completionCriteria: [
        'Construct 10 different sentence patterns automatically',
        'Have 5-minute conversations about personal topics',
        'Use 400+ words actively in speech',
        'Ask and answer 20 common question types'
      ]
    },
    {
      id: 'A2_DEVELOPER',
      level: 'A2',
      name: 'Skill Developer', 
      description: 'Expanding communication range and building confidence',
      totalWeeks: 14,
      lessonsPerWeek: 4,
      totalLessons: 56,
      skillTargets: [
        'Past and future tense integration',
        'Complex sentence building with connectors',
        'Expanded vocabulary (1000 words)',
        'Opinion expression and justification',
        'Storytelling abilities'
      ],
      conversationGoals: [
        'Tell stories about past experiences',
        'Express and defend opinions',
        'Make plans and arrangements',
        'Handle social and practical situations'
      ],
      completionCriteria: [
        'Tell 5-minute stories using past, present, and future',
        'Express opinions with supporting reasons',
        'Handle 15 different conversation scenarios',
        'Use 800+ words actively'
      ]
    },
    {
      id: 'B1_COMMUNICATOR',
      level: 'B1',
      name: 'Confident Communicator',
      description: 'Independent communication in most everyday situations',
      totalWeeks: 16,
      lessonsPerWeek: 3,
      totalLessons: 48,
      skillTargets: [
        'Complex grammar integration',
        'Advanced conversation management',
        'Professional and academic language',
        'Cultural communication awareness',
        'Problem-solving in English'
      ],
      conversationGoals: [
        'Participate in group discussions',
        'Handle professional meetings',
        'Resolve conflicts through communication',
        'Present ideas persuasively'
      ],
      completionCriteria: [
        'Lead 20-minute discussions confidently',
        'Present complex ideas clearly',
        'Use 1500+ words actively',
        'Handle unexpected conversation topics'
      ]
    },
    {
      id: 'B2_FLUENT',
      level: 'B2',
      name: 'Fluent Speaker',
      description: 'Advanced fluency with sophisticated expression',
      totalWeeks: 18,
      lessonsPerWeek: 3,
      totalLessons: 54,
      skillTargets: [
        'Sophisticated language structures',
        'Advanced discourse management',
        'Nuanced meaning expression',
        'Professional presentation skills',
        'Cross-cultural communication'
      ],
      conversationGoals: [
        'Debate complex topics effectively',
        'Give professional presentations',
        'Negotiate and persuade',
        'Adapt communication style to context'
      ],
      completionCriteria: [
        'Debate for 30+ minutes with sophisticated arguments',
        'Present professionally for 20+ minutes',
        'Use 2500+ words actively',
        'Communicate naturally in any social context'
      ]
    },
    {
      id: 'C1_ADVANCED',
      level: 'C1', 
      name: 'Advanced Master',
      description: 'Near-native proficiency with academic and professional excellence',
      totalWeeks: 20,
      lessonsPerWeek: 2,
      totalLessons: 40,
      skillTargets: [
        'Native-like expression patterns',
        'Academic and professional mastery',
        'Sophisticated rhetorical devices',
        'Cultural nuance understanding',
        'Leadership communication'
      ],
      conversationGoals: [
        'Lead complex negotiations',
        'Give academic lectures',
        'Participate in intellectual debates',
        'Mentor others in English'
      ],
      completionCriteria: [
        'Communicate indistinguishably from educated natives',
        'Handle any professional or academic situation',
        'Use 4000+ words actively',
        'Teach English concepts to others'
      ]
    },
    {
      id: 'C2_MASTERY',
      level: 'C2',
      name: 'Language Master',
      description: 'Complete mastery with native-level sophistication',
      totalWeeks: 24,
      lessonsPerWeek: 2,
      totalLessons: 48,
      skillTargets: [
        'Complete native-level proficiency',
        'Masterful rhetorical expression',
        'Cultural and linguistic sophistication',
        'Professional expertise in English',
        'Teaching and mentoring abilities'
      ],
      conversationGoals: [
        'Excel in any communication context',
        'Demonstrate thought leadership',
        'Inspire and influence through language',
        'Create original content in English'
      ],
      completionCriteria: [
        'Indistinguishable from educated native speakers',
        'Excel in highest-level professional contexts',
        'Use 6000+ words actively',
        'Create and publish original English content'
      ]
    }
  ];

  async generateCompleteCurriculum(level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'): Promise<GeneratedCurriculum> {
    console.log(`🚀 Generating complete ${level} curriculum with neuroscientific enhancement...`);
    
    const curriculumLevel = this.curriculumLevels.find(cl => cl.level === level);
    if (!curriculumLevel) {
      throw new Error(`Curriculum level ${level} not found`);
    }

    const weeks: WeekPlan[] = [];
    let totalPages = 0;

    // Generate each week's content
    for (let weekNumber = 1; weekNumber <= curriculumLevel.totalWeeks; weekNumber++) {
      console.log(`📚 Generating week ${weekNumber}/${curriculumLevel.totalWeeks}...`);
      
      const weekPlan = await this.generateWeekPlan(curriculumLevel, weekNumber);
      weeks.push(weekPlan);
      
      // Count total pages (each lesson has 20 pages)
      totalPages += weekPlan.lessons.length * 20;
    }

    const curriculum: GeneratedCurriculum = {
      id: `${level}_CURRICULUM_${Date.now()}`,
      level: curriculumLevel,
      weeks,
      totalPages,
      estimatedStudyTime: this.calculateStudyTime(curriculumLevel),
      neuroscientificFeatures: this.getNeuroscientificFeatures(),
      progressionMap: this.createProgressionMap(curriculumLevel),
      generatedAt: new Date()
    };

    // Save to database
    await this.saveCurriculumToDatabase(curriculum);
    
    console.log(`✅ ${level} curriculum generated: ${totalPages} pages, ${curriculum.estimatedStudyTime} hours`);
    
    return curriculum;
  }

  private async generateWeekPlan(curriculumLevel: CurriculumLevel, weekNumber: number): Promise<WeekPlan> {
    const theme = this.getWeekTheme(curriculumLevel.level, weekNumber);
    const lessons: NeuroEnhancedLesson[] = [];

    // Generate lessons for this week
    for (let dayNumber = 1; dayNumber <= curriculumLevel.lessonsPerWeek; dayNumber++) {
      const lesson = neuroscientificContentService.generateNeuroEnhancedLesson(
        curriculumLevel.level,
        weekNumber,
        dayNumber,
        theme
      );
      lessons.push(lesson);
    }

    return {
      weekNumber,
      theme,
      learningObjectives: this.generateWeeklyObjectives(curriculumLevel.level, weekNumber, theme),
      lessons,
      weeklyAssessment: this.generateWeeklyAssessment(curriculumLevel.level, weekNumber, theme),
      conversationMilestones: this.generateConversationMilestones(curriculumLevel.level, weekNumber),
      sentenceConstructionTargets: this.generateSentenceTargets(curriculumLevel.level, weekNumber)
    };
  }

  private getWeekTheme(level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2', weekNumber: number): string {
    const themes = {
      A1: [
        "Self & Family", "Home & Environment", "Daily Activities", "Food & Meals",
        "Shopping & Money", "Health & Body", "Time & Dates", "Transport",
        "Weather & Seasons", "Hobbies & Free Time", "Work & School", "Travel Basics"
      ],
      A2: [
        "Personal History", "Education & Learning", "Technology & Internet", "Entertainment",
        "Relationships", "Lifestyle & Habits", "Environment & Nature", "Culture & Traditions",
        "Plans & Dreams", "Problems & Solutions", "Opinions & Preferences", "Future Goals",
        "Communication Styles", "Social Situations"
      ],
      B1: [
        "Career & Ambitions", "Social Issues", "Media & Information", "Innovation & Change",
        "Global Awareness", "Personal Development", "Community & Society", "Ethics & Values",
        "Communication Styles", "Conflict Resolution", "Leadership & Teamwork", "Cultural Exchange",
        "Professional Skills", "Academic Thinking", "Creative Expression", "Critical Analysis"
      ],
      B2: [
        "Professional Excellence", "Economic Issues", "Scientific Progress", "Political Systems",
        "Environmental Challenges", "Psychological Insights", "Historical Perspectives", "Artistic Expression",
        "Philosophical Questions", "Social Movements", "Technological Impact", "Global Citizenship",
        "Business Strategy", "Research Methods", "Cross-cultural Competence", "Innovation Leadership",
        "Ethical Decision Making", "Future Planning"
      ],
      C1: [
        "Strategic Leadership", "Complex Analysis", "Research Excellence", "Academic Mastery",
        "Critical Evaluation", "Theoretical Frameworks", "Policy Development", "Innovation Management",
        "Cross-cultural Leadership", "Ethical Governance", "Systems Thinking", "Future Visioning",
        "Intellectual Discourse", "Professional Mentoring", "Creative Innovation", "Global Strategy",
        "Cultural Intelligence", "Thought Leadership", "Academic Publishing", "Executive Communication"
      ],
      C2: [
        "Mastery & Expertise", "Thought Leadership", "Complex Negotiations", "Advanced Discourse",
        "Sophisticated Analysis", "Cultural Sophistication", "Intellectual Debate", "Strategic Communication",
        "Philosophical Mastery", "Academic Excellence", "Professional Mastery", "Global Leadership",
        "Cultural Ambassadorship", "Intellectual Innovation", "Strategic Visioning", "Masterful Expression",
        "Cultural Bridge-building", "Educational Leadership", "International Diplomacy", "Creative Mastery",
        "Legacy Building", "Wisdom Sharing", "Global Impact", "Transformational Leadership"
      ]
    };

    const levelThemes = themes[level];
    return levelThemes[(weekNumber - 1) % levelThemes.length];
  }

  private generateWeeklyObjectives(level: string, weekNumber: number, theme: string): string[] {
    return [
      `Master 20 new vocabulary words related to ${theme}`,
      `Use week's grammar pattern in 10 different sentence types`,
      `Have 3 meaningful conversations about ${theme}`,
      `Complete sentence construction challenge`,
      `Demonstrate understanding through practical application`
    ];
  }

  private generateWeeklyAssessment(level: string, weekNumber: number, theme: string): AssessmentPlan {
    return {
      type: weekNumber % 4 === 0 ? 'summative' : 'formative',
      activities: [
        'Vocabulary recognition and usage test',
        'Grammar construction exercise',
        'Listening comprehension with theme content',
        'Written expression using week\'s language'
      ],
      conversationTest: {
        scenario: `Real-life situation involving ${theme}`,
        duration: this.getConversationDuration(level),
        requiredElements: [
          'Use week\'s vocabulary naturally',
          'Apply grammar patterns correctly',
          'Maintain conversation flow',
          'Show personality and opinions'
        ],
        evaluationCriteria: [
          'Fluency and naturalness',
          'Accuracy of new language',
          'Communication effectiveness',
          'Confidence and engagement'
        ]
      },
      grammarCheck: {
        structures: [`Week ${weekNumber} grammar pattern`, 'Previous patterns integration'],
        contextualUse: true,
        accuracyTarget: this.getAccuracyTarget(level)
      },
      vocabularyReview: {
        activeWords: this.getActiveVocabTarget(level),
        passiveWords: this.getPassiveVocabTarget(level),
        usageContexts: [`${theme} contexts`, 'Cross-topic integration']
      }
    };
  }

  private generateConversationMilestones(level: string, weekNumber: number): string[] {
    const baseDuration = this.getConversationDuration(level);
    return [
      `Maintain ${baseDuration}-minute conversation about week's theme`,
      `Ask 5+ meaningful questions during conversation`,
      `Express personal opinions with supporting reasons`,
      `Handle unexpected questions confidently`,
      `Use new vocabulary naturally in context`
    ];
  }

  private generateSentenceTargets(level: string, weekNumber: number): string[] {
    const complexity = this.getSentenceComplexity(level, weekNumber);
    return [
      `Construct ${complexity.count} different sentence patterns`,
      `Use ${complexity.elements} language elements per sentence`,
      `Create sentences of ${complexity.length} average length`,
      `Combine grammar patterns from multiple weeks`,
      `Express complex ideas using simple structures`
    ];
  }

  private getConversationDuration(level: string): number {
    const durations = { A1: 3, A2: 5, B1: 10, B2: 15, C1: 20, C2: 30 };
    return durations[level as keyof typeof durations] || 5;
  }

  private getAccuracyTarget(level: string): number {
    const targets = { A1: 70, A2: 75, B1: 80, B2: 85, C1: 90, C2: 95 };
    return targets[level as keyof typeof targets] || 75;
  }

  private getActiveVocabTarget(level: string): string[] {
    return ['Week\'s 20 new words', 'Previous weeks\' review', 'Cross-topic connections'];
  }

  private getPassiveVocabTarget(level: string): string[] {
    return ['Extended word families', 'Synonyms and antonyms', 'Contextual variations'];
  }

  private getSentenceComplexity(level: string, weekNumber: number): {count: number, elements: number, length: string} {
    const complexities = {
      A1: { count: 5, elements: 3, length: '5-8 words' },
      A2: { count: 8, elements: 4, length: '8-12 words' },
      B1: { count: 10, elements: 5, length: '12-15 words' },
      B2: { count: 12, elements: 6, length: '15-20 words' },
      C1: { count: 15, elements: 7, length: '20-25 words' },
      C2: { count: 20, elements: 8, length: '25+ words' }
    };
    return complexities[level as keyof typeof complexities] || complexities.A1;
  }

  private calculateStudyTime(curriculumLevel: CurriculumLevel): number {
    // 30 minutes per lesson + 30 minutes homework + 60 minutes weekly review
    const lessonTime = curriculumLevel.totalLessons * 0.5; // 30 min lessons
    const homeworkTime = curriculumLevel.totalLessons * 0.5; // 30 min homework
    const reviewTime = curriculumLevel.totalWeeks * 1; // 1 hour weekly review
    
    return lessonTime + homeworkTime + reviewTime;
  }

  private getNeuroscientificFeatures(): string[] {
    return [
      'Spaced repetition at optimal intervals (1min, 5min, 15min, end)',
      'Motor cortex activation through physical vocabulary gestures',
      'Emotional engagement through personal connection activities',
      'Attention optimization with 7-segment lesson structure',
      'Memory consolidation through teach-back methods',
      'Pattern recognition enhancement through structured repetition',
      'Social learning activation through peer interaction',
      'Primacy and recency effect utilization'
    ];
  }

  private createProgressionMap(curriculumLevel: CurriculumLevel): ProgressionMapping {
    const level = curriculumLevel.level;
    
    const sentenceProgression = {
      A1: {
        week1: 'Subject + Verb (I am)',
        week6: 'Subject + Verb + Object (I like coffee)',
        week12: 'Subject + Verb + Object + Time (I eat breakfast at 8am)',
        finalTarget: 'Basic sentences with time, place, and manner'
      },
      A2: {
        week1: 'Simple sentences with past/present/future',
        week6: 'Connected sentences with because/but/and',
        week12: 'Complex sentences with relative clauses',
        finalTarget: 'Fluent paragraph-level expression'
      },
      B1: {
        week1: 'Multi-clause sentences with connectors',
        week6: 'Conditional and hypothetical structures',
        week12: 'Advanced reporting and opinion expression',
        finalTarget: 'Sophisticated discourse-level communication'
      }
    };

    const conversationProgression = {
      A1: {
        week1: '30-second personal introductions',
        week6: '2-minute topic discussions',
        week12: '5-minute natural conversations',
        finalTarget: '10-minute flowing conversations on familiar topics'
      },
      A2: {
        week1: '3-minute experience sharing',
        week6: '7-minute opinion exchanges',
        week12: '12-minute debates and discussions',
        finalTarget: '20-minute natural conversations on varied topics'
      },
      B1: {
        week1: '10-minute complex discussions',
        week6: '20-minute presentations',
        week12: '30-minute group facilitation',
        finalTarget: 'Unlimited natural conversation ability'
      }
    };

    const vocabularyProgression = {
      A1: { starting: 100, perWeek: 20, finalTarget: 500 },
      A2: { starting: 500, perWeek: 25, finalTarget: 1000 },
      B1: { starting: 1000, perWeek: 30, finalTarget: 2000 },
      B2: { starting: 2000, perWeek: 35, finalTarget: 3500 },
      C1: { starting: 3500, perWeek: 40, finalTarget: 5000 },
      C2: { starting: 5000, perWeek: 50, finalTarget: 8000 }
    };

    return {
      sentenceComplexity: sentenceProgression[level] || sentenceProgression.A1,
      conversationAbility: conversationProgression[level] || conversationProgression.A1,
      vocabularySize: vocabularyProgression[level] || vocabularyProgression.A1
    };
  }

  private async saveCurriculumToDatabase(curriculum: GeneratedCurriculum): Promise<void> {
    try {
      // Save curriculum metadata
      const { data: curriculumData, error: curriculumError } = await supabase
        .from('generated_curriculums')
        .insert({
          id: curriculum.id,
          level: curriculum.level.level,
          total_pages: curriculum.totalPages,
          estimated_study_time: curriculum.estimatedStudyTime,
          neuroscientific_features: curriculum.neuroscientificFeatures,
          progression_map: curriculum.progressionMap,
          curriculum_data: curriculum
        });

      if (curriculumError) throw curriculumError;

      console.log('✅ Curriculum saved to database');
    } catch (error) {
      console.error('❌ Failed to save curriculum:', error);
      // Continue without database save for now
    }
  }

  // API methods for frontend integration
  async getCurriculumProgress(studentId: string, curriculumId: string) {
    // Track student progress through curriculum
    const { data, error } = await supabase
      .from('student_curriculum_progress')
      .select('*')
      .eq('student_id', studentId)
      .eq('curriculum_id', curriculumId)
      .single();

    return { data, error };
  }

  async updateLessonCompletion(studentId: string, lessonId: string, completionData: any) {
    // Update lesson completion and progress
    const { data, error } = await supabase
      .from('lesson_completions')
      .upsert({
        student_id: studentId,
        lesson_id: lessonId,
        completion_data: completionData,
        completed_at: new Date().toISOString()
      });

    return { data, error };
  }

  async generatePersonalizedContent(studentId: string, lessonId: string, adaptations: any) {
    // Generate personalized content based on student performance
    return neuroscientificContentService.generateNeuroEnhancedLesson(
      adaptations.level,
      adaptations.weekNumber,
      adaptations.dayNumber,
      adaptations.preferredTheme
    );
  }
}

export const curriculumGenerationService = new CurriculumGenerationService();