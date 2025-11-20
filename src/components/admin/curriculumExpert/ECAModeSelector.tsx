import { Card, CardContent } from '@/components/ui/card';
import { ECAMode } from '@/types/curriculumExpert';
import { BookOpen, Package, GraduationCap, ClipboardCheck, Gamepad2, FileText } from 'lucide-react';

interface ECAModeSelectorProps {
  selectedMode: ECAMode;
  onModeChange: (mode: ECAMode) => void;
}

const MODE_CONFIG: Record<ECAMode, {
  icon: any;
  label: string;
  description: string;
  color: string;
  estimatedTime: string;
}> = {
  lesson: {
    icon: BookOpen,
    label: 'Lesson',
    description: 'Single 30-60 min lesson plan',
    color: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40',
    estimatedTime: '~15s'
  },
  unit: {
    icon: Package,
    label: 'Unit',
    description: '4-12 week unit with multiple lessons',
    color: 'bg-green-500/10 border-green-500/20 hover:border-green-500/40',
    estimatedTime: '~30s'
  },
  curriculum: {
    icon: GraduationCap,
    label: 'Curriculum',
    description: 'Full 3-12 month program',
    color: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40',
    estimatedTime: '~45s'
  },
  assessment: {
    icon: ClipboardCheck,
    label: 'Assessment',
    description: 'Placement, progress, or final test',
    color: 'bg-orange-500/10 border-orange-500/20 hover:border-orange-500/40',
    estimatedTime: '~20s'
  },
  mission: {
    icon: Gamepad2,
    label: 'Mission',
    description: 'Gamified quest-based learning',
    color: 'bg-red-500/10 border-red-500/20 hover:border-red-500/40',
    estimatedTime: '~25s'
  },
  resource: {
    icon: FileText,
    label: 'Resource',
    description: 'Worksheets, readings, flashcards',
    color: 'bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/40',
    estimatedTime: '~10s'
  }
};

export const ECAModeSelector = ({ selectedMode, onModeChange }: ECAModeSelectorProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg">Select ECA Mode</h3>
            <p className="text-sm text-muted-foreground">Choose the type of content you want to generate</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(Object.entries(MODE_CONFIG) as [ECAMode, typeof MODE_CONFIG[ECAMode]][]).map(([mode, config]) => {
              const Icon = config.icon;
              const isSelected = selectedMode === mode;
              
              return (
                <button
                  key={mode}
                  onClick={() => onModeChange(mode)}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all text-left
                    ${config.color}
                    ${isSelected ? 'ring-2 ring-primary shadow-md scale-105' : 'hover:scale-102'}
                  `}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <span className="font-semibold">{config.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                    <p className="text-xs font-medium opacity-70">{config.estimatedTime}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
