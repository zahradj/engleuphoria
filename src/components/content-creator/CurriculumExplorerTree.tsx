import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  ChevronRight, ChevronDown, Gamepad2, GraduationCap, Briefcase,
  CheckCircle2, AlertCircle, Trophy, Loader2, Sparkles, Circle,
} from 'lucide-react';

export type HubKey = 'playground' | 'academy' | 'professional';
export type LessonStatus = 'draft' | 'generating' | 'ready';

interface CurriculumLevel {
  id: string;
  name: string;
  level_order: number;
  cefr_level: string;
  age_group: string;
  target_system: string | null;
}

export interface ExplorerLesson {
  id: string;
  title: string;
  unit_id: string | null;
  level_id: string | null;
  target_system: string;
  difficulty_level: string;
  sequence_order: number | null;
  content: any;
  is_published: boolean | null;
}

interface Accessory {
  id: string;
  name: string;
  image_url: string | null;
  type: string;
  hub_requirement: string;
  level_id: string;
  description: string | null;
}

interface CurriculumExplorerTreeProps {
  onLessonSelect: (lesson: ExplorerLesson) => void;
  onGenerateLesson?: (lesson: ExplorerLesson) => void;
  selectedLessonId?: string | null;
  generatingLessonIds?: Set<string>;
  onHubChange?: (hub: HubKey) => void;
}

const HUB_CONFIG: Record<HubKey, {
  label: string;
  icon: React.ElementType;
  color: string;
  bgClass: string;
  font: string;
  accessoryAnimation: string;
}> = {
  playground: {
    label: 'Playground',
    icon: Gamepad2,
    color: 'text-orange-500',
    bgClass: 'bg-orange-500/10 border-orange-500/20',
    font: 'font-sans', // Quicksand-like rounded feel
    accessoryAnimation: 'hover:animate-[wiggle_0.4s_ease-in-out]',
  },
  academy: {
    label: 'Academy',
    icon: GraduationCap,
    color: 'text-violet-500',
    bgClass: 'bg-violet-500/10 border-violet-500/20',
    font: 'font-sans', // Space Grotesk-like
    accessoryAnimation: 'hover:animate-[pulse_1s_ease-in-out]',
  },
  professional: {
    label: 'Professional',
    icon: Briefcase,
    color: 'text-emerald-500',
    bgClass: 'bg-emerald-500/10 border-emerald-500/20',
    font: 'font-sans', // Inter-like clean
    accessoryAnimation: '', // Static for professional
  },
};

const STATUS_CONFIG: Record<LessonStatus, {
  icon: React.ElementType;
  color: string;
  label: string;
  dot: string;
}> = {
  draft: {
    icon: Circle,
    color: 'text-muted-foreground',
    label: 'Draft',
    dot: 'bg-muted-foreground',
  },
  generating: {
    icon: Loader2,
    color: 'text-amber-500',
    label: 'Generating…',
    dot: 'bg-amber-500',
  },
  ready: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    label: 'Ready',
    dot: 'bg-emerald-500',
  },
};

export const CurriculumExplorerTree: React.FC<CurriculumExplorerTreeProps> = ({
  onLessonSelect,
  onGenerateLesson,
  selectedLessonId,
  generatingLessonIds = new Set(),
  onHubChange,
}) => {
  const [activeHub, setActiveHub] = useState<HubKey>('playground');
  const [levels, setLevels] = useState<CurriculumLevel[]>([]);
  const [lessons, setLessons] = useState<ExplorerLesson[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const ageGroupMap: Record<HubKey, string> = {
    playground: 'kids',
    academy: 'teens',
    professional: 'adults',
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const ageGroup = ageGroupMap[activeHub];

      const [levelsRes, lessonsRes, accessoriesRes] = await Promise.all([
        supabase
          .from('curriculum_levels')
          .select('id, name, level_order, cefr_level, age_group, target_system')
          .eq('age_group', ageGroup)
          .order('level_order'),
        supabase
          .from('curriculum_lessons')
          .select('id, title, unit_id, level_id, target_system, difficulty_level, sequence_order, content, is_published')
          .eq('target_system', activeHub)
          .order('sequence_order'),
        supabase
          .from('accessories')
          .select('id, name, image_url, type, hub_requirement, level_id, description')
          .eq('hub_requirement', activeHub),
      ]);

      setLevels((levelsRes.data || []) as CurriculumLevel[]);
      setLessons((lessonsRes.data || []) as ExplorerLesson[]);
      setAccessories((accessoriesRes.data || []) as Accessory[]);

      // Auto-expand first level
      if (levelsRes.data && levelsRes.data.length > 0) {
        setExpandedLevels(new Set([levelsRes.data[0].id]));
      }
    } catch (err) {
      console.error('Explorer fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [activeHub]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleHubChange = (hub: HubKey) => {
    setActiveHub(hub);
    onHubChange?.(hub);
  };

  const toggleLevel = (levelId: string) => {
    setExpandedLevels(prev => {
      const next = new Set(prev);
      if (next.has(levelId)) next.delete(levelId);
      else next.add(levelId);
      return next;
    });
  };

  const getLessonStatus = (lesson: ExplorerLesson): LessonStatus => {
    if (generatingLessonIds.has(lesson.id)) return 'generating';
    const hasSlides = lesson.content?.slides && Array.isArray(lesson.content.slides) && lesson.content.slides.length > 0;
    return hasSlides ? 'ready' : 'draft';
  };

  const getLessonsForLevel = (levelId: string) => lessons.filter(l => l.level_id === levelId);
  const getAccessoryForLevel = (levelId: string) => accessories.find(a => a.level_id === levelId);

  const hubConfig = HUB_CONFIG[activeHub];

  return (
    <div className={cn('flex flex-col h-full', hubConfig.font)}>
      {/* Hub Selector Tabs */}
      <div className="flex gap-1 p-2 border-b border-border bg-card">
        {(Object.keys(HUB_CONFIG) as HubKey[]).map((hub) => {
          const config = HUB_CONFIG[hub];
          const Icon = config.icon;
          const isActive = activeHub === hub;
          const hubLessonCount = lessons.filter(l => l.target_system === hub).length;

          return (
            <button
              key={hub}
              onClick={() => handleHubChange(hub)}
              className={cn(
                'flex-1 flex flex-col items-center gap-0.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all duration-200',
                isActive
                  ? `${config.bgClass} ${config.color} border shadow-sm`
                  : 'text-muted-foreground hover:bg-muted/60 border border-transparent'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive && 'scale-110 transition-transform')} />
              <span className="text-[10px] leading-tight">{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tree Content */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Loader2 className={cn('h-6 w-6 animate-spin', hubConfig.color)} />
              <span className="text-[10px] text-muted-foreground">Loading curriculum…</span>
            </div>
          ) : levels.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <div className={cn('w-10 h-10 mx-auto rounded-2xl flex items-center justify-center', hubConfig.bgClass)}>
                <hubConfig.icon className={cn('h-5 w-5', hubConfig.color)} />
              </div>
              <p className="text-xs text-muted-foreground">
                No levels found for <strong>{hubConfig.label}</strong>.
              </p>
              <p className="text-[10px] text-muted-foreground/60">
                Go to Blueprint to generate curriculum first.
              </p>
            </div>
          ) : (
            levels.map((level) => {
              const levelLessons = getLessonsForLevel(level.id);
              const readyCount = levelLessons.filter(l => getLessonStatus(l) === 'ready').length;
              const draftCount = levelLessons.filter(l => getLessonStatus(l) === 'draft').length;
              const allReady = levelLessons.length > 0 && readyCount === levelLessons.length;
              const isExpanded = expandedLevels.has(level.id);
              const accessory = getAccessoryForLevel(level.id);

              return (
                <Collapsible
                  key={level.id}
                  open={isExpanded}
                  onOpenChange={() => toggleLevel(level.id)}
                >
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        'w-full flex items-center gap-2 p-2.5 rounded-xl text-left transition-all duration-200',
                        isExpanded
                          ? `${hubConfig.bgClass} border shadow-sm`
                          : 'hover:bg-muted/60 border border-transparent'
                      )}
                    >
                      {isExpanded ? (
                        <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 transition-transform', hubConfig.color)} />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform" />
                      )}

                      {/* Level number badge */}
                      <div className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors',
                        allReady
                          ? 'bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/20'
                          : 'bg-muted text-muted-foreground'
                      )}>
                        {allReady ? <CheckCircle2 className="h-3.5 w-3.5" /> : level.level_order}
                      </div>

                      {/* Level info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{level.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge variant="outline" className="text-[9px] h-3.5 px-1 font-medium">{level.cefr_level}</Badge>
                          <span className={cn(
                            'text-[10px] font-medium',
                            allReady ? 'text-emerald-600' : 'text-muted-foreground'
                          )}>
                            {readyCount}/{levelLessons.length} ready
                          </span>
                        </div>
                      </div>

                      {/* Accessory preview with hub-specific animation */}
                      {accessory && (
                        <div
                          className={cn(
                            'shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all',
                            hubConfig.bgClass,
                            hubConfig.accessoryAnimation
                          )}
                          title={`🏆 ${accessory.name} (${accessory.type})`}
                        >
                          {accessory.image_url ? (
                            <img
                              src={accessory.image_url}
                              alt={accessory.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                          ) : (
                            <Trophy className={cn('h-3.5 w-3.5', hubConfig.color)} />
                          )}
                        </div>
                      )}
                    </button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="animate-accordion-down">
                    <div className="ml-6 pl-3 border-l-2 border-border/40 space-y-0.5 py-1.5">
                      {/* Accessory reward row */}
                      {accessory && (
                        <div className={cn(
                          'flex items-center gap-2 px-2.5 py-2 rounded-lg border',
                          hubConfig.bgClass
                        )}>
                          <div className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                            hubConfig.accessoryAnimation
                          )}>
                            {accessory.image_url ? (
                              <img src={accessory.image_url} alt={accessory.name} className="w-5 h-5 rounded-full object-cover" />
                            ) : (
                              <Trophy className={cn('h-3 w-3', hubConfig.color)} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-semibold text-foreground">{accessory.name}</span>
                            {accessory.description && (
                              <p className="text-[9px] text-muted-foreground truncate">{accessory.description}</p>
                            )}
                          </div>
                          <Badge variant="outline" className="text-[8px] h-3.5 px-1 shrink-0">{accessory.type}</Badge>
                        </div>
                      )}

                      {/* Lessons list */}
                      {levelLessons.length === 0 ? (
                        <p className="text-[10px] text-muted-foreground py-3 px-2 text-center">
                          No lessons yet — generate from Blueprint
                        </p>
                      ) : (
                        levelLessons.map((lesson) => {
                          const status = getLessonStatus(lesson);
                          const statusConfig = STATUS_CONFIG[status];
                          const StatusIcon = statusConfig.icon;
                          const isSelected = selectedLessonId === lesson.id;
                          const isGenerating = status === 'generating';

                          return (
                            <div
                              key={lesson.id}
                              className={cn(
                                'flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-150 group',
                                isSelected
                                  ? 'bg-primary/10 border border-primary/25 shadow-sm'
                                  : 'hover:bg-muted/50 border border-transparent'
                              )}
                            >
                              {/* Status icon */}
                              <StatusIcon className={cn(
                                'h-3 w-3 shrink-0',
                                statusConfig.color,
                                isGenerating && 'animate-spin'
                              )} />

                              {/* Lesson title — clickable */}
                              <button
                                onClick={() => onLessonSelect(lesson)}
                                className={cn(
                                  'truncate flex-1 text-left text-xs transition-colors',
                                  isSelected ? 'text-primary font-medium' : 'text-foreground'
                                )}
                              >
                                {lesson.sequence_order ? `${lesson.sequence_order}. ` : ''}{lesson.title}
                              </button>

                              {/* Status badge */}
                              <span className={cn(
                                'text-[8px] font-semibold uppercase tracking-wider shrink-0',
                                statusConfig.color
                              )}>
                                {statusConfig.label}
                              </span>

                              {/* Generate button — only for Draft */}
                              {status === 'draft' && onGenerateLesson && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onGenerateLesson(lesson);
                                  }}
                                  className={cn(
                                    'opacity-0 group-hover:opacity-100 transition-opacity shrink-0',
                                    'w-5 h-5 rounded-md flex items-center justify-center',
                                    'bg-primary/10 hover:bg-primary/20 text-primary'
                                  )}
                                  title="Generate slides"
                                >
                                  <Sparkles className="h-2.5 w-2.5" />
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-2 border-t border-border bg-card">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{levels.length} levels</span>
          <span>{lessons.length} lessons</span>
          <span className="text-emerald-600 font-medium">
            {lessons.filter(l => getLessonStatus(l) === 'ready').length} ready
          </span>
        </div>
      </div>
    </div>
  );
};
