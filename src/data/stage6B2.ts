import { Unit } from '@/types/englishJourney';

export const STAGE_6_B2: Unit[] = [
  {
    id: "b2-unit-1",
    unitNumber: 1,
    topic: "Academic English",
    keyVocabulary: ["analyze", "evaluate", "synthesize", "argue", "conclude", "assess"],
    grammarFocus: ["Academic structures", "Passive voice", "Nominal clauses"],
    functionLanguage: ["Academic writing", "Formal discussion", "Critical analysis"],
    goal: "Debate, discuss, and write with clarity and confidence",
    
    listening: {
      description: "Understand academic lectures",
      tasks: ["Lecture comprehension", "Academic podcast analysis", "Conference talk notes"],
      duration: 18
    },
    
    speaking: {
      description: "Academic presentations and debates",
      tasks: ["Formal presentations", "Academic debates", "Seminar discussions"],
      duration: 20
    },
    
    reading: {
      description: "Academic texts and articles",
      tasks: ["Research article reading", "Critical analysis", "Literature review"],
      duration: 18
    },
    
    writing: {
      description: "Academic essays and reports",
      tasks: ["Essay structure", "Research report", "Critical analysis essay"],
      duration: 14
    },
    
    presentation: {
      duration: 18,
      activities: ["Academic language introduction", "Essay structure teaching", "Citation methods"],
      materials: ["Academic phrase bank", "Essay templates", "Sample papers"],
      teacherInstructions: "Model academic register. Teach formal vs informal distinctions."
    },
    
    practice: {
      duration: 22,
      activities: ["Academic writing practice", "Presentation rehearsals", "Debate preparation"],
      materials: ["Writing prompts", "Presentation rubrics", "Debate topics"],
      teacherInstructions: "Provide detailed feedback on academic style. Peer review activities."
    },
    
    production: {
      duration: 20,
      activities: ["Research presentation", "Academic debate", "Portfolio essay"],
      materials: ["Presentation tools", "Debate format", "Assessment rubrics"],
      teacherInstructions: "Assess both content and language. Prepare for standardized tests."
    },
    
    gamesActivities: [
      { id: "academic-challenge", name: "Academic Challenge", type: "quiz", description: "Academic vocabulary and structures", duration: 15 },
      { id: "debate-championship", name: "Debate Championship", type: "interactive", description: "Formal debate competition", duration: 20 }
    ],
    
    xpReward: 300,
    badges: ["Academic Excellence 🎓"],
    estimatedDuration: 60,
    
    materials: [
      { id: "m41", name: "Academic Phrase Bank", type: "pdf", downloadable: true },
      { id: "m42", name: "Essay Structure Guide", type: "worksheet", downloadable: true }
    ],
    
    teacherNotes: "Prepare students for university-level English. Focus on critical thinking."
  }
  // Additional units would follow
];
