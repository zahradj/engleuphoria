import React from 'react';
import { cn } from '@/lib/utils';
import { Check, BookOpen, Sparkles, LayoutDashboard, Library } from 'lucide-react';

export type PipelineStep = 1 | 2 | 3 | 4;

export interface PipelineProgressData {
  totalLessons: number;
  generatedLessons: number;
  lessonsWithSlides: number;
}

interface ContentCreatorStepperProps {
  currentStep: PipelineStep;
  onStepChange: (step: PipelineStep) => void;
  progress?: PipelineProgressData;
}

const STEPS = [
  { step: 1 as PipelineStep, label: 'Curriculum', icon: BookOpen, description: 'Create structure' },
  { step: 2 as PipelineStep, label: 'Lesson Generation', icon: Sparkles, description: 'Generate with AI' },
  { step: 3 as PipelineStep, label: 'Slide Builder', icon: LayoutDashboard, description: 'Build & design' },
  { step: 4 as PipelineStep, label: 'Content Library', icon: Library, description: 'Manage & publish' },
];

export const ContentCreatorStepper: React.FC<ContentCreatorStepperProps> = ({
  currentStep,
  onStepChange,
}) => {
  return (
    <div className="w-full px-6 py-4 bg-card border-b border-border">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {STEPS.map((s, index) => {
          const Icon = s.icon;
          const isActive = currentStep === s.step;
          const isCompleted = currentStep > s.step;
          const isLast = index === STEPS.length - 1;

          return (
            <React.Fragment key={s.step}>
              <button
                onClick={() => onStepChange(s.step)}
                className={cn(
                  'flex items-center gap-3 group cursor-pointer transition-all duration-200',
                  isActive && 'scale-105'
                )}
              >
                {/* Circle */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-200',
                    isActive
                      ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/25'
                      : isCompleted
                        ? 'bg-primary/15 border-primary/40 text-primary'
                        : 'bg-muted border-border text-muted-foreground group-hover:border-primary/30'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>

                {/* Label */}
                <div className="hidden sm:block text-left">
                  <span
                    className={cn(
                      'text-sm font-semibold block leading-tight',
                      isActive
                        ? 'text-primary'
                        : isCompleted
                          ? 'text-foreground'
                          : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  >
                    {s.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{s.description}</span>
                </div>
              </button>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-3 hidden sm:block">
                  <div
                    className={cn(
                      'h-0.5 w-full rounded-full transition-colors duration-300',
                      currentStep > s.step ? 'bg-primary/40' : 'bg-border'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
