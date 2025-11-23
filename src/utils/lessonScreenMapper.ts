/**
 * Maps AI-generated lesson screens to SlideRenderer format
 */

export function mapScreenToSlide(screen: any, screenIndex: number) {
  const baseSlide = {
    title: screen.title || '',
    content: screen.content || screen.description || '',
    ...screen
  };

  // Map screen types to SlideRenderer expected types
  const typeMapping: Record<string, string> = {
    'home': 'warmup',
    'vocabulary': 'vocabulary',
    'vocabulary_preview': 'vocabulary_preview',
    'phonics': 'phonics',
    'grammar': 'grammar_focus',
    'grammar_focus': 'grammar_focus',
    'dialogue': 'dialogue_practice',
    'dialogue_practice': 'dialogue_practice',
    'listening': 'listening_comprehension',
    'listening_comprehension': 'listening_comprehension',
    'speaking': 'speaking_practice',
    'speaking_practice': 'speaking_practice',
    'sentence_builder': 'sentence_builder',
    'matching': 'match',
    'drag_drop': 'drag_drop',
    'spinning_wheel': 'spinning_wheel',
    'sorting': 'sorting',
    'quiz': 'end_quiz',
    'end_quiz': 'end_quiz',
    'badge_reward': 'rewards',
    'rewards': 'rewards',
    'celebration': 'celebration',
    'controlled_practice': 'controlled_practice',
    'point_and_say': 'point_and_say'
  };

  const mappedType = typeMapping[screen.screenType?.toLowerCase() || screen.type?.toLowerCase()] || screen.type || 'default';

  return {
    ...baseSlide,
    type: mappedType,
    slideNumber: screenIndex + 1
  };
}

export function mapLessonScreens(screens: any[]) {
  return screens.map((screen, index) => mapScreenToSlide(screen, index));
}
