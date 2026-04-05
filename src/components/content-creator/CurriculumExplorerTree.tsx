import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  ChevronRight, ChevronDown, Gamepad2, GraduationCap, Briefcase,
  CheckCircle2, AlertCircle, Trophy, Loader2,
} from 'lucide-react';

export type HubKey = 'playground' | 'academy' | 'professional';

interface CurriculumLevel {
  id: string;
  name: string;
  level_order: number;
  cefr_level: string;
  age_group: string;
  target_system: string | null;
}

interface CurriculumLesson {
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
}

interface CurriculumExplorerTreeProps {
  onLessonSelect: (lesson: CurriculumLesson) => void;
  selectedLessonId?: string | null;
  onHubChange?: (hub: HubKey) => void;
}

const HUB_CONFIG: Record<HubKey, { label: string; icon: React.ElementType; color: string; bgClass: string }> = {
  playground: { label: 'Playground', icon: Gamepad2, color: 'text-orange-500', bgClass: 'bg-orange-500/10 border-orange-500/20' },
  academy: { label: 'Academy', icon: GraduationCap, color: 'text-violet-500', bgClass: 'bg-violet-500/10 border-violet-500/20' },
  professional: { label: 'Professional', icon: Briefcase, color: 'text-emerald-500', bgClass: 'bg-emerald-500/10 border-emerald-500/20' },
};

export const CurriculumExplorerTree: React.FC<CurriculumExplorerTreeProps> = ({
  onLessonSelect,
  selectedLessonId,
  onHubChange,
}) => {
  const [activeHub, setActiveHub] = useState<HubKey>('playground');
  const [levels, setLevels] = useState<CurriculumLevel[]>([]);
  const [lessons, setLessons] = useState<CurriculumLesson[]>([]);
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

      // Fetch levels, lessons, and accessories in parallel
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
          .select('id, name, image_url, type, hub_requirement, level_id')
          .eq('hub_requirement', activeHub),
      ]);

      setLevels((levelsRes.data || []) as CurriculumLevel[]);
      setLessons((lessonsRes.data || []) as CurriculumLesson[]);
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

  const getLessonStatus = (lesson: CurriculumLesson) => {
    return lesson.content?.slides?.length > 0 ? 'ready' : 'needs_slides';
  };

  const getLessonsForLevel = (levelId: string) => {
    return lessons.filter(l => l.level_id === levelId);
  };

  const getAccessoryForLevel = (levelId: string) => {
    return accessories.find(a => a.level_id === levelId);
  };

  const hubConfig = HUB_CONFIG[activeHub];

  return (
    <div className="flex flex-col h-full">
      {/* Hub Selector Tabs */}
      <div className="flex gap-1 p-2 border-b border-border">
        {(Object.keys(HUB_CONFIG) as HubKey[]).map((hub) => {
          const config = HUB_CONFIG[hub];
          const Icon = config.icon;
          const isActive = activeHub === hub;
          return (
            <button
              key={hub}
              onClick={() => handleHubChange(hub)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all',
                isActive
                  ? `${config.bgClass} ${config.color} border`
                  : 'text-muted-foreground hover:bg-muted/60'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : levels.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              No levels found for {hubConfig.label}.
            </p>
          ) : (
            levels.map((level) => {
              const levelLessons = getLessonsForLevel(level.id);
              const readyCount = levelLessons.filter(l => getLessonStatus(l) === 'ready').length;
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
                        'w-full flex items-center gap-2 p-2.5 rounded-xl text-left transition-all',
                        isExpanded
                          ? `${hubConfig.bgClass} border`
                          : 'hover:bg-muted/60 border border-transparent'
                      )}
                    >
                      {isExpanded ? (
                        <ChevronDown className={cn('h-3.5 w-3.5 shrink-0', hubConfig.color)} />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      )}

                      <div className={cn(
                        'w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0',
                        allReady ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                      )}>
                        {allReady ? <CheckCircle2 className="h-3 w-3" /> : level.level_order}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{level.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge variant="outline" className="text-[9px] h-3.5 px-1">{level.cefr_level}</Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {readyCount}/{levelLessons.length}
                          </span>
                        </div>
                      </div>

                      {accessory && (
                        <div className="shrink-0" title={`Reward: ${accessory.name}`}>
                          <Trophy className={cn('h-3.5 w-3.5', hubConfig.color)} />
                        </div>
                      )}
                    </button>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="ml-5 pl-3 border-l-2 border-border/50 space-y-0.5 py-1">
                      {/* Accessory row */}
                      {accessory && (
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/30">
                          <Trophy className={cn('h-3 w-3', hubConfig.color)} />
                          <span className="text-[10px] font-medium text-muted-foreground">
                            🏆 Reward: {accessory.name}
                          </span>
                          <Badge variant="outline" className="text-[9px] h-3.5 px-1 ml-auto">{accessory.type}</Badge>
                        </div>
                      )}

                      {levelLessons.length === 0 ? (
                        <p className="text-[10px] text-muted-foreground py-2 px-2">No lessons yet</p>
                      ) : (
                        levelLessons.map((lesson) => {
                          const status = getLessonStatus(lesson);
                          const isSelected = selectedLessonId === lesson.id;

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => onLessonSelect(lesson)}
                              className={cn(
                                'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all text-xs',
                                isSelected
                                  ? 'bg-primary/10 border border-primary/20'
                                  : 'hover:bg-muted/40 border border-transparent'
                              )}
                            >
                              {status === 'ready' ? (
                                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                              ) : (
                                <AlertCircle className="h-3 w-3 text-destructive shrink-0" />
                              )}
                              <span className={cn(
                                'truncate flex-1',
                                isSelected ? 'text-primary font-medium' : 'text-foreground'
                              )}>
                                {lesson.sequence_order ? `${lesson.sequence_order}. ` : ''}{lesson.title}
                              </span>
                            </button>
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
    </div>
  );
};
