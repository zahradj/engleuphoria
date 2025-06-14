
import { ComprehensionStrategy } from '@/types/curriculumTypes';

export const COMPREHENSION_STRATEGIES: ComprehensionStrategy[] = [
  {
    id: "visual_anchoring",
    name: "Visual Anchoring",
    description: "Link grammar concepts to memorable images",
    technique: "Associate each grammar rule with a visual metaphor",
    application: "Use consistent visual symbols for parts of speech",
    visualComponent: "Color-coded grammar maps and symbol systems"
  },
  {
    id: "pattern_games",
    name: "Pattern Recognition Games",
    description: "Identify sentence patterns through interactive games",
    technique: "Gamified pattern matching and completion exercises",
    application: "Students recognize patterns before learning rules",
    visualComponent: "Interactive pattern matching interfaces"
  },
  {
    id: "chunking",
    name: "Chunking Technique",
    description: "Group words into meaningful phrases",
    technique: "Break sentences into logical word groups",
    application: "Improve reading speed and comprehension",
    visualComponent: "Phrase boundary visualization tools"
  },
  {
    id: "backward_building",
    name: "Backward Building",
    description: "Start with complete sentences, then deconstruct",
    technique: "Reverse engineering sentence construction",
    application: "Understanding how complex sentences are built",
    visualComponent: "Sentence deconstruction animations"
  },
  {
    id: "contextual_immersion",
    name: "Contextual Immersion",
    description: "All examples relate to student interests",
    technique: "Personalized example generation",
    application: "Increase engagement and retention",
    visualComponent: "Student interest-based content adaptation"
  }
];
