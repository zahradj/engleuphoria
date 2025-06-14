
import { PlannerRequest, PlannerResponse, CurriculumPlan, Resource, LessonPlan } from '@/types/curriculum';

export interface CurriculumPhase {
  id: number;
  name: string;
  description: string;
  duration: number; // weeks
  focus: string;
  skills: string[];
  sentenceComplexity: 'basic' | 'intermediate' | 'advanced' | 'complex';
}

export interface SentenceTemplate {
  id: string;
  level: number;
  pattern: string;
  example: string;
  visualAid: string;
  practiceExercises: string[];
}

export interface ComprehensionStrategy {
  id: string;
  name: string;
  description: string;
  technique: string;
  application: string;
  visualComponent: string;
}

export const CURRICULUM_PHASES: CurriculumPhase[] = [
  {
    id: 1,
    name: "Foundation Building",
    description: "Sentence Construction Mastery",
    duration: 4,
    focus: "Basic sentence patterns and core vocabulary",
    skills: ["Subject-Verb construction", "Basic word order", "Present simple", "Core vocabulary"],
    sentenceComplexity: 'basic'
  },
  {
    id: 2,
    name: "Pattern Recognition",
    description: "Grammar Patterns as Building Blocks",
    duration: 4,
    focus: "Grammar pattern recognition and application",
    skills: ["Verb tenses", "Question formation", "Negatives", "Pattern recognition"],
    sentenceComplexity: 'intermediate'
  },
  {
    id: 3,
    name: "Contextual Application", 
    description: "Theme-Based Communication",
    duration: 8,
    focus: "Real-world communication contexts",
    skills: ["Descriptive language", "Time expressions", "Comparisons", "Complex descriptions"],
    sentenceComplexity: 'advanced'
  },
  {
    id: 4,
    name: "Advanced Integration",
    description: "Complex Communication",
    duration: 8,
    focus: "Sophisticated language use and complex thoughts",
    skills: ["Complex sentences", "Abstract concepts", "Argumentation", "Fluency"],
    sentenceComplexity: 'complex'
  }
];

export const SENTENCE_TEMPLATES: SentenceTemplate[] = [
  // Level 1: Foundation Sentences
  {
    id: "foundation_1",
    level: 1,
    pattern: "Subject + Verb",
    example: "I study",
    visualAid: "Visual block diagram showing subject and verb connection",
    practiceExercises: ["Complete: I ___", "Choose correct verb", "Match subjects with verbs"]
  },
  {
    id: "foundation_2", 
    level: 1,
    pattern: "Subject + Verb + Object",
    example: "I study English",
    visualAid: "Three-block visual showing S-V-O relationship",
    practiceExercises: ["Add objects to sentences", "Reorder words", "Picture-sentence matching"]
  },
  {
    id: "foundation_3",
    level: 1,
    pattern: "Subject + Verb + Object + Time",
    example: "I study English daily",
    visualAid: "Four-block visual with time indicator",
    practiceExercises: ["Add time expressions", "Daily routine sentences", "Schedule completion"]
  },
  // Level 2: Enhanced Sentences
  {
    id: "enhanced_1",
    level: 2,
    pattern: "Adjective + Noun combinations",
    example: "I study difficult English daily",
    visualAid: "Color-coded adjective placement diagram",
    practiceExercises: ["Adjective insertion", "Descriptive expansion", "Comparison exercises"]
  },
  {
    id: "enhanced_2",
    level: 2,
    pattern: "Adverb placement",
    example: "I study difficult English carefully daily",
    visualAid: "Adverb positioning flowchart",
    practiceExercises: ["Adverb placement practice", "Manner expression", "Intensity exercises"]
  },
  // Level 3: Complex Sentences
  {
    id: "complex_1",
    level: 3,
    pattern: "Compound sentences with conjunctions",
    example: "I study English daily because I want to improve",
    visualAid: "Connection bridge diagram showing cause-effect",
    practiceExercises: ["Join sentences", "Cause-effect matching", "Reason expression"]
  },
  {
    id: "complex_2",
    level: 3,
    pattern: "Relative clauses",
    example: "I study English, which is challenging, daily",
    visualAid: "Sentence tree showing main and relative clauses",
    practiceExercises: ["Clause insertion", "Relative pronoun practice", "Description expansion"]
  }
];

export const COMPREHENSION_STRATEGIES: ComprehensionStrategy[] = [
  {
    id: "visual_anchoring",
    name: "Visual Anchoring",
    description: "Link grammar concepts to memorable images",
    technique: "Associate each grammar rule with a visual metaphor",
    application: "Use consistent visual symbols for parts of speech",
    visualComponent: "Color-coded grammar maps and symbol systems"
  },
  {
    id: "pattern_games",
    name: "Pattern Recognition Games",
    description: "Identify sentence patterns through interactive games",
    technique: "Gamified pattern matching and completion exercises",
    application: "Students recognize patterns before learning rules",
    visualComponent: "Interactive pattern matching interfaces"
  },
  {
    id: "chunking",
    name: "Chunking Technique",
    description: "Group words into meaningful phrases",
    technique: "Break sentences into logical word groups",
    application: "Improve reading speed and comprehension",
    visualComponent: "Phrase boundary visualization tools"
  },
  {
    id: "backward_building",
    name: "Backward Building",
    description: "Start with complete sentences, then deconstruct",
    technique: "Reverse engineering sentence construction",
    application: "Understanding how complex sentences are built",
    visualComponent: "Sentence deconstruction animations"
  },
  {
    id: "contextual_immersion",
    name: "Contextual Immersion",
    description: "All examples relate to student interests",
    technique: "Personalized example generation",
    application: "Increase engagement and retention",
    visualComponent: "Student interest-based content adaptation"
  }
];

class EnhancedCurriculumService {
  generateEnhancedCurriculum(request: PlannerRequest): PlannerResponse {
    const { studentProfile } = request;
    
    const currentPhase = this.determineStartingPhase(studentProfile);
    const weeks = this.generateSystematicWeeks(currentPhase, studentProfile);
    
    const plan: CurriculumPlan = {
      id: `enhanced_plan_${Date.now()}`,
      studentId: studentProfile.id,
      weeks,
      badgeRule: `Enhanced Learning Phase ${currentPhase.name} = 400 XP`,
      createdAt: new Date(),
      status: 'draft' as const,
      metadata: {
        framework: 'NLEFP',
        progressTracking: {
          skillsToTrack: ['sentence_building', 'pattern_recognition', 'comprehension_speed'],
          nlpAnchorsUsed: ['visual_timeline', 'kinesthetic_building', 'pattern_visualization'],
          metacognitionPrompts: [
            'What sentence pattern did you use?',
            'How did you build this sentence step by step?',
            'Which strategy helped you understand fastest?'
          ]
        },
        nlpIntegration: true
      }
    };

    return {
      success: true,
      plan
    };
  }

  private determineStartingPhase(profile: any): CurriculumPhase {
    // Determine phase based on CEFR level and diagnostic results
    if (profile.cefrLevel === 'A1' || !profile.diagnosticResults) {
      return CURRICULUM_PHASES[0]; // Foundation Building
    } else if (profile.cefrLevel === 'A2') {
      return CURRICULUM_PHASES[1]; // Pattern Recognition
    } else if (profile.cefrLevel === 'B1') {
      return CURRICULUM_PHASES[2]; // Contextual Application
    } else {
      return CURRICULUM_PHASES[3]; // Advanced Integration
    }
  }

  private generateSystematicWeeks(phase: CurriculumPhase, profile: any) {
    const weeks = [];
    
    for (let week = 1; week <= phase.duration; week++) {
      const weekTheme = this.getWeekTheme(phase, week);
      const isProgressWeek = week % 4 === 0;
      
      weeks.push({
        theme: weekTheme,
        isProgressWeek,
        lessons: this.generateSystematicLessons(phase, week, weekTheme, profile)
      });
    }
    
    return weeks;
  }

  private getWeekTheme(phase: CurriculumPhase, week: number): string {
    const themes = {
      1: [ // Foundation Building
        "Micro-Sentence Building",
        "Word Order Mastery", 
        "Sentence Expansion Basics",
        "Foundation Review & Assessment"
      ],
      2: [ // Pattern Recognition
        "Verb Pattern Recognition",
        "Question Formation Patterns",
        "Negative Sentence Patterns", 
        "Pattern Integration Review"
      ],
      3: [ // Contextual Application
        "Personal Description Context",
        "Daily Life Communication",
        "Social Interaction Context",
        "Academic Context",
        "Professional Context",
        "Cultural Context",
        "Problem-Solving Context",
        "Contextual Mastery Review"
      ],
      4: [ // Advanced Integration
        "Complex Thought Expression",
        "Abstract Concept Communication",
        "Argumentative Language",
        "Creative Expression",
        "Academic Writing",
        "Professional Communication",
        "Cultural Nuance",
        "Advanced Integration Mastery"
      ]
    };
    
    return themes[phase.id]?.[week - 1] || `${phase.name} Week ${week}`;
  }

  private generateSystematicLessons(phase: CurriculumPhase, week: number, theme: string, profile: any): LessonPlan[] {
    const templates = this.getSentenceTemplatesForPhase(phase);
    const strategies = this.getComprehensionStrategiesForPhase(phase);
    
    return [
      {
        objective: `Master ${templates[0]?.pattern || 'sentence patterns'} through systematic building`,
        resources: [
          { id: `enhanced_${phase.id}_${week}_visual`, type: "interactive" },
          { id: `enhanced_${phase.id}_${week}_practice`, type: "worksheet" }
        ],
        nlpAnchor: this.generateEnhancedNLPAnchor(theme, phase),
        criticalThinking: this.generateCriticalThinking(theme, phase),
        homework: `Build 5 sentences using today's pattern. Record yourself saying them.`,
        xpReward: 60,
        lessonStructure: {
          welcomeRitual: `"Today I will master ${templates[0]?.pattern || 'new patterns'} step by step"`,
          warmUpHook: `Quick ${theme.toLowerCase()} pattern recognition game`,
          presentation: `Visual sentence building demonstration with ${templates[0]?.visualAid || 'interactive diagrams'}`,
          practice: `Guided sentence construction using systematic templates`,
          production: `Independent sentence creation and peer feedback`,
          reviewReflect: `Pattern mastery self-assessment and next-step goal setting`
        },
        vakElements: {
          visual: `Color-coded sentence diagrams and pattern visualizations`,
          auditory: `Rhythm-based sentence pattern practice and pronunciation drills`,
          kinesthetic: `Physical sentence building with moveable word blocks`
        },
        metacognition: `Reflect: Which sentence building strategy worked best for you today?`
      },
      {
        objective: `Apply ${theme} patterns in rapid comprehension exercises`,
        resources: [
          { id: `enhanced_${phase.id}_${week}_speed`, type: "game" },
          { id: `enhanced_${phase.id}_${week}_assessment`, type: "interactive" }
        ],
        nlpAnchor: this.generateComprehensionAnchor(strategies[0], theme),
        criticalThinking: `Compare different ways to express the same idea using today's patterns`,
        homework: `Create a mini-story using at least 3 different sentence patterns from this week`,
        xpReward: 50,
        lessonStructure: {
          welcomeRitual: `"I can quickly understand and build complex sentences"`,
          warmUpHook: `Speed pattern recognition challenge`,
          presentation: `Rapid comprehension strategy demonstration`,
          practice: `Timed sentence building and comprehension exercises`,
          production: `Real-time sentence creation in communication scenarios`,
          reviewReflect: `Speed and accuracy progress tracking and celebration`
        },
        vakElements: {
          visual: `Interactive pattern maps and progress visualizations`,
          auditory: `Listening comprehension with pattern focus`,
          kinesthetic: `Movement-based pattern practice and gesture integration`
        },
        metacognition: `Analyze: How did you process the sentence patterns more quickly today?`
      }
    ];
  }

  private getSentenceTemplatesForPhase(phase: CurriculumPhase): SentenceTemplate[] {
    return SENTENCE_TEMPLATES.filter(template => {
      switch (phase.sentenceComplexity) {
        case 'basic': return template.level === 1;
        case 'intermediate': return template.level <= 2;
        case 'advanced': return template.level <= 3;
        case 'complex': return true;
        default: return template.level === 1;
      }
    });
  }

  private getComprehensionStrategiesForPhase(phase: CurriculumPhase): ComprehensionStrategy[] {
    return COMPREHENSION_STRATEGIES; // All strategies available for all phases
  }

  private generateEnhancedNLPAnchor(theme: string, phase: CurriculumPhase): string {
    const anchors = {
      "Foundation Building": `Feel the solid foundation forming as you build each sentence piece by piece, like constructing with building blocks`,
      "Pattern Recognition": `Notice how patterns flow like music - each sentence has its own rhythm and melody`,
      "Contextual Application": `See yourself confidently using these sentences in real conversations, feeling natural and fluent`,
      "Advanced Integration": `Experience the power of expressing complex thoughts clearly and eloquently in English`
    };
    
    return anchors[phase.name] || `Visualize yourself mastering ${theme} with confidence and joy`;
  }

  private generateCriticalThinking(theme: string, phase: CurriculumPhase): string {
    const questions = {
      1: `Why does word order matter in English? How does it change meaning?`,
      2: `What patterns do you notice? How are they similar to your native language?`,
      3: `How would you explain this concept to someone else? What examples would you use?`,
      4: `What multiple ways can you express this idea? Which is most effective and why?`
    };
    
    return questions[phase.id] || `Analyze the patterns in ${theme} and explain your reasoning`;
  }

  private generateComprehensionAnchor(strategy: ComprehensionStrategy, theme: string): string {
    return `Using ${strategy.name}, you effortlessly understand ${theme} concepts and feel your comprehension speed increasing`;
  }

  getPhaseProgress(studentId: string, currentPhase: number): {
    currentPhase: CurriculumPhase;
    nextPhase: CurriculumPhase | null;
    progressPercentage: number;
    skillsMastered: string[];
    nextSkills: string[];
  } {
    const current = CURRICULUM_PHASES.find(p => p.id === currentPhase);
    const next = CURRICULUM_PHASES.find(p => p.id === currentPhase + 1);
    
    return {
      currentPhase: current!,
      nextPhase: next || null,
      progressPercentage: (currentPhase / CURRICULUM_PHASES.length) * 100,
      skillsMastered: current?.skills || [],
      nextSkills: next?.skills || []
    };
  }
}

export const enhancedCurriculumService = new EnhancedCurriculumService();
