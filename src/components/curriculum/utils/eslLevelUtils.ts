
export const getLevelColor = (cefrLevel: string) => {
  const colors = {
    'Pre-A1': 'bg-pink-100 text-pink-800 border-pink-200',
    'A1': 'bg-green-100 text-green-800 border-green-200',
    'A1+': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'A2': 'bg-blue-100 text-blue-800 border-blue-200',
    'A2+': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'B1': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'B1+': 'bg-amber-100 text-amber-800 border-amber-200',
    'B2': 'bg-orange-100 text-orange-800 border-orange-200',
    'B2+': 'bg-red-100 text-red-800 border-red-200',
    'C1': 'bg-purple-100 text-purple-800 border-purple-200',
    'C2': 'bg-violet-100 text-violet-800 border-violet-200'
  };
  return colors[cefrLevel] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getAgeIcon = (ageGroup: string) => {
  if (ageGroup.includes('4-7') || ageGroup.includes('True Beginners')) return 'Baby';
  if (ageGroup.includes('6-9') || ageGroup.includes('8-11') || ageGroup.includes('9-13')) return 'User';
  if (ageGroup.includes('12-15') || ageGroup.includes('13-16') || ageGroup.includes('Teens')) return 'Users';
  return 'GraduationCap';
};

export const getSkillIcon = (category: string) => {
  const icons = {
    'listening': '🎧',
    'speaking': '💬',
    'reading': '📖',
    'writing': '✍️',
    'grammar': '📝',
    'vocabulary': '📚',
    'pronunciation': '🗣️',
    'songs': '🎵',
    'games': '🎮',
    'exam_prep': '📋'
  };
  return icons[category] || '📋';
};

export const getDifficultyLevel = (levelOrder: number) => {
  if (levelOrder <= 2) return { label: 'Beginner', color: 'bg-green-500' };
  if (levelOrder <= 4) return { label: 'Elementary', color: 'bg-blue-500' };
  if (levelOrder <= 6) return { label: 'Intermediate', color: 'bg-yellow-500' };
  return { label: 'Advanced', color: 'bg-red-500' };
};
