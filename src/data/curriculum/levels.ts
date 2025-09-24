export interface CurriculumLevel {
  id: string;
  name: string;
  cefrLevel: string;
  ageGroup: string;
  description: string;
  color: string;
  icon: string;
  estimatedHours: number;
  modules: number;
  lessonsPerModule: number;
}

export const curriculumLevels: CurriculumLevel[] = [
  {
    id: 'pre-starters',
    name: 'Pre-Starters',
    cefrLevel: 'Pre-A1',
    ageGroup: '4-6 years',
    description: 'Foundational skills through play, songs, and simple activities',
    color: 'bg-red-100 text-red-800',
    icon: '🌱',
    estimatedHours: 60,
    modules: 6,
    lessonsPerModule: 10
  },
  {
    id: 'starters',
    name: 'Starters',
    cefrLevel: 'A1',
    ageGroup: '6-8 years',
    description: 'Basic communication skills and everyday vocabulary',
    color: 'bg-orange-100 text-orange-800',
    icon: '🌟',
    estimatedHours: 80,
    modules: 8,
    lessonsPerModule: 10
  },
  {
    id: 'movers',
    name: 'Movers',
    cefrLevel: 'A2',
    ageGroup: '8-10 years',
    description: 'Elementary level communication in familiar situations',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '🚀',
    estimatedHours: 100,
    modules: 10,
    lessonsPerModule: 10
  },
  {
    id: 'flyers',
    name: 'Flyers',
    cefrLevel: 'B1',
    ageGroup: '10-12 years',
    description: 'Intermediate foundation with confident communication',
    color: 'bg-green-100 text-green-800',
    icon: '✈️',
    estimatedHours: 120,
    modules: 12,
    lessonsPerModule: 10
  },
  {
    id: 'achievers',
    name: 'Achievers',
    cefrLevel: 'B1+',
    ageGroup: '12-14 years',
    description: 'Strong intermediate skills for academic and social contexts',
    color: 'bg-blue-100 text-blue-800',
    icon: '🏆',
    estimatedHours: 140,
    modules: 14,
    lessonsPerModule: 10
  },
  {
    id: 'advanced',
    name: 'Advanced',
    cefrLevel: 'B2',
    ageGroup: '14-16 years',
    description: 'Upper intermediate with fluent communication abilities',
    color: 'bg-indigo-100 text-indigo-800',
    icon: '🎓',
    estimatedHours: 160,
    modules: 16,
    lessonsPerModule: 10
  },
  {
    id: 'proficiency',
    name: 'Proficiency',
    cefrLevel: 'C1',
    ageGroup: '16+ years',
    description: 'Advanced level with sophisticated language use',
    color: 'bg-purple-100 text-purple-800',
    icon: '💎',
    estimatedHours: 180,
    modules: 18,
    lessonsPerModule: 10
  },
  {
    id: 'mastery',
    name: 'Mastery',
    cefrLevel: 'C2',
    ageGroup: '16+ years',
    description: 'Near-native proficiency with nuanced expression',
    color: 'bg-pink-100 text-pink-800',
    icon: '👑',
    estimatedHours: 200,
    modules: 20,
    lessonsPerModule: 10
  }
];

export const getLevelById = (id: string): CurriculumLevel | undefined => {
  return curriculumLevels.find(level => level.id === id);
};

export const getLevelByCefr = (cefrLevel: string): CurriculumLevel | undefined => {
  return curriculumLevels.find(level => level.cefrLevel === cefrLevel);
};