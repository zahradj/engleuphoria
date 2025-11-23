import { ECAContent, ECAMode } from '@/types/curriculumExpert';
import { LessonPreview } from './previews/LessonPreview';
import { UnitPreview } from './previews/UnitPreview';
import { CurriculumPreview } from './previews/CurriculumPreview';
import { AssessmentPreview } from './previews/AssessmentPreview';
import { MissionPreview } from './previews/MissionPreview';
import { ResourcePreview } from './previews/ResourcePreview';

interface MaterialPreviewProps {
  material: any;
  mode: ECAMode;
}

export const MaterialPreview = ({ material, mode }: MaterialPreviewProps) => {
  if (!material) return null;

  switch (mode) {
    case 'lesson':
      return <LessonPreview 
        content={material.content || {}}
        title={material.title || ''}
        ageGroup={material.ageGroup || ''}
        cefrLevel={material.cefrLevel || ''}
        objectives={material.objectives || material.learningObjectives || []}
        targetLanguage={material.targetLanguage || { grammar: [], vocabulary: [] }}
      />;
    case 'unit':
      return <UnitPreview content={material.content || material} />;
    case 'curriculum':
      return <CurriculumPreview content={material.content || material} />;
    case 'assessment':
      return <AssessmentPreview content={material.content || material} />;
    case 'mission':
      return <MissionPreview content={material.content || material} />;
    case 'resource':
      return <ResourcePreview content={material.content || material} />;
    default:
      return null;
  }
};
