import { CurriculumStage } from '@/types/englishJourney';
import { STAGE_1_PRE_A1 } from './stage1PreA1';
import { STAGE_2_A1 } from './stage2A1';
import { STAGE_3_A2 } from './stage3A2';
import { STAGE_4_A2_PLUS_B1 } from './stage4A2PlusB1';
import { STAGE_5_B1 } from './stage5B1';
import { STAGE_6_B2 } from './stage6B2';

export const CURRICULUM_STAGES: CurriculumStage[] = [
  {
    id: 1,
    name: "Stage 1",
    theme: "Everyday English Foundations",
    cefrLevel: "Pre-A1",
    ageGroup: "4-6 years",
    bookReferences: ["Let's Go Starter", "Oxford Kids Club"],
    focus: "Everyday English & Sounds",
    goal: "Understand and use simple classroom & social English",
    units: STAGE_1_PRE_A1,
    totalDuration: 240,
    color: "hsl(350, 100%, 88%)",
    icon: "🎨"
  },
  {
    id: 2,
    name: "Stage 2",
    theme: "Everyday Routines & School Life",
    cefrLevel: "A1",
    ageGroup: "6-8 years",
    bookReferences: ["Let's Go 1-2", "Family & Friends 1"],
    focus: "Vocabulary & Sentences",
    goal: "Communicate basic needs, likes, and routines",
    units: STAGE_2_A1,
    totalDuration: 300,
    color: "hsl(200, 100%, 70%)",
    icon: "🎯"
  },
  {
    id: 3,
    name: "Stage 3",
    theme: "Building Sentences & Confidence",
    cefrLevel: "A2",
    ageGroup: "8-10 years",
    bookReferences: ["Let's Go 3-4", "Family & Friends 2-3"],
    focus: "Grammar & Reading",
    goal: "Express in complete sentences and short paragraphs",
    units: STAGE_3_A2,
    totalDuration: 350,
    color: "hsl(280, 80%, 70%)",
    icon: "🧠"
  },
  {
    id: 4,
    name: "Stage 4",
    theme: "Communication & Storytelling",
    cefrLevel: "A2+ - B1",
    ageGroup: "10-12 years",
    bookReferences: ["Family & Friends 4-5", "English File Elementary"],
    focus: "Writing & Storytelling",
    goal: "Understand simple authentic materials, write short texts",
    units: STAGE_4_A2_PLUS_B1,
    totalDuration: 400,
    color: "hsl(180, 70%, 60%)",
    icon: "🚀"
  },
  {
    id: 5,
    name: "Stage 5",
    theme: "Fluency & Structure",
    cefrLevel: "B1 - B1+",
    ageGroup: "12-14 years",
    bookReferences: ["English File Pre-Intermediate"],
    focus: "Fluency & Structure",
    goal: "Handle everyday conversation confidently",
    units: STAGE_5_B1,
    totalDuration: 450,
    color: "hsl(220, 70%, 55%)",
    icon: "💼"
  },
  {
    id: 6,
    name: "Stage 6",
    theme: "Academic & Creative English",
    cefrLevel: "B2",
    ageGroup: "15-17 years",
    bookReferences: ["English File Intermediate", "Teen English Plus"],
    focus: "Academic & Creative English",
    goal: "Debate, discuss, and write with clarity and confidence",
    units: STAGE_6_B2,
    totalDuration: 500,
    color: "hsl(260, 60%, 50%)",
    icon: "🎓"
  }
];
