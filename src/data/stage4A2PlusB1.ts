import { Unit } from '@/types/englishJourney';

export const STAGE_4_A2_PLUS_B1: Unit[] = [
  {
    id: "a2b1-unit-1",
    unitNumber: 1,
    topic: "Future Plans",
    keyVocabulary: ["tomorrow", "next week", "will", "going to", "plan", "dream"],
    grammarFocus: ["Future tenses", "will vs going to", "Time expressions"],
    functionLanguage: ["Making plans", "Predictions", "Intentions"],
    goal: "Talk about future plans and dreams",
    
    listening: {
      description: "Listen to future plans",
      tasks: ["Future plans interviews", "Prediction listening", "Dream career stories"],
      duration: 12
    },
    
    speaking: {
      description: "Express future intentions",
      tasks: ["What will you do? discussion", "Future predictions", "My Dream presentation"],
      duration: 15
    },
    
    reading: {
      description: "Read about future events",
      tasks: ["Future tense texts", "Plan comprehension", "Career articles"],
      duration: 12
    },
    
    writing: {
      description: "Write about plans",
      tasks: ["Future sentences", "Next week plan", "My Future essay"],
      duration: 11
    },
    
    presentation: {
      duration: 15,
      activities: ["Future tense explanation", "Timeline future", "Will vs Going to chart"],
      materials: ["Grammar charts", "Future timeline", "Example texts"],
      teacherInstructions: "Clearly differentiate will and going to. Use visual aids."
    },
    
    practice: {
      duration: 18,
      activities: ["Future tense exercises", "Planning dialogues", "Prediction game"],
      materials: ["Grammar worksheets", "Dialogue cards", "Crystal ball prop"],
      teacherInstructions: "Provide structured practice before free production."
    },
    
    production: {
      duration: 17,
      activities: ["Future timeline project", "Dream career presentation", "Class predictions book"],
      materials: ["Project materials", "Presentation templates", "Recording tools"],
      teacherInstructions: "Encourage creative future thinking. Support extended speaking."
    },
    
    gamesActivities: [
      { id: "future-quest", name: "Future Quest", type: "interactive", description: "Plan your future adventure", duration: 12 },
      { id: "will-going", name: "Will or Going To?", type: "quiz", description: "Choose correct form", duration: 10 }
    ],
    
    xpReward: 200,
    badges: ["Future Planner 🚀"],
    estimatedDuration: 50,
    
    materials: [
      { id: "m37", name: "Future Tense Charts", type: "pdf", downloadable: true },
      { id: "m38", name: "Planning Worksheets", type: "worksheet", downloadable: true }
    ],
    
    teacherNotes: "Complex grammar - scaffold carefully. Connect to students' real dreams."
  }
  // Additional units would follow
];
