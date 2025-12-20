// Mascot Configuration for Early Learners

export interface MascotEmotion {
  name: string;
  emoji: string;
  description: string;
  animation?: string;
}

export interface Mascot {
  id: string;
  name: string;
  species: string;
  emoji: string;
  description: string;
  catchphrase: string;
  defaultEmotion: string;
  emotions: Record<string, MascotEmotion>;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const BENNY_THE_BEAR: Mascot = {
  id: 'benny',
  name: 'Benny',
  species: 'Bear',
  emoji: '🐻',
  description: 'A friendly, curious bear who loves learning English and making new friends!',
  catchphrase: 'Let\'s learn together!',
  defaultEmotion: 'happy',
  emotions: {
    happy: {
      name: 'Happy',
      emoji: '😊',
      description: 'Benny is happy and ready to learn!',
      animation: 'bounce'
    },
    excited: {
      name: 'Excited',
      emoji: '🤩',
      description: 'Benny is super excited about something!',
      animation: 'jump'
    },
    waving: {
      name: 'Waving',
      emoji: '👋',
      description: 'Benny is waving hello!',
      animation: 'wave'
    },
    thinking: {
      name: 'Thinking',
      emoji: '🤔',
      description: 'Benny is thinking carefully...',
      animation: 'pulse'
    },
    celebrating: {
      name: 'Celebrating',
      emoji: '🎉',
      description: 'Benny is celebrating your success!',
      animation: 'spin'
    },
    encouraging: {
      name: 'Encouraging',
      emoji: '💪',
      description: 'Benny believes in you!',
      animation: 'nod'
    },
    surprised: {
      name: 'Surprised',
      emoji: '😮',
      description: 'Benny is surprised!',
      animation: 'shake'
    },
    sleeping: {
      name: 'Sleeping',
      emoji: '😴',
      description: 'Benny is resting...',
      animation: 'float'
    }
  },
  colors: {
    primary: 'hsl(30, 60%, 45%)', // Warm brown
    secondary: 'hsl(40, 70%, 60%)', // Golden tan
    accent: 'hsl(45, 90%, 55%)' // Honey yellow
  }
};

// All available mascots
export const MASCOTS: Record<string, Mascot> = {
  benny: BENNY_THE_BEAR,
};

// Helper function to get mascot by ID
export const getMascot = (id: string): Mascot => {
  return MASCOTS[id] || BENNY_THE_BEAR;
};

// Helper function to get mascot emotion
export const getMascotEmotion = (mascotId: string, emotion: string): MascotEmotion => {
  const mascot = getMascot(mascotId);
  return mascot.emotions[emotion] || mascot.emotions[mascot.defaultEmotion];
};
