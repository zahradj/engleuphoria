import { Unit } from '@/types/englishJourney';

export const STAGE_3_A2: Unit[] = [
  {
    id: "a2-unit-1",
    unitNumber: 1,
    topic: "My Weekends",
    keyVocabulary: ["yesterday", "last weekend", "went", "played", "visited", "watched"],
    grammarFocus: ["Past Simple", "I went to...", "I played..."],
    functionLanguage: ["Talking about past events", "Describing activities"],
    goal: "Talk about past events",
    
    listening: {
      description: "Listen to weekend stories",
      tasks: ["Weekend story comprehension", "Past tense identification", "True/False listening"],
      duration: 10
    },
    
    speaking: {
      description: "Describe your weekend",
      tasks: ["What did you do? drill", "Weekend sharing circle", "Story chain game"],
      duration: 12
    },
    
    reading: {
      description: "Read past tense stories",
      tasks: ["Weekend diary reading", "Past tense recognition", "Story sequencing"],
      duration: 10
    },
    
    writing: {
      description: "Write about your weekend",
      tasks: ["Past tense sentence building", "Weekend diary", "My Best Weekend story"],
      duration: 8
    },
    
    presentation: {
      duration: 12,
      activities: ["Teacher's weekend story", "Past tense verb introduction", "Timeline demonstration"],
      materials: ["Weekend photos", "Verb cards", "Timeline poster"],
      teacherInstructions: "Use visual timeline to show past. Share authentic weekend story."
    },
    
    practice: {
      duration: 15,
      activities: ["Past tense verb matching", "Weekend interview pairs", "Story building game"],
      materials: ["Verb cards", "Interview forms", "Story dice"],
      teacherInstructions: "Focus on irregular past forms. Lots of repetition needed."
    },
    
    production: {
      duration: 13,
      activities: ["My Weekend comic strip", "Class weekend book", "Weekend news presentation"],
      materials: ["Comic templates", "Writing paper", "Presentation props"],
      teacherInstructions: "Celebrate all stories. Create class memory book."
    },
    
    gamesActivities: [
      { id: "past-match", name: "Past Tense Match", type: "matching", description: "Match present to past verbs", duration: 10 },
      { id: "story-builder", name: "Story Builder", type: "interactive", description: "Build weekend stories", duration: 8 }
    ],
    
    xpReward: 150,
    badges: ["Past Tense Pro 📅"],
    estimatedDuration: 40,
    
    materials: [
      { id: "m35", name: "Past Tense Verb Cards", type: "flashcard", downloadable: true },
      { id: "m36", name: "Weekend Diary Template", type: "worksheet", downloadable: true }
    ],
    
    teacherNotes: "First introduction to past tense - be patient. Use lots of examples."
  }
  // Additional 6 units would follow
];
