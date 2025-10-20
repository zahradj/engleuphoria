import { Unit } from '@/types/englishJourney';

export const STAGE_5_B1: Unit[] = [
  {
    id: "b1-unit-1",
    unitNumber: 1,
    topic: "Everyday Conversations",
    keyVocabulary: ["opinion", "agree", "disagree", "discuss", "argue", "debate"],
    grammarFocus: ["Complex sentences", "Connectors", "Modal verbs of opinion"],
    functionLanguage: ["Expressing opinions", "Agreeing/disagreeing", "Debating"],
    goal: "Handle everyday conversation confidently",
    
    listening: {
      description: "Understand natural conversations",
      tasks: ["Debate listening", "Opinion podcasts", "Conversation analysis"],
      duration: 15
    },
    
    speaking: {
      description: "Express complex opinions",
      tasks: ["Opinion discussions", "Mini debates", "Conversation practice"],
      duration: 18
    },
    
    reading: {
      description: "Read opinion texts",
      tasks: ["Opinion articles", "Debate transcripts", "Editorial reading"],
      duration: 15
    },
    
    writing: {
      description: "Write opinion pieces",
      tasks: ["Opinion paragraphs", "For/Against essay", "Letter to editor"],
      duration: 12
    },
    
    presentation: {
      duration: 15,
      activities: ["Opinion language introduction", "Debate structure", "Conversation patterns"],
      materials: ["Opinion phrases chart", "Debate format", "Conversation examples"],
      teacherInstructions: "Model respectful disagreement. Teach debate etiquette."
    },
    
    practice: {
      duration: 20,
      activities: ["Opinion exchanges", "Structured debates", "Conversation role-plays"],
      materials: ["Topic cards", "Debate structure sheets", "Role-play scenarios"],
      teacherInstructions: "Monitor for appropriate language use. Encourage evidence-based opinions."
    },
    
    production: {
      duration: 20,
      activities: ["Class debate tournament", "Opinion video recording", "Podcast creation"],
      materials: ["Recording equipment", "Debate topics", "Rubrics"],
      teacherInstructions: "Create authentic communication tasks. Assess fluency and accuracy."
    },
    
    gamesActivities: [
      { id: "debate-master", name: "Debate Master", type: "interactive", description: "Structured debate practice", duration: 15 },
      { id: "opinion-builder", name: "Opinion Builder", type: "interactive", description: "Build complex arguments", duration: 12 }
    ],
    
    xpReward: 250,
    badges: ["Confident Speaker 💬"],
    estimatedDuration: 55,
    
    materials: [
      { id: "m39", name: "Opinion Language Bank", type: "pdf", downloadable: true },
      { id: "m40", name: "Debate Structure Guide", type: "worksheet", downloadable: true }
    ],
    
    teacherNotes: "Focus on fluency and natural expression. Encourage critical thinking."
  }
  // Additional units would follow
];
