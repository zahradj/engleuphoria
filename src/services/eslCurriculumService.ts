import { ESLLevel, ESLSkill, ESLCollection, ESLMaterial, StudentProgress, Badge, AITemplate } from '@/types/eslCurriculum';

class ESLCurriculumService {
  private levels: ESLLevel[] = [
    {
      id: 'starter',
      name: 'Starter',
      cefrLevel: 'Pre-A1',
      ageGroup: '4-7 years / True Beginners',
      description: 'Basic vocabulary, greetings, ABCs, colors, numbers, songs, classroom language',
      levelOrder: 1,
      skills: [
        { id: 'starter_abc', name: 'Alphabet & Phonics', category: 'pronunciation', description: 'Learning ABCs and basic sounds', canStudentPractice: true, ageAppropriate: true, vocabularyThemes: ['alphabet', 'phonics'] },
        { id: 'starter_colors', name: 'Colors & Shapes', category: 'vocabulary', description: 'Basic colors and simple shapes', canStudentPractice: true, ageAppropriate: true, vocabularyThemes: ['colors', 'shapes'] },
        { id: 'starter_numbers', name: 'Numbers 1-20', category: 'vocabulary', description: 'Counting and basic numbers', canStudentPractice: true, ageAppropriate: true, vocabularyThemes: ['numbers', 'counting'] },
        { id: 'starter_greetings', name: 'Basic Greetings', category: 'speaking', description: 'Hello, goodbye, please, thank you', canStudentPractice: true, ageAppropriate: true, vocabularyThemes: ['greetings', 'politeness'] },
        { id: 'starter_songs', name: 'English Songs', category: 'songs', description: 'Simple English songs and chants', canStudentPractice: true, ageAppropriate: true, vocabularyThemes: ['music', 'rhythm'] }
      ],
      xpRequired: 0,
      estimatedHours: 60
    },
    {
      id: 'beginner',
      name: 'Beginner',
      cefrLevel: 'A1',
      ageGroup: '6-9 years',
      description: 'Can understand and use everyday expressions, basic grammar (to be, have got, simple present), short sentences',
      levelOrder: 2,
      skills: [
        { id: 'a1_vocab', name: 'Everyday Vocabulary', category: 'vocabulary', description: 'Family, animals, food, body parts', canStudentPractice: true, ageAppropriate: true, vocabularyThemes: ['family', 'animals', 'food', 'body'] },
        { id: 'a1_grammar_be', name: 'Verb "To Be"', category: 'grammar', description: 'I am, you are, he/she is', canStudentPractice: true, ageAppropriate: true, grammarPoints: ['to be', 'subject pronouns'] },
        { id: 'a1_present_simple', name: 'Simple Present', category: 'grammar', description: 'Basic present tense verbs', canStudentPractice: true, ageAppropriate: true, grammarPoints: ['present simple', 'daily routines'] },
        { id: 'a1_questions', name: 'Simple Questions', category: 'speaking', description: 'What, where, who questions', canStudentPractice: true, ageAppropriate: true, grammarPoints: ['wh-questions', 'yes/no questions'] },
        { id: 'a1_listening', name: 'Basic Listening', category: 'listening', description: 'Understanding simple instructions', canStudentPractice: true, ageAppropriate: true, vocabularyThemes: ['classroom language', 'instructions'] }
      ],
      xpRequired: 800,
      estimatedHours: 80
    },
    {
      id: 'elementary',
      name: 'Elementary',
      cefrLevel: 'A1+',
      ageGroup: '8-11 years',
      description: 'Descriptions, routines, questions, present continuous, prepositions, modals (can), vocabulary (family, food, hobbies)',
      levelOrder: 3,
      skills: [
        { id: 'a1plus_continuous', name: 'Present Continuous', category: 'grammar', description: 'I am doing, she is playing', canStudentPractice: true, ageAppropriate: true, grammarPoints: ['present continuous', 'ing forms'] },
        { id: 'a1plus_prepositions', name: 'Prepositions', category: 'grammar', description: 'In, on, under, next to', canStudentPractice: true, ageAppropriate: true, grammarPoints: ['prepositions of place', 'prepositions of time'] },
        { id: 'a1plus_can', name: 'Modal "Can"', category: 'grammar', description: 'I can swim, can you...?', canStudentPractice: true, ageAppropriate: true, grammarPoints: ['can for ability', 'can for permission'] },
        { id: 'a1plus_hobbies', name: 'Hobbies & Activities', category: 'vocabulary', description: 'Sports, games, free time activities', canStudentPractice: true, ageAppropriate: true, vocabularyThemes: ['hobbies', 'sports', 'free time'] },
        { id: 'a1plus_descriptions', name: 'Simple Descriptions', category: 'speaking', description: 'Describing people and objects', canStudentPractice: true, ageAppropriate: true, vocabularyThemes: ['adjectives', 'descriptions'] }
      ],
      xpRequired: 1600,
      estimatedHours: 100
    },
    {
      id: 'pre_intermediate',
      name: 'Pre-Intermediate',
      cefrLevel: 'A2+',
      ageGroup: '9-13 years',
      description: 'Talking about past (Past Simple), future (going to), comparisons, asking for/giving directions, irregular verbs',
      levelOrder: 4,
      skills: [
        { id: 'a2plus_past', name: 'Past Simple', category: 'grammar', description: 'Regular and irregular past tense', canStudentPractice: true, ageAppropriate: true, grammarPoints: ['past simple', 'irregular verbs', 'time expressions'] },
        { id: 'a2plus_future', name: 'Going To Future', category: 'grammar', description: 'Plans and predictions', canStudentPractice: true, ageAppropriate: true, grammarPoints: ['going to', 'future plans', 'predictions'] },
        { id: 'a2plus_comparisons', name: 'Comparatives', category: 'grammar', description: 'Bigger, smaller, more interesting', canStudentPractice: true, ageAppropriate: true, grammarPoints: ['comparative adjectives', 'superlatives'] },
        { id: 'a2plus_directions', name: 'Directions', category: 'speaking', description: 'Asking for and giving directions', canStudentPractice: true, ageAppropriate: true, vocabularyThemes: ['places in town', 'directions', 'transport'] },
        { id: 'a2plus_reading', name: 'Story Reading', category: 'reading', description: 'Short stories and texts', canStudentPractice: true, ageAppropriate: true, vocabularyThemes: ['stories', 'comprehension'] }
      ],
      xpRequired: 2500,
      estimatedHours: 120
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      cefrLevel: 'B1',
      ageGroup: '12-15 years',
      description: 'Express opinions, describe experiences, Present Perfect, First Conditional, modal verbs, complex questions',
      levelOrder: 5,
      skills: [
        { id: 'b1_present_perfect', name: 'Present Perfect', category: 'grammar', description: 'Have/has + past participle', canStudentPractice: true, ageAppropriate: true, grammarPoints: ['present perfect', 'ever/never', 'just/already/yet'] },
        { id: 'b1_conditionals', name: 'First Conditional', category: 'grammar', description: 'If + present, will + infinitive', canStudentPractice: true, ageAppropriate: true, grammarPoints: ['first conditional', 'real possibilities'] },
        { id: 'b1_opinions', name: 'Expressing Opinions', category: 'speaking', description: 'I think, I believe, in my opinion', canStudentPractice: true, ageAppropriate: true, vocabularyThemes: ['opinion expressions', 'agreeing/disagreeing'] },
        { id: 'b1_modals', name: 'Modal Verbs', category: 'grammar', description: 'Should, must, might, could', canStudentPractice: true, ageAppropriate: true, grammarPoints: ['modal verbs', 'obligation', 'possibility'] },
        { id: 'b1_experiences', name: 'Life Experiences', category: 'speaking', description: 'Talking about experiences and travel', canStudentPractice: true, ageAppropriate: true, vocabularyThemes: ['travel', 'experiences', 'culture'] }
      ],
      xpRequired: 3500,
      estimatedHours: 140
    },
    {
      id: 'upper_intermediate',
      name: 'Upper-Intermediate',
      cefrLevel: 'B1+',
      ageGroup: '13-16 years',
      description: 'Debates, reading longer texts, phrasal verbs, Second Conditional, passive voice, reported speech',
      levelOrder: 6,
      skills: [
        { id: 'b1plus_passive', name: 'Passive Voice', category: 'grammar', description: 'The house was built in 1990', canStudentPractice: true, ageAppropriate: true, grammarPoints: ['passive voice', 'by agent'] },
        { id: 'b1plus_reported', name: 'Reported Speech', category: 'grammar', description: 'He said that...', canStudentPractice: true, ageAppropriate: true, grammarPoints: ['reported speech', 'tense changes'] },
        { id: 'b1plus_second_conditional', name: 'Second Conditional', category: 'grammar', description: 'If I were you, I would...', canStudentPractice: true, ageAppropriate: true, grammarPoints: ['second conditional', 'hypothetical situations'] },
        { id: 'b1plus_phrasal', name: 'Phrasal Verbs', category: 'vocabulary', description: 'Get up, put on, take off', canStudentPractice: true, ageAppropriate: true, vocabularyThemes: ['phrasal verbs', 'separable/inseparable'] },
        { id: 'b1plus_debates', name: 'Debates & Discussion', category: 'speaking', description: 'Formal discussions and debates', canStudentPractice: true, ageAppropriate: true, vocabularyThemes: ['debate language', 'formal expressions'] }
      ],
      xpRequired: 4800,
      estimatedHours: 160
    },
    {
      id: 'advanced',
      name: 'Advanced',
      cefrLevel: 'B2+',
      ageGroup: 'Teens & Adults',
      description: 'Complex grammar, writing essays, understanding idioms, abstract conversation, exam prep (TOEFL, IELTS)',
      levelOrder: 7,
      skills: [
        { id: 'b2plus_complex_grammar', name: 'Complex Grammar', category: 'grammar', description: 'Advanced tenses and structures', canStudentPractice: true, ageAppropriate: false, grammarPoints: ['perfect continuous', 'mixed conditionals', 'subjunctive'] },
        { id: 'b2plus_essay_writing', name: 'Essay Writing', category: 'writing', description: 'Academic and formal writing', canStudentPractice: true, ageAppropriate: false, vocabularyThemes: ['academic vocabulary', 'essay structure'] },
        { id: 'b2plus_idioms', name: 'Idioms & Expressions', category: 'vocabulary', description: 'Common English idioms', canStudentPractice: true, ageAppropriate: false, vocabularyThemes: ['idioms', 'collocations'] },
        { id: 'b2plus_exam_prep', name: 'Exam Preparation', category: 'exam_prep', description: 'TOEFL, IELTS, Cambridge preparation', canStudentPractice: true, ageAppropriate: false, vocabularyThemes: ['exam strategies', 'test techniques'] },
        { id: 'b2plus_abstract', name: 'Abstract Topics', category: 'speaking', description: 'Discussing complex and abstract ideas', canStudentPractice: true, ageAppropriate: false, vocabularyThemes: ['abstract concepts', 'philosophy'] }
      ],
      xpRequired: 6500,
      estimatedHours: 180
    },
    {
      id: 'fluent',
      name: 'Fluent/Proficient',
      cefrLevel: 'C1',
      ageGroup: 'Adults / Advanced Teens',
      description: 'Academic writing, critical thinking, native-like fluency, full autonomy in speaking and writing',
      levelOrder: 8,
      skills: [
        { id: 'c1_academic_writing', name: 'Academic Writing', category: 'writing', description: 'Research papers and academic texts', canStudentPractice: true, ageAppropriate: false, vocabularyThemes: ['academic register', 'research terminology'] },
        { id: 'c1_critical_thinking', name: 'Critical Analysis', category: 'reading', description: 'Analyzing complex texts critically', canStudentPractice: true, ageAppropriate: false, vocabularyThemes: ['critical thinking', 'analysis'] },
        { id: 'c1_native_fluency', name: 'Native-like Fluency', category: 'speaking', description: 'Spontaneous and natural communication', canStudentPractice: true, ageAppropriate: false, vocabularyThemes: ['natural expressions', 'cultural nuances'] },
        { id: 'c1_professional', name: 'Professional Communication', category: 'speaking', description: 'Business and professional contexts', canStudentPractice: true, ageAppropriate: false, vocabularyThemes: ['business English', 'professional skills'] },
        { id: 'c1_literature', name: 'Literature Analysis', category: 'reading', description: 'Understanding and analyzing literature', canStudentPractice: true, ageAppropriate: false, vocabularyThemes: ['literary devices', 'literary analysis'] }
      ],
      xpRequired: 8500,
      estimatedHours: 200
    }
  ];

  private aiTemplates: AITemplate[] = [
    {
      id: 'vocab_worksheet_kids',
      name: 'Kids Vocabulary Worksheet',
      type: 'worksheet',
      prompt: 'Create a colorful, age-appropriate vocabulary worksheet for {level} students aged {ageGroup} on the topic of {topic}. Include {exerciseCount} fun exercises like matching pictures, coloring, and simple games.',
      parameters: [
        { name: 'topic', type: 'text', required: true, description: 'Vocabulary topic (e.g., animals, colors, family)' },
        { name: 'level', type: 'select', required: true, options: ['Starter', 'Beginner', 'Elementary'], description: 'ESL level' },
        { name: 'ageGroup', type: 'select', required: true, options: ['4-7 years', '6-9 years', '8-11 years'], description: 'Age group' },
        { name: 'exerciseCount', type: 'number', required: false, defaultValue: 4, description: 'Number of exercises' }
      ],
      outputFormat: 'kid_friendly_worksheet',
      estimatedGenerationTime: 25,
      ageGroups: ['4-7 years', '6-9 years', '8-11 years'],
      minAge: 4,
      maxAge: 11
    },
    {
      id: 'teen_grammar_activity',
      name: 'Teen Grammar Activity',
      type: 'activity',
      prompt: 'Generate an engaging grammar activity for {grammarPoint} suitable for {level} teenagers aged {ageGroup}. Include real-life contexts and {practiceItems} interactive exercises.',
      parameters: [
        { name: 'grammarPoint', type: 'text', required: true, description: 'Grammar topic (e.g., present perfect, conditionals)' },
        { name: 'level', type: 'select', required: true, options: ['Pre-Intermediate', 'Intermediate', 'Upper-Intermediate'], description: 'ESL level' },
        { name: 'ageGroup', type: 'select', required: true, options: ['9-13 years', '12-15 years', '13-16 years'], description: 'Age group' },
        { name: 'practiceItems', type: 'number', required: false, defaultValue: 8, description: 'Number of practice items' }
      ],
      outputFormat: 'teen_interactive_activity',
      estimatedGenerationTime: 35,
      ageGroups: ['9-13 years', '12-15 years', '13-16 years'],
      minAge: 9,
      maxAge: 16
    },
    {
      id: 'adult_exam_prep',
      name: 'Adult Exam Preparation',
      type: 'exam_prep',
      prompt: 'Create comprehensive {examType} preparation material for {level} adult learners. Include {sectionCount} practice sections with detailed explanations and strategies.',
      parameters: [
        { name: 'examType', type: 'select', required: true, options: ['TOEFL', 'IELTS', 'Cambridge FCE', 'Cambridge CAE'], description: 'Exam type' },
        { name: 'level', type: 'select', required: true, options: ['Advanced', 'Fluent/Proficient'], description: 'ESL level' },
        { name: 'sectionCount', type: 'number', required: false, defaultValue: 4, description: 'Number of practice sections' }
      ],
      outputFormat: 'exam_prep_material',
      estimatedGenerationTime: 60,
      ageGroups: ['Adults', 'Advanced Teens'],
      minAge: 16,
      maxAge: 99
    },
    {
      id: 'interactive_song',
      name: 'Interactive Song Activity',
      type: 'song',
      prompt: 'Create an interactive song-based learning activity for {level} children aged {ageGroup}. Include lyrics, actions, and {activityCount} follow-up activities related to {theme}.',
      parameters: [
        { name: 'theme', type: 'text', required: true, description: 'Song theme (e.g., numbers, colors, animals)' },
        { name: 'level', type: 'select', required: true, options: ['Starter', 'Beginner'], description: 'ESL level' },
        { name: 'ageGroup', type: 'select', required: true, options: ['4-7 years', '6-9 years'], description: 'Age group' },
        { name: 'activityCount', type: 'number', required: false, defaultValue: 3, description: 'Number of activities' }
      ],
      outputFormat: 'interactive_song',
      estimatedGenerationTime: 30,
      ageGroups: ['4-7 years', '6-9 years'],
      minAge: 4,
      maxAge: 9
    }
  ];

  getAllLevels(): ESLLevel[] {
    return this.levels.sort((a, b) => a.levelOrder - b.levelOrder);
  }

  getLevelById(id: string): ESLLevel | undefined {
    return this.levels.find(level => level.id === id);
  }

  getLevelsByCEFR(cefrLevel: string): ESLLevel[] {
    return this.levels.filter(level => level.cefrLevel === cefrLevel);
  }

  getLevelsByAgeGroup(minAge: number, maxAge: number): ESLLevel[] {
    return this.levels.filter(level => {
      const ages = level.ageGroup.match(/\d+/g);
      if (!ages || ages.length < 2) return true;
      const levelMinAge = parseInt(ages[0]);
      const levelMaxAge = parseInt(ages[1]);
      return (minAge <= levelMaxAge && maxAge >= levelMinAge);
    });
  }

  getSkillsByLevel(levelId: string): ESLSkill[] {
    const level = this.getLevelById(levelId);
    return level ? level.skills : [];
  }

  getAITemplates(): AITemplate[] {
    return this.aiTemplates;
  }

  getAITemplatesByAge(minAge: number, maxAge: number): AITemplate[] {
    return this.aiTemplates.filter(template => 
      template.minAge <= maxAge && template.maxAge >= minAge
    );
  }

  async generateAIContent(templateId: string, parameters: Record<string, any>): Promise<ESLMaterial> {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const level = this.levels.find(l => l.name === parameters.level) || this.levels[0];
        const ageAppropriate = template.minAge <= 12; // Simple age check
        
        const generatedMaterial: ESLMaterial = {
          id: `ai_${Date.now()}`,
          title: `${template.name} - ${parameters.topic || parameters.theme || 'Generated Content'}`,
          description: `AI generated content for ${parameters.level || 'ESL learners'} (${parameters.ageGroup || 'All ages'})`,
          type: template.type as any,
          level: level,
          skills: level.skills.slice(0, 2),
          duration: this.calculateDuration(template.type, parameters.ageGroup),
          xpReward: this.calculateXPReward(template.type, level.cefrLevel, parameters.ageGroup),
          difficultyRating: level.levelOrder,
          isAIGenerated: true,
          ageAppropriate: ageAppropriate,
          gamificationElements: this.generateAgeAppropriateGameElements(template.type, ageAppropriate),
          content: this.generateContent(template, parameters),
          createdAt: new Date(),
          lastModified: new Date()
        };
        resolve(generatedMaterial);
      }, template.estimatedGenerationTime * 1000);
    });
  }

  private calculateDuration(type: string, ageGroup?: string): number {
    const baseDuration = {
      'worksheet': 20,
      'activity': 30,
      'song': 15,
      'game': 25,
      'exam_prep': 60
    };
    
    const duration = baseDuration[type] || 30;
    
    // Adjust for age - younger children need shorter activities
    if (ageGroup?.includes('4-7')) return Math.max(10, duration * 0.7);
    if (ageGroup?.includes('6-9')) return Math.max(15, duration * 0.8);
    return duration;
  }

  private calculateXPReward(type: string, cefrLevel: string, ageGroup?: string): number {
    const baseXP = {
      'worksheet': 20,
      'activity': 30,
      'song': 15,
      'game': 25,
      'exam_prep': 50
    };
    
    const levelMultiplier = {
      'Pre-A1': 1.0,
      'A1': 1.2,
      'A1+': 1.4,
      'A2': 1.5,
      'A2+': 1.7,
      'B1': 2.0,
      'B1+': 2.3,
      'B2': 2.5,
      'B2+': 2.8,
      'C1': 3.0,
      'C2': 3.5
    };

    let xp = Math.round((baseXP[type] || 20) * (levelMultiplier[cefrLevel] || 1.0));
    
    // Age bonus for engagement
    if (ageGroup?.includes('4-7') || ageGroup?.includes('6-9')) {
      xp += 5; // Bonus for young learners
    }
    
    return xp;
  }

  private generateAgeAppropriateGameElements(type: string, ageAppropriate: boolean) {
    const baseElements = [
      {
        id: `points_${Date.now()}`,
        type: 'points' as const,
        name: 'Completion Points',
        description: 'Points awarded for completing this material',
        value: 50,
        ageAppropriate: true
      }
    ];

    if (ageAppropriate) {
      baseElements.push({
        id: `sticker_${Date.now()}`,
        type: 'sticker' as const,
        name: 'Achievement Sticker',
        description: 'Fun sticker reward for young learners',
        value: 10,
        ageAppropriate: true
      });
    } else {
      baseElements.push({
        id: `certificate_${Date.now()}`,
        type: 'certificate' as const,
        name: 'Completion Certificate',
        description: 'Professional certificate for advanced learners',
        value: 100,
        ageAppropriate: false
      });
    }

    return baseElements;
  }

  private generateContent(template: AITemplate, parameters: Record<string, any>) {
    return {
      title: `${template.name} - ${parameters.topic || parameters.theme || 'General'}`,
      exercises: this.generateExercises(template.type, parameters),
      instructions: `Complete this ${template.type} to practice your English skills`,
      difficulty: parameters.level,
      ageGroup: parameters.ageGroup,
      estimatedTime: this.calculateDuration(template.type, parameters.ageGroup)
    };
  }

  private generateExercises(type: string, parameters: Record<string, any>) {
    const exerciseCount = parameters.exerciseCount || parameters.practiceItems || parameters.sectionCount || 5;
    const exercises = [];
    
    for (let i = 0; i < exerciseCount; i++) {
      exercises.push({
        id: `exercise_${i + 1}`,
        type: this.getRandomExerciseType(type),
        question: `Sample ${type} question ${i + 1} about ${parameters.topic || parameters.theme || 'English'}`,
        options: this.generateAgeAppropriateOptions(parameters.ageGroup),
        correctAnswer: 'Option A',
        explanation: 'This is the correct answer because...',
        ageAppropriate: this.isAgeAppropriate(parameters.ageGroup)
      });
    }
    
    return exercises;
  }

  private generateAgeAppropriateOptions(ageGroup?: string): string[] {
    if (ageGroup?.includes('4-7') || ageGroup?.includes('6-9')) {
      return ['🐶 Dog', '🐱 Cat', '🐭 Mouse', '🐰 Rabbit'];
    }
    return ['Option A', 'Option B', 'Option C', 'Option D'];
  }

  private isAgeAppropriate(ageGroup?: string): boolean {
    return ageGroup?.includes('4-') || ageGroup?.includes('6-') || ageGroup?.includes('8-');
  }

  private getRandomExerciseType(materialType: string): string {
    const exerciseTypes = {
      'worksheet': ['fill_blank', 'multiple_choice', 'matching', 'coloring'],
      'activity': ['drag_drop', 'sorting', 'role_play', 'discussion'],
      'song': ['sing_along', 'fill_lyrics', 'action_song', 'rhythm'],
      'game': ['memory_game', 'matching_game', 'puzzle', 'quiz_game'],
      'exam_prep': ['multiple_choice', 'essay', 'listening', 'speaking']
    };
    
    const types = exerciseTypes[materialType] || exerciseTypes['worksheet'];
    return types[Math.floor(Math.random() * types.length)];
  }

  getTemplateById(id: string): AITemplate | undefined {
    return this.aiTemplates.find(template => template.id === id);
  }

  getBadgeSystem() {
    return {
      skillMasteryBadges: [
        { id: 'vocab_master', name: 'Vocabulary Master', description: 'Master 100 vocabulary words', xpValue: 100, ageGroup: 'All' },
        { id: 'grammar_guru', name: 'Grammar Guru', description: 'Complete 50 grammar exercises', xpValue: 150, ageGroup: 'All' },
        { id: 'young_speaker', name: 'Young Speaker', description: 'Complete 25 speaking activities', xpValue: 120, ageGroup: '4-11 years' },
        { id: 'teen_debater', name: 'Teen Debater', description: 'Win 10 debates', xpValue: 200, ageGroup: '12-16 years' },
        { id: 'exam_champion', name: 'Exam Champion', description: 'Pass advanced exam prep', xpValue: 300, ageGroup: 'Adults' }
      ],
      streakBadges: [
        { id: 'week_warrior', name: 'Week Warrior', description: '7-day learning streak', xpValue: 50, ageGroup: 'All' },
        { id: 'month_master', name: 'Month Master', description: '30-day learning streak', xpValue: 200, ageGroup: 'All' }
      ],
      ageMilestoneBadges: [
        { id: 'little_learner', name: 'Little Learner', description: 'First level completed (4-7 years)', xpValue: 100, ageGroup: '4-7 years' },
        { id: 'young_scholar', name: 'Young Scholar', description: 'Reached Elementary level', xpValue: 150, ageGroup: '8-11 years' },
        { id: 'teen_achiever', name: 'Teen Achiever', description: 'Reached Intermediate level', xpValue: 200, ageGroup: '12-16 years' },
        { id: 'adult_expert', name: 'Adult Expert', description: 'Reached Advanced level', xpValue: 300, ageGroup: 'Adults' }
      ]
    };
  }
}

export const eslCurriculumService = new ESLCurriculumService();
