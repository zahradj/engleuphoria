import { Unit } from '@/types/englishJourney';

export const STAGE_2_A1: Unit[] = [
  {
    id: "a1-unit-1",
    unitNumber: 1,
    topic: "My Day",
    keyVocabulary: ["wake up", "breakfast", "school", "homework", "dinner", "bedtime"],
    grammarFocus: ["Present Simple", "I wake up at...", "I go to..."],
    functionLanguage: ["Talking about daily routines", "Telling time"],
    goal: "Talk about daily routines",
    
    listening: {
      description: "Listen to daily routine descriptions",
      tasks: ["Listen to 'My Day' song", "Match times to activities", "Daily routine story"],
      duration: 10
    },
    
    speaking: {
      description: "Describe your daily routine",
      tasks: ["I wake up at... drill", "Partner interview", "My perfect day presentation"],
      duration: 12
    },
    
    reading: {
      description: "Read about daily activities",
      tasks: ["Read daily routine schedule", "Match activities to times", "Story: Tom's Day"],
      duration: 10
    },
    
    writing: {
      description: "Write about your day",
      tasks: ["Complete sentences", "Write your schedule", "My Day diary entry"],
      duration: 8
    },
    
    presentation: {
      duration: 12,
      activities: ["Teacher's daily routine presentation", "Clock time practice", "Action flashcards"],
      materials: ["Clock", "Routine flashcards", "Daily schedule poster"],
      teacherInstructions: "Use a large clock for time practice. Model your own routine first."
    },
    
    practice: {
      duration: 15,
      activities: ["Time matching game", "Routine sequencing", "What time do you...? pairs"],
      materials: ["Time cards", "Routine pictures", "Interview worksheets"],
      teacherInstructions: "Focus on natural pronunciation of times and activities."
    },
    
    production: {
      duration: 13,
      activities: ["Create My Day poster", "Daily routine presentation", "Class schedule book"],
      materials: ["Paper", "Markers", "Clock stamps"],
      teacherInstructions: "Encourage detailed descriptions. Display all work."
    },
    
    gamesActivities: [
      { id: "time-match", name: "Time Matching", type: "matching", description: "Match times to activities", duration: 10 },
      { id: "routine-race", name: "Routine Race", type: "interactive", description: "Order your day fastest", duration: 8 }
    ],
    
    xpReward: 150,
    badges: ["Daily Routine Master ⏰"],
    estimatedDuration: 40,
    
    materials: [
      { id: "m33", name: "Daily Routine Flashcards", type: "flashcard", downloadable: true },
      { id: "m34", name: "Clock Practice Sheet", type: "worksheet", downloadable: true }
    ],
    
    teacherNotes: "Connect to students' real lives. Use authentic schedules."
  }
  // Additional 7 units would follow similar structure
];
