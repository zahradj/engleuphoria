import { ESLLevel, ESLSkill, AITemplate, ESLMaterial } from "@/types/eslCurriculum";
// Mock AI templates service since it was removed
const getAITemplates = () => [];
const generateAIContent = (prompt: string) => Promise.resolve("");
import { getBadgeSystem } from './badgeSystemService';

// Enhanced 12-level ESL curriculum with age-appropriate progression
const ESL_LEVELS: ESLLevel[] = [
  {
    id: "pre-a1",
    name: "True Beginner",
    cefrLevel: "Pre-A1",
    ageGroup: "Young Learners (4-7 years)",
    description: "Complete beginners with no English knowledge. Focus on basic vocabulary, simple phrases, and playful learning through songs and games.",
    levelOrder: 1,
    xpRequired: 0,
    estimatedHours: 50,
    skills: [
      {
        id: "basic-greetings",
        name: "Basic Greetings",
        category: "speaking",
        description: "Learning hello, goodbye, and simple introductions",
        canStudentPractice: true,
        ageAppropriate: true,
        vocabularyThemes: ["greetings", "introductions"]
      },
      {
        id: "numbers-colors",
        name: "Numbers and Colors",
        category: "vocabulary",
        description: "Basic numbers 1-10 and primary colors",
        canStudentPractice: true,
        ageAppropriate: true,
        vocabularyThemes: ["numbers", "colors"]
      },
      {
        id: "simple-songs",
        name: "Educational Songs",
        category: "songs",
        description: "Learning through music and rhythm",
        canStudentPractice: true,
        ageAppropriate: true,
        vocabularyThemes: ["songs", "rhythm"]
      }
    ]
  },
  {
    id: "a1",
    name: "Beginner",
    cefrLevel: "A1",
    ageGroup: "Elementary (6-9 years)",
    description: "Basic everyday expressions and simple interactions. Can introduce themselves and ask basic questions about personal details.",
    levelOrder: 2,
    xpRequired: 500,
    estimatedHours: 80,
    skills: [
      {
        id: "simple-present",
        name: "Simple Present Tense",
        category: "grammar",
        description: "Basic sentence structures with simple present",
        canStudentPractice: true,
        ageAppropriate: true,
        grammarPoints: ["simple present", "be verb", "basic sentences"]
      },
      {
        id: "family-vocabulary",
        name: "Family and Friends",
        category: "vocabulary",
        description: "Learning about family members and relationships",
        canStudentPractice: true,
        ageAppropriate: true,
        vocabularyThemes: ["family", "friends", "relationships"]
      },
      {
        id: "basic-listening",
        name: "Basic Listening",
        category: "listening",
        description: "Understanding simple spoken instructions",
        canStudentPractice: true,
        ageAppropriate: true
      }
    ]
  },
  {
    id: "a1-plus",
    name: "High Beginner",
    cefrLevel: "A1+",
    ageGroup: "Elementary (8-11 years)",
    description: "Enhanced beginner skills with more complex sentence structures and expanded vocabulary for familiar topics.",
    levelOrder: 3,
    xpRequired: 800,
    estimatedHours: 100,
    skills: [
      {
        id: "present-continuous",
        name: "Present Continuous",
        category: "grammar",
        description: "Describing actions happening now",
        canStudentPractice: true,
        ageAppropriate: true,
        grammarPoints: ["present continuous", "-ing form", "time expressions"]
      },
      {
        id: "daily-activities",
        name: "Daily Activities",
        category: "vocabulary",
        description: "Vocabulary for everyday routines and activities",
        canStudentPractice: true,
        ageAppropriate: true,
        vocabularyThemes: ["daily routine", "activities", "time"]
      },
      {
        id: "basic-reading",
        name: "Basic Reading",
        category: "reading",
        description: "Reading simple texts and stories",
        canStudentPractice: true,
        ageAppropriate: true
      }
    ]
  },
  {
    id: "a2",
    name: "Elementary",
    cefrLevel: "A2",
    ageGroup: "Pre-Teen (10-13 years)",
    description: "Understanding frequently used expressions related to immediate relevance. Can communicate in simple routine tasks.",
    levelOrder: 4,
    xpRequired: 1200,
    estimatedHours: 120,
    skills: [
      {
        id: "past-simple",
        name: "Past Simple Tense",
        category: "grammar",
        description: "Talking about past events and experiences",
        canStudentPractice: true,
        ageAppropriate: true,
        grammarPoints: ["past simple", "regular verbs", "irregular verbs"]
      },
      {
        id: "hobbies-interests",
        name: "Hobbies and Interests",
        category: "vocabulary",
        description: "Expressing personal interests and hobbies",
        canStudentPractice: true,
        ageAppropriate: true,
        vocabularyThemes: ["hobbies", "sports", "entertainment"]
      },
      {
        id: "simple-conversations",
        name: "Simple Conversations",
        category: "speaking",
        description: "Engaging in basic conversations",
        canStudentPractice: true,
        ageAppropriate: true
      }
    ]
  },
  {
    id: "a2-plus",
    name: "High Elementary",
    cefrLevel: "A2+",
    ageGroup: "Teen (12-15 years)",
    description: "Advanced elementary skills with ability to handle more complex communication situations and longer conversations.",
    levelOrder: 5,
    xpRequired: 1600,
    estimatedHours: 140,
    skills: [
      {
        id: "future-tenses",
        name: "Future Tenses",
        category: "grammar",
        description: "Expressing future plans and predictions",
        canStudentPractice: true,
        ageAppropriate: true,
        grammarPoints: ["will", "going to", "present continuous for future"]
      },
      {
        id: "school-subjects",
        name: "School and Education",
        category: "vocabulary",
        description: "Academic vocabulary and school-related topics",
        canStudentPractice: true,
        ageAppropriate: true,
        vocabularyThemes: ["school subjects", "education", "learning"]
      },
      {
        id: "intermediate-writing",
        name: "Paragraph Writing",
        category: "writing",
        description: "Writing simple paragraphs and descriptions",
        canStudentPractice: true,
        ageAppropriate: true
      }
    ]
  },
  {
    id: "b1",
    name: "Intermediate",
    cefrLevel: "B1",
    ageGroup: "Teen (14-17 years)",
    description: "Can understand main points of clear standard input on familiar matters. Can deal with most travel and work situations.",
    levelOrder: 6,
    xpRequired: 2200,
    estimatedHours: 160,
    skills: [
      {
        id: "present-perfect",
        name: "Present Perfect Tense",
        category: "grammar",
        description: "Connecting past and present experiences",
        canStudentPractice: true,
        ageAppropriate: true,
        grammarPoints: ["present perfect", "have/has", "since/for"]
      },
      {
        id: "travel-culture",
        name: "Travel and Culture",
        category: "vocabulary",
        description: "Discussing travel experiences and cultural differences",
        canStudentPractice: true,
        ageAppropriate: true,
        vocabularyThemes: ["travel", "culture", "countries"]
      },
      {
        id: "intermediate-listening",
        name: "Intermediate Listening",
        category: "listening",
        description: "Understanding longer conversations and presentations",
        canStudentPractice: true,
        ageAppropriate: true
      }
    ]
  },
  {
    id: "b1-plus",
    name: "High Intermediate",
    cefrLevel: "B1+",
    ageGroup: "Teen+ (16+ years)",
    description: "Enhanced intermediate skills with better fluency and ability to express opinions and explain viewpoints on topical issues.",
    levelOrder: 7,
    xpRequired: 2800,
    estimatedHours: 180,
    skills: [
      {
        id: "modal-verbs",
        name: "Modal Verbs",
        category: "grammar",
        description: "Expressing possibility, necessity, and advice",
        canStudentPractice: true,
        ageAppropriate: true,
        grammarPoints: ["can/could", "should/must", "might/may"]
      },
      {
        id: "work-career",
        name: "Work and Career",
        category: "vocabulary",
        description: "Professional vocabulary and career discussions",
        canStudentPractice: true,
        ageAppropriate: true,
        vocabularyThemes: ["jobs", "workplace", "career"]
      },
      {
        id: "opinion-expression",
        name: "Expressing Opinions",
        category: "speaking",
        description: "Giving opinions and justifying viewpoints",
        canStudentPractice: true,
        ageAppropriate: true
      }
    ]
  },
  {
    id: "b2",
    name: "Upper-Intermediate",
    cefrLevel: "B2",
    ageGroup: "Teen+ (16+ years)",
    description: "Can understand complex texts and interact with fluency. Can produce clear, detailed text on a wide range of subjects.",
    levelOrder: 8,
    xpRequired: 3600,
    estimatedHours: 200,
    skills: [
      {
        id: "conditional-sentences",
        name: "Conditional Sentences",
        category: "grammar",
        description: "Expressing hypothetical situations and consequences",
        canStudentPractice: true,
        ageAppropriate: true,
        grammarPoints: ["first conditional", "second conditional", "third conditional"]
      },
      {
        id: "academic-vocabulary",
        name: "Academic Vocabulary",
        category: "vocabulary",
        description: "Advanced vocabulary for academic and professional contexts",
        canStudentPractice: true,
        ageAppropriate: true,
        vocabularyThemes: ["academic writing", "formal language", "research"]
      },
      {
        id: "advanced-writing",
        name: "Essay Writing",
        category: "writing",
        description: "Writing structured essays and reports",
        canStudentPractice: true,
        ageAppropriate: true
      }
    ]
  },
  {
    id: "b2-plus",
    name: "Advanced",
    cefrLevel: "B2+",
    ageGroup: "Teen+ (16+ years)",
    description: "Advanced language skills with ability to handle complex communication in various contexts.",
    levelOrder: 9,
    xpRequired: 4500,
    estimatedHours: 220,
    skills: [
      {
        id: "passive-voice",
        name: "Passive Voice",
        category: "grammar",
        description: "Using passive constructions appropriately",
        canStudentPractice: true,
        ageAppropriate: true,
        grammarPoints: ["passive voice", "by agent", "impersonal constructions"]
      },
      {
        id: "formal-informal",
        name: "Register and Style",
        category: "vocabulary",
        description: "Distinguishing formal and informal language use",
        canStudentPractice: true,
        ageAppropriate: true,
        vocabularyThemes: ["formal language", "informal language", "register"]
      },
      {
        id: "presentation-skills",
        name: "Presentation Skills",
        category: "speaking",
        description: "Giving structured presentations and speeches",
        canStudentPractice: true,
        ageAppropriate: true
      }
    ]
  },
  {
    id: "c1",
    name: "Proficient",
    cefrLevel: "C1",
    ageGroup: "Teen+ (16+ years)",
    description: "Proficient language use with fluent, spontaneous expression without obvious searching for words.",
    levelOrder: 10,
    xpRequired: 5500,
    estimatedHours: 250,
    skills: [
      {
        id: "advanced-grammar",
        name: "Advanced Grammar",
        category: "grammar",
        description: "Complex grammatical structures and nuanced usage",
        canStudentPractice: true,
        ageAppropriate: true,
        grammarPoints: ["subjunctive", "inversion", "cleft sentences"]
      },
      {
        id: "idiomatic-expressions",
        name: "Idiomatic Expressions",
        category: "vocabulary",
        description: "Natural use of idioms and colloquial expressions",
        canStudentPractice: true,
        ageAppropriate: true,
        vocabularyThemes: ["idioms", "phrasal verbs", "colloquialisms"]
      },
      {
        id: "debate-discussion",
        name: "Debate and Discussion",
        category: "speaking",
        description: "Participating in complex debates and discussions",
        canStudentPractice: true,
        ageAppropriate: true
      }
    ]
  },
  {
    id: "c1-plus",
    name: "Advanced Proficient",
    cefrLevel: "C1+",
    ageGroup: "Teen+ (16+ years)",
    description: "Near-native proficiency with sophisticated language use in academic and professional contexts.",
    levelOrder: 11,
    xpRequired: 6500,
    estimatedHours: 280,
    skills: [
      {
        id: "academic-writing",
        name: "Academic Writing",
        category: "writing",
        description: "Sophisticated academic and research writing",
        canStudentPractice: true,
        ageAppropriate: true,
        grammarPoints: ["complex sentences", "academic style", "citation"]
      },
      {
        id: "specialized-vocabulary",
        name: "Specialized Vocabulary",
        category: "vocabulary",
        description: "Field-specific and technical vocabulary",
        canStudentPractice: true,
        ageAppropriate: true,
        vocabularyThemes: ["technical terms", "specialized fields", "professional jargon"]
      },
      {
        id: "critical-analysis",
        name: "Critical Analysis",
        category: "reading",
        description: "Analyzing and critiquing complex texts",
        canStudentPractice: true,
        ageAppropriate: true
      }
    ]
  },
  {
    id: "c2",
    name: "Mastery",
    cefrLevel: "C2",
    ageGroup: "Teen+ (16+ years)",
    description: "Native-like proficiency with effortless understanding and expression in all contexts.",
    levelOrder: 12,
    xpRequired: 8000,
    estimatedHours: 300,
    skills: [
      {
        id: "native-fluency",
        name: "Native-like Fluency",
        category: "speaking",
        description: "Effortless, natural communication in all contexts",
        canStudentPractice: true,
        ageAppropriate: true
      },
      {
        id: "literary-language",
        name: "Literary Language",
        category: "vocabulary",
        description: "Understanding and using literary and poetic language",
        canStudentPractice: true,
        ageAppropriate: true,
        vocabularyThemes: ["literary devices", "poetic language", "classical references"]
      },
      {
        id: "exam-preparation",
        name: "Exam Preparation",
        category: "exam_prep",
        description: "Preparation for advanced English proficiency exams",
        canStudentPractice: true,
        ageAppropriate: true
      }
    ]
  }
];

class ESLCurriculumService {
  getAllLevels(): ESLLevel[] {
    return ESL_LEVELS;
  }

  getLevelById(id: string): ESLLevel | undefined {
    return ESL_LEVELS.find(level => level.id === id);
  }

  getLevelsByAgeGroup(ageGroup: string): ESLLevel[] {
    return ESL_LEVELS.filter(level => level.ageGroup.includes(ageGroup));
  }

  getSkillsByCategory(category: string): ESLSkill[] {
    const allSkills: ESLSkill[] = [];
    ESL_LEVELS.forEach(level => {
      level.skills.forEach(skill => {
        if (skill.category === category) {
          allSkills.push(skill);
        }
      });
    });
    return allSkills;
  }

  getLevelProgress(levelId: string, completedMaterials: string[]): number {
    const level = this.getLevelById(levelId);
    if (!level) return 0;
    
    // This would be calculated based on actual material completion
    // For now, return a mock progress
    return Math.floor(Math.random() * 100);
  }

  getAITemplates(): any[] {
    return getAITemplates();
  }

  async generateAIContent(templateId: string, parameters: Record<string, any>): Promise<any> {
    return generateAIContent(templateId);
  }

  getBadgeSystem() {
    return getBadgeSystem();
  }
}

export const eslCurriculumService = new ESLCurriculumService();
