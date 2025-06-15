
import { ESLLevel, ESLSkill, ESLCollection, ESLMaterial, StudentProgress, Badge, AITemplate } from '@/types/eslCurriculum';

class ESLCurriculumService {
  private levels: ESLLevel[] = [
    {
      id: 'a1',
      name: 'Beginner (A1)',
      cefrLevel: 'A1',
      description: 'Can understand and use familiar everyday expressions and basic phrases',
      skills: [
        { id: 'a1_vocab', name: 'Basic Vocabulary', category: 'vocabulary', description: 'Essential everyday words', canStudentPractice: true },
        { id: 'a1_intro', name: 'Introductions', category: 'speaking', description: 'Introducing yourself and others', canStudentPractice: true },
        { id: 'a1_numbers', name: 'Numbers & Time', category: 'vocabulary', description: 'Numbers, dates, and time', canStudentPractice: true },
        { id: 'a1_present', name: 'Present Simple', category: 'grammar', description: 'Basic present tense', canStudentPractice: true }
      ],
      xpRequired: 0,
      estimatedHours: 80
    },
    {
      id: 'a2',
      name: 'Elementary (A2)', 
      cefrLevel: 'A2',
      description: 'Can communicate in simple routine tasks requiring direct exchange of information',
      skills: [
        { id: 'a2_family', name: 'Family & Relationships', category: 'vocabulary', description: 'Family members and relationships', canStudentPractice: true },
        { id: 'a2_past', name: 'Past Simple', category: 'grammar', description: 'Past tense actions', canStudentPractice: true },
        { id: 'a2_directions', name: 'Giving Directions', category: 'speaking', description: 'Asking for and giving directions', canStudentPractice: true },
        { id: 'a2_shopping', name: 'Shopping Language', category: 'vocabulary', description: 'Shopping and money', canStudentPractice: true }
      ],
      xpRequired: 1000,
      estimatedHours: 100
    },
    {
      id: 'b1',
      name: 'Intermediate (B1)',
      cefrLevel: 'B1', 
      description: 'Can deal with most situations likely to arise while traveling',
      skills: [
        { id: 'b1_future', name: 'Future Tenses', category: 'grammar', description: 'Will, going to, present continuous for future', canStudentPractice: true },
        { id: 'b1_opinions', name: 'Expressing Opinions', category: 'speaking', description: 'Giving and justifying opinions', canStudentPractice: true },
        { id: 'b1_conditionals', name: 'First Conditional', category: 'grammar', description: 'If clauses type 1', canStudentPractice: true },
        { id: 'b1_travel', name: 'Travel Vocabulary', category: 'vocabulary', description: 'Travel and tourism', canStudentPractice: true }
      ],
      xpRequired: 2500,
      estimatedHours: 120
    }
  ];

  private aiTemplates: AITemplate[] = [
    {
      id: 'vocab_worksheet',
      name: 'Vocabulary Worksheet Generator',
      type: 'worksheet',
      prompt: 'Create a vocabulary worksheet for {level} students on the topic of {topic}. Include {exerciseCount} exercises with different activity types like matching, fill-in-the-blanks, and definitions.',
      parameters: [
        { name: 'topic', type: 'text', required: true, description: 'Vocabulary topic (e.g., family, food, animals)' },
        { name: 'level', type: 'select', required: true, options: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], description: 'CEFR level' },
        { name: 'exerciseCount', type: 'number', required: false, defaultValue: 5, description: 'Number of exercises' }
      ],
      outputFormat: 'structured_worksheet',
      estimatedGenerationTime: 30
    },
    {
      id: 'grammar_activity',
      name: 'Grammar Activity Generator',
      type: 'activity',
      prompt: 'Generate an interactive grammar activity for {grammarPoint} at {level} level. Include explanations, examples, and {practiceItems} practice items with immediate feedback.',
      parameters: [
        { name: 'grammarPoint', type: 'text', required: true, description: 'Grammar topic (e.g., present simple, past continuous)' },
        { name: 'level', type: 'select', required: true, options: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], description: 'CEFR level' },
        { name: 'practiceItems', type: 'number', required: false, defaultValue: 10, description: 'Number of practice items' }
      ],
      outputFormat: 'interactive_activity',
      estimatedGenerationTime: 45
    },
    {
      id: 'dialogue_creator',
      name: 'Dialogue Creator',
      type: 'dialogue',
      prompt: 'Create a realistic dialogue between {speakers} people about {situation}. The dialogue should be appropriate for {level} level students and include {targetLanguage}.',
      parameters: [
        { name: 'speakers', type: 'number', required: true, defaultValue: 2, description: 'Number of speakers' },
        { name: 'situation', type: 'text', required: true, description: 'Dialogue situation (e.g., at a restaurant, job interview)' },
        { name: 'level', type: 'select', required: true, options: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], description: 'CEFR level' },
        { name: 'targetLanguage', type: 'text', required: false, description: 'Specific language to include' }
      ],
      outputFormat: 'dialogue_with_exercises',
      estimatedGenerationTime: 25
    }
  ];

  getAllLevels(): ESLLevel[] {
    return this.levels;
  }

  getLevelById(id: string): ESLLevel | undefined {
    return this.levels.find(level => level.id === id);
  }

  getSkillsByLevel(levelId: string): ESLSkill[] {
    const level = this.getLevelById(levelId);
    return level ? level.skills : [];
  }

  getAITemplates(): AITemplate[] {
    return this.aiTemplates;
  }

  getTemplateById(id: string): AITemplate | undefined {
    return this.aiTemplates.find(template => template.id === id);
  }

  async generateAIContent(templateId: string, parameters: Record<string, any>): Promise<ESLMaterial> {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Simulate AI generation
    return new Promise((resolve) => {
      setTimeout(() => {
        const generatedMaterial: ESLMaterial = {
          id: `ai_${Date.now()}`,
          title: `AI Generated ${template.name}`,
          description: `Generated content for ${parameters.topic || 'language learning'}`,
          type: template.type as any,
          level: this.levels.find(l => l.cefrLevel === parameters.level) || this.levels[0],
          skills: [],
          duration: 30,
          xpReward: this.calculateXPReward(template.type, parameters.level),
          difficultyRating: this.calculateDifficulty(parameters.level),
          isAIGenerated: true,
          gamificationElements: this.generateGameElements(template.type),
          content: this.generateContent(template, parameters),
          createdAt: new Date(),
          lastModified: new Date()
        };
        resolve(generatedMaterial);
      }, template.estimatedGenerationTime * 1000);
    });
  }

  private calculateXPReward(type: string, level: string): number {
    const baseXP = {
      'worksheet': 20,
      'activity': 30,
      'quiz': 25,
      'lesson_plan': 50,
      'dialogue': 15
    };
    
    const levelMultiplier = {
      'A1': 1.0,
      'A2': 1.2,
      'B1': 1.5,
      'B2': 1.8,
      'C1': 2.0,
      'C2': 2.2
    };

    return Math.round((baseXP[type] || 20) * (levelMultiplier[level] || 1.0));
  }

  private calculateDifficulty(level: string): number {
    const difficultyMap = {
      'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6
    };
    return difficultyMap[level] || 1;
  }

  private generateGameElements(type: string) {
    return [
      {
        id: `points_${Date.now()}`,
        type: 'points' as const,
        name: 'Completion Points',
        description: 'Points awarded for completing this material',
        value: 50
      },
      {
        id: `progress_${Date.now()}`,
        type: 'progress_bar' as const,
        name: 'Progress Tracker',
        description: 'Track completion progress',
        value: 0
      }
    ];
  }

  private generateContent(template: AITemplate, parameters: Record<string, any>) {
    // Simulate content generation based on template and parameters
    return {
      title: `${template.name} - ${parameters.topic || 'General'}`,
      exercises: this.generateExercises(template.type, parameters),
      instructions: `Complete this ${template.type} to practice your English skills`,
      difficulty: parameters.level,
      estimatedTime: 30
    };
  }

  private generateExercises(type: string, parameters: Record<string, any>) {
    const exerciseCount = parameters.exerciseCount || 5;
    const exercises = [];
    
    for (let i = 0; i < exerciseCount; i++) {
      exercises.push({
        id: `exercise_${i + 1}`,
        type: this.getRandomExerciseType(type),
        question: `Sample question ${i + 1} about ${parameters.topic || 'English'}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        explanation: 'This is the correct answer because...'
      });
    }
    
    return exercises;
  }

  private getRandomExerciseType(materialType: string): string {
    const exerciseTypes = {
      'worksheet': ['fill_blank', 'multiple_choice', 'matching', 'true_false'],
      'activity': ['drag_drop', 'sorting', 'role_play', 'discussion'],
      'quiz': ['multiple_choice', 'short_answer', 'essay', 'listening'],
      'dialogue': ['comprehension', 'role_play', 'gap_fill', 'pronunciation']
    };
    
    const types = exerciseTypes[materialType] || exerciseTypes['worksheet'];
    return types[Math.floor(Math.random() * types.length)];
  }

  getBadgeSystem() {
    return {
      skillMasteryBadges: [
        { id: 'vocab_master', name: 'Vocabulary Master', description: 'Master 100 vocabulary words', xpValue: 100 },
        { id: 'grammar_guru', name: 'Grammar Guru', description: 'Complete 50 grammar exercises', xpValue: 150 },
        { id: 'speaking_star', name: 'Speaking Star', description: 'Complete 25 speaking activities', xpValue: 120 }
      ],
      streakBadges: [
        { id: 'week_warrior', name: 'Week Warrior', description: '7-day learning streak', xpValue: 50 },
        { id: 'month_master', name: 'Month Master', description: '30-day learning streak', xpValue: 200 }
      ],
      completionBadges: [
        { id: 'level_complete', name: 'Level Complete', description: 'Complete an entire CEFR level', xpValue: 500 },
        { id: 'skill_complete', name: 'Skill Complete', description: 'Master a skill category', xpValue: 300 }
      ]
    };
  }
}

export const eslCurriculumService = new ESLCurriculumService();
