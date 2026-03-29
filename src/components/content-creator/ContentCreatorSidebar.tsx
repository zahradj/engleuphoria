import React from 'react';
import { cn } from '@/lib/utils';
import {
  Wand2,
  Edit3,
  Sparkles,
  BookOpen,
  HelpCircle,
  Library,
  PenTool,
  LayoutDashboard,
} from 'lucide-react';

export type ContentCreatorTab =
  | 'curriculum-generator'
  | 'curriculum-editor'
  | 'lesson-generator'
  | 'lesson-editor'
  | 'quiz-generator'
  | 'content-library'
  | 'creator-studio'
  | 'slide-builder';

interface ContentCreatorSidebarProps {
  activeTab: ContentCreatorTab;
  onTabChange: (tab: ContentCreatorTab) => void;
}

const TABS: { id: ContentCreatorTab; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'creator-studio', label: 'Creator Studio', icon: PenTool, description: 'Write & preview lessons live' },
  { id: 'slide-builder', label: 'Slide Builder', icon: LayoutDashboard, description: 'Canva-style visual lesson editor' },
  { id: 'curriculum-generator', label: 'Curriculum Generator', icon: Wand2, description: 'AI-powered curriculum creation' },
  { id: 'curriculum-editor', label: 'Curriculum Editor', icon: Edit3, description: 'View & edit curriculum structure' },
  { id: 'lesson-generator', label: 'Lesson Generator', icon: Sparkles, description: 'Generate lessons with AI' },
  { id: 'lesson-editor', label: 'Lesson Editor', icon: BookOpen, description: 'Edit & manage lessons' },
  { id: 'quiz-generator', label: 'Quiz Generator', icon: HelpCircle, description: 'Create quizzes for lessons' },
  { id: 'content-library', label: 'Content Library', icon: Library, description: 'Browse all content' },
];

export const ContentCreatorSidebar: React.FC<ContentCreatorSidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <aside className="w-64 min-h-screen border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground tracking-tight">
          AI Content Studio
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Curriculum & Lesson Generator
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'w-full flex items-start gap-3 rounded-lg px-3 py-3 text-left transition-all duration-150',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
              )}
            >
              <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', isActive && 'text-primary')} />
              <div>
                <span className="text-sm font-medium block">{tab.label}</span>
                <span className="text-xs text-muted-foreground block mt-0.5">
                  {tab.description}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">
            💡 Start with <strong>Curriculum Generator</strong> to create a structured plan, then generate individual lessons.
          </p>
        </div>
      </div>
    </aside>
  );
};
