
import { PlannerRequest, PlannerResponse, CurriculumPlan, Resource } from '@/types/curriculum';

export interface NLEFPModule {
  id: number;
  theme: string;
  coreFocus: string;
  nlpAnchor: string;
  thinkingSkill: string;
  duration: number; // weeks
}

export interface NLEFPLessonStructure {
  welcomeRitual: string;
  warmUpHook: string;
  presentation: string;
  practice: string;
  production: string;
  reviewReflect: string;
}

export const NLEFP_MODULES: NLEFPModule[] = [
  {
    id: 1,
    theme: "All About Me",
    coreFocus: "Present simple, personal info",
    nlpAnchor: "Visual timeline",
    thinkingSkill: "Categorization",
    duration: 2
  },
  {
    id: 2,
    theme: "My Daily Routine",
    coreFocus: "Present simple, adverbs of frequency",
    nlpAnchor: "VAK habit triggers",
    thinkingSkill: "Sequencing",
    duration: 2
  },
  {
    id: 3,
    theme: "My School and Friends",
    coreFocus: "School subjects, likes/dislikes",
    nlpAnchor: "Positive associations",
    thinkingSkill: "Compare & contrast",
    duration: 2
  },
  {
    id: 4,
    theme: "My Family",
    coreFocus: "Describing people, possessives",
    nlpAnchor: "Emotional anchors",
    thinkingSkill: "Cause and effect",
    duration: 2
  },
  {
    id: 5,
    theme: "Hobbies and Free Time",
    coreFocus: "Verb+ing, hobbies vocabulary",
    nlpAnchor: "Future pacing",
    thinkingSkill: "Ranking/choice-making",
    duration: 2
  },
  {
    id: 6,
    theme: "Food and Shopping",
    coreFocus: "Count/non-count nouns",
    nlpAnchor: "Sensory recall",
    thinkingSkill: "Problem-solving",
    duration: 2
  },
  {
    id: 7,
    theme: "Seasons & Weather",
    coreFocus: "Weather vocabulary, clothes",
    nlpAnchor: "Visualization",
    thinkingSkill: "Inferring",
    duration: 2
  },
  {
    id: 8,
    theme: "In the City",
    coreFocus: "Giving directions, prepositions",
    nlpAnchor: "Embedded commands",
    thinkingSkill: "Spatial thinking",
    duration: 2
  },
  {
    id: 9,
    theme: "Holidays & Traditions",
    coreFocus: "Past simple, cultural elements",
    nlpAnchor: "Emotional contrast",
    thinkingSkill: "Comparison across time",
    duration: 2
  },
  {
    id: 10,
    theme: "Technology",
    coreFocus: "Modals, digital vocabulary",
    nlpAnchor: "NLP meta-questions",
    thinkingSkill: "Predicting outcomes",
    duration: 2
  },
  {
    id: 11,
    theme: "Healthy Living",
    coreFocus: "Imperatives, body, advice",
    nlpAnchor: "Kinesthetic cues",
    thinkingSkill: "Evaluating choices",
    duration: 2
  },
  {
    id: 12,
    theme: "My Future",
    coreFocus: "Will, future plans",
    nlpAnchor: "Future pacing",
    thinkingSkill: "Goal setting",
    duration: 2
  }
];

class NLEFPCurriculumService {
  generateNLEFPCurriculum(request: PlannerRequest): PlannerResponse {
    const { studentProfile } = request;
    
    // Select appropriate modules based on student level and interests
    const selectedModules = this.selectModulesForStudent(studentProfile);
    
    const weeks = selectedModules.map((module, index) => ({
      theme: module.theme,
      lessons: this.generateWeeklyLessons(module, studentProfile, index)
    }));

    const plan: CurriculumPlan = {
      id: `nlefp_plan_${Date.now()}`,
      studentId: studentProfile.id,
      weeks,
      badgeRule: `NLEFP ${selectedModules[0].theme} Master = 300 XP`,
      createdAt: new Date(),
      status: 'draft' as const
    };

    return {
      success: true,
      plan
    };
  }

  private selectModulesForStudent(profile: any): NLEFPModule[] {
    // Start with modules 1-6 for beginners, adjust based on level
    const startModule = profile.cefrLevel === 'A1' ? 1 : 
                       profile.cefrLevel === 'A2' ? 4 : 7;
    
    return NLEFP_MODULES.slice(startModule - 1, startModule + 5);
  }

  private generateWeeklyLessons(module: NLEFPModule, profile: any, weekIndex: number) {
    const isProgressWeek = (weekIndex + 1) % 4 === 0;
    
    if (isProgressWeek) {
      return this.generateProgressWeekLessons(module);
    }

    return [
      {
        objective: `Students will master ${module.coreFocus} through ${module.thinkingSkill.toLowerCase()}`,
        resources: [
          { id: `nlefp_${module.id}_vocab`, type: "interactive" },
          { id: `nlefp_${module.id}_practice`, type: "worksheet" }
        ],
        nlpAnchor: this.generateNLPAnchor(module.nlpAnchor, module.theme),
        criticalThinking: this.generateCriticalThinking(module.thinkingSkill, module.theme),
        homework: this.generateHomework(module.theme, module.thinkingSkill),
        xpReward: 50,
        lessonStructure: this.generateLessonStructure(module)
      },
      {
        objective: `Students will apply ${module.coreFocus} in real-world contexts`,
        resources: [
          { id: `nlefp_${module.id}_speaking`, type: "interactive" },
          { id: `nlefp_${module.id}_game`, type: "game" }
        ],
        nlpAnchor: this.generateFuturePacing(module.theme),
        criticalThinking: this.generateMetacognitive(module.thinkingSkill),
        homework: `Create a mind map about ${module.theme} with English labels`,
        xpReward: 40,
        lessonStructure: this.generateProductionLessonStructure(module)
      }
    ];
  }

  private generateProgressWeekLessons(module: NLEFPModule) {
    return [
      {
        objective: `Review and consolidate ${module.theme} knowledge`,
        resources: [
          { id: `nlefp_${module.id}_review`, type: "game" },
          { id: `nlefp_${module.id}_portfolio`, type: "interactive" }
        ],
        nlpAnchor: "Visualize your learning journey and feel proud of your progress",
        criticalThinking: "Reflect: What was the most challenging part? What strategy helped you learn best?",
        homework: "Record a 2-minute video sharing your favorite thing about this topic",
        xpReward: 100,
        lessonStructure: {
          welcomeRitual: "Progress celebration and achievement recognition",
          warmUpHook: "Review game with all vocabulary from the module",
          presentation: "Student presentations of portfolio work",
          practice: "Peer feedback and collaborative activities",
          production: "Create final project or video recording",
          reviewReflect: "Visual progress map update and certificate ceremony"
        }
      }
    ];
  }

  private generateNLPAnchor(anchorType: string, theme: string): string {
    const anchors = {
      "Visual timeline": `Close your eyes and picture your perfect day. See yourself using English to talk about ${theme}`,
      "VAK habit triggers": `Feel the rhythm of daily activities. Hear the sounds. See the movements as you describe your routine`,
      "Positive associations": `Remember a time when you felt really happy at school. Anchor that feeling to learning English`,
      "Emotional anchors": `Think of someone you love. Feel that warmth as you describe your family in English`,
      "Future pacing": `Imagine yourself next year, confidently talking about your hobbies with new friends`,
      "Sensory recall": `Smell your favorite food. Taste it. Feel yourself ordering it in English`,
      "Visualization": `Picture the perfect weather day. Feel the temperature. See yourself dressed perfectly`,
      "Embedded commands": `As you learn directions, you will naturally start thinking in English`,
      "Emotional contrast": `Compare how you felt last holiday to how you feel now learning about traditions`,
      "NLP meta-questions": `What would happen if you could use technology perfectly in English?`,
      "Kinesthetic cues": `Feel your body getting stronger as your English gets stronger too`,
    };
    
    return anchors[anchorType] || `Visualize yourself successfully using English in situations about ${theme}`;
  }

  private generateCriticalThinking(skill: string, theme: string): string {
    const activities = {
      "Categorization": `Sort these ${theme} items into groups. Explain your reasoning`,
      "Sequencing": `Put these daily activities in order. What happens if you change the sequence?`,
      "Compare & contrast": `How is your school different from schools in other countries?`,
      "Cause and effect": `Why do families have different traditions? What causes these differences?`,
      "Ranking/choice-making": `Rank these hobbies from most to least useful. Justify your choices`,
      "Problem-solving": `You're planning a party. What food problems might you face? How would you solve them?`,
      "Inferring": `Look at this weather photo. What can you infer about the season and location?`,
      "Spatial thinking": `Design the perfect city layout. Explain why you put buildings where you did`,
      "Comparison across time": `How have holiday celebrations changed over 100 years?`,
      "Predicting outcomes": `What will technology look like in 10 years? Support your predictions`,
      "Evaluating choices": `Judge these health habits. Which are most important and why?`,
      "Goal setting": `Create a 5-year plan. What steps will lead to your dreams?`
    };
    
    return activities[skill] || `Analyze and evaluate different aspects of ${theme}`;
  }

  private generateHomework(theme: string, skill: string): string {
    return `Create a visual diary about ${theme} with English labels. Practice the ${skill.toLowerCase()} skills we learned today`;
  }

  private generateFuturePacing(theme: string): string {
    return `Picture yourself next month confidently talking about ${theme} with English-speaking friends`;
  }

  private generateMetacognitive(skill: string): string {
    return `Think about your thinking: How did you use ${skill.toLowerCase()} to understand this better?`;
  }

  private generateLessonStructure(module: NLEFPModule): NLEFPLessonStructure {
    return {
      welcomeRitual: `"Today I feel confident and ready to explore ${module.theme}." Color your progress star`,
      warmUpHook: `Quick ${module.theme} matching game with visualization warm-up`,
      presentation: `Introduce ${module.coreFocus} using VAK format with ${module.nlpAnchor}`,
      practice: `Interactive ${module.thinkingSkill.toLowerCase()} activity with target language`,
      production: `Students create/perform using new language about ${module.theme}`,
      reviewReflect: `Emoji meter self-assessment and teacher feedback with potential badge award`
    };
  }

  private generateProductionLessonStructure(module: NLEFPModule): NLEFPLessonStructure {
    return {
      welcomeRitual: `Confidence anchor: "I can use English to share my ideas about ${module.theme}"`,
      warmUpHook: `Speaking warm-up game reviewing previous lesson vocabulary`,
      presentation: `Model real-world applications of ${module.coreFocus}`,
      practice: `Collaborative speaking and writing tasks with peer feedback`,
      production: `Mini presentations or role-plays using ${module.theme} language`,
      reviewReflect: `Goal setting for next lesson and celebration of progress made`
    };
  }

  getNLEFPResources(moduleId: number): Resource[] {
    const module = NLEFP_MODULES.find(m => m.id === moduleId);
    if (!module) return [];

    return [
      {
        id: `nlefp_${moduleId}_vocab`,
        title: `${module.theme} - Vocabulary Builder`,
        type: 'interactive',
        cefrLevel: 'A1',
        skillFocus: ['vocabulary', 'listening'],
        theme: module.theme,
        duration: 15,
        description: `Interactive vocabulary activities for ${module.theme}`,
        tags: [module.theme.toLowerCase(), 'vocabulary', 'nlp'],
        content: {
          nlpAnchor: module.nlpAnchor,
          thinkingSkill: module.thinkingSkill
        }
      },
      {
        id: `nlefp_${moduleId}_practice`,
        title: `${module.theme} - Practice Worksheet`,
        type: 'worksheet',
        cefrLevel: 'A1',
        skillFocus: ['grammar', 'writing'],
        theme: module.theme,
        duration: 20,
        description: `Structured practice for ${module.coreFocus}`,
        tags: [module.theme.toLowerCase(), 'grammar', 'practice'],
        content: {
          exercises: [
            {
              type: 'fill_blank',
              instruction: `Complete sentences about ${module.theme}`,
              nlpElement: module.nlpAnchor
            }
          ]
        }
      }
    ];
  }
}

export const nlefpCurriculumService = new NLEFPCurriculumService();
