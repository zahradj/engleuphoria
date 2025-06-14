
import { CurriculumPhase } from '@/types/curriculumTypes';
import { LessonPlan } from '@/types/curriculum';
import { SENTENCE_TEMPLATES } from '@/data/sentenceTemplates';
import { COMPREHENSION_STRATEGIES } from '@/data/comprehensionStrategies';

export class WeekPlannerService {
  generateSystematicWeeks(phase: CurriculumPhase, profile: any) {
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
      1: [
        "Micro-Sentence Building",
        "Word Order Mastery", 
        "Sentence Expansion Basics",
        "Foundation Review & Assessment"
      ],
      2: [
        "Verb Pattern Recognition",
        "Question Formation Patterns",
        "Negative Sentence Patterns", 
        "Pattern Integration Review"
      ],
      3: [
        "Personal Description Context",
        "Daily Life Communication",
        "Social Interaction Context",
        "Academic Context",
        "Professional Context",
        "Cultural Context",
        "Problem-Solving Context",
        "Contextual Mastery Review"
      ],
      4: [
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

  private getSentenceTemplatesForPhase(phase: CurriculumPhase) {
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

  private getComprehensionStrategiesForPhase(phase: CurriculumPhase) {
    return COMPREHENSION_STRATEGIES;
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

  private generateComprehensionAnchor(strategy: any, theme: string): string {
    return `Using ${strategy?.name || 'advanced techniques'}, you effortlessly understand ${theme} concepts and feel your comprehension speed increasing`;
  }
}
