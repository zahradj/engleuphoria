import React, { useEffect, useState, useMemo } from 'react';
import { Library, Loader2, FileText, CheckCircle2, Pencil, Trash2, X, Lock, BookOpen, Gamepad2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useHubTheme } from '@/hooks/useHubTheme';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  useCreator,
  ActiveLessonData,
  PPPSlide,
  CEFRLevel,
  HubType,
} from '../CreatorContext';

interface LessonRow {
  id: string;
  title: string;
  description: string | null;
  target_system: string;
  difficulty_level: string;
  is_published: boolean | null;
  updated_at: string | null;
  content: any;
  ai_metadata: any;
  level_id: string | null;
  unit_id: string | null;
  sequence_order: number | null;
  skills_focus: string[] | null;
}

interface UnitRow {
  id: string;
  unit_number: number;
  title: string;
  cefr_level: string | null;
}

interface LevelRow {
  id: string;
  name: string;
  cefr_level: string | null;
  target_system: string | null;
}

// ── Hub + CEFR gradient mapping ────────────────────────────────────
type GradientEntry = { bg: string; text: string };
const LEVEL_GRADIENTS: Record<string, Record<string, GradientEntry>> = {
  academy: {
    A1: { bg: 'bg-blue-100 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300' },
    A2: { bg: 'bg-blue-200 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200' },
    B1: { bg: 'bg-indigo-300 dark:bg-indigo-900/50', text: 'text-indigo-900 dark:text-indigo-200' },
    B2: { bg: 'bg-indigo-400 dark:bg-indigo-800/60', text: 'text-white' },
    C1: { bg: 'bg-purple-500 dark:bg-purple-800/60', text: 'text-white' },
    C2: { bg: 'bg-purple-700 dark:bg-purple-900/70', text: 'text-white' },
  },
  playground: {
    A1: { bg: 'bg-yellow-100 dark:bg-yellow-950/40', text: 'text-yellow-700 dark:text-yellow-300' },
    A2: { bg: 'bg-yellow-200 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-200' },
    B1: { bg: 'bg-orange-300 dark:bg-orange-900/50', text: 'text-orange-900 dark:text-orange-200' },
    B2: { bg: 'bg-orange-400 dark:bg-orange-800/60', text: 'text-white' },
    C1: { bg: 'bg-orange-500 dark:bg-orange-800/60', text: 'text-white' },
    C2: { bg: 'bg-orange-600 dark:bg-orange-900/70', text: 'text-white' },
  },
  success: {
    A1: { bg: 'bg-emerald-100 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300' },
    A2: { bg: 'bg-emerald-200 dark:bg-emerald-900/50', text: 'text-emerald-800 dark:text-emerald-200' },
    B1: { bg: 'bg-teal-300 dark:bg-teal-900/50', text: 'text-teal-900 dark:text-teal-200' },
    B2: { bg: 'bg-teal-400 dark:bg-teal-800/60', text: 'text-white' },
    C1: { bg: 'bg-teal-600 dark:bg-teal-800/60', text: 'text-white' },
    C2: { bg: 'bg-teal-800 dark:bg-teal-900/70', text: 'text-white' },
  },
};

function getLevelGradient(hub: string, cefr: string): GradientEntry {
  const hubKey = hub === 'kids' ? 'playground' : hub === 'teen' ? 'academy' : hub === 'adult' ? 'success' : hub;
  const map = LEVEL_GRADIENTS[hubKey] || LEVEL_GRADIENTS.academy;
  return map[cefr.toUpperCase()] || { bg: 'bg-slate-200 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' };
}

function targetSystemToHub(ts: string): string {
  if (ts === 'kids') return 'playground';
  if (ts === 'teen') return 'academy';
  return 'success';
}

const HUB_ICON: Record<string, React.ReactNode> = {
  playground: <Gamepad2 className="h-4 w-4" />,
  academy: <BookOpen className="h-4 w-4" />,
  success: <Library className="h-4 w-4" />,
};

const HUB_HEADER_GRADIENT: Record<string, string> = {
  playground: 'from-amber-500 via-orange-500 to-yellow-500',
  academy: 'from-violet-600 via-fuchsia-600 to-pink-600',
  success: 'from-emerald-500 via-teal-500 to-cyan-500',
};

// ── Types for the hierarchical grouping ────────────────────────────
interface LevelGroup {
  hub: string;
  cefr: string;
  lessons: LessonRow[];
  unitGroups: UnitGroup[];
}

interface UnitGroup {
  unit_id: string | null;
  unit_number: number | null;
  unit_title: string;
  lessons: LessonRow[];
}

export const LibraryManager: React.FC = () => {
  const { setActiveLessonData, setCurrentStep, setDirty } = useCreator();
  const [rows, setRows] = useState<LessonRow[] | null>(null);
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [confirmBulk, setConfirmBulk] = useState<'selected' | 'all' | null>(null);

  const fetchRows = React.useCallback(async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) {
      setRows([]);
      setLoading(false);
      return;
    }
    const lessonsRes = await supabase
      .from('curriculum_lessons')
      .select(
        'id, title, description, target_system, difficulty_level, is_published, updated_at, content, ai_metadata, level_id, unit_id, sequence_order, skills_focus',
      )
      .eq('created_by', uid)
      .order('target_system', { ascending: true })
      .order('difficulty_level', { ascending: true })
      .order('sequence_order', { ascending: true })
      .limit(500);

    if (lessonsRes.error) {
      console.error('library fetch error', lessonsRes.error);
      toast.error(`Could not load library: ${lessonsRes.error.message}`);
    }

    console.log('Library Fetch Result:', { uid, count: lessonsRes.data?.length ?? 0, data: lessonsRes.data });

    const lessons = (lessonsRes.data ?? []) as LessonRow[];

    const unitIds = Array.from(
      new Set(lessons.map((l) => l.unit_id).filter((x): x is string => !!x)),
    );
    let unitRows: UnitRow[] = [];
    if (unitIds.length > 0) {
      const unitsRes = await supabase
        .from('curriculum_units')
        .select('id, unit_number, title, cefr_level')
        .in('id', unitIds);
      if (unitsRes.error) {
        console.error('units fetch error', unitsRes.error);
      } else {
        unitRows = (unitsRes.data ?? []) as UnitRow[];
      }
    }

    setRows(lessons);
    setUnits(unitRows);
    setSelectedIds(new Set());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const handleEdit = (row: LessonRow) => {
    const slides: PPPSlide[] = Array.isArray(row.content?.slides) ? row.content.slides : [];
    const homework_missions = Array.isArray(row.content?.homework_missions)
      ? row.content.homework_missions
      : [];
    const blueprintRef = row.ai_metadata?.blueprint_ref ?? undefined;
    const next: ActiveLessonData = {
      lesson_id: row.id,
      lesson_title: row.title,
      target_goal: row.description ?? undefined,
      cefr_level: (row.difficulty_level as CEFRLevel) ?? 'A1',
      hub: (row.target_system as HubType) ?? 'academy',
      slides,
      homework_missions,
      source_lesson: blueprintRef,
      level_id: row.level_id ?? undefined,
      unit_id: row.unit_id ?? undefined,
    };
    setActiveLessonData(next);
    setDirty(false);
    setCurrentStep('slide-builder');
  };

  const handleDelete = async (row: LessonRow) => {
    if (!confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    setBusyId(row.id);
    const { error } = await supabase.from('curriculum_lessons').delete().eq('id', row.id);
    setBusyId(null);
    if (error) {
      toast.error(`Delete failed: ${error.message}`);
      return;
    }
    toast.success('Lesson deleted');
    setRows((prev) => prev?.filter((r) => r.id !== row.id) ?? null);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(row.id);
      return next;
    });
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (!rows) return;
    setSelectedIds((prev) => (prev.size === rows.length ? new Set() : new Set(rows.map((r) => r.id))));
  };

  const allSelected = useMemo(
    () => !!rows && rows.length > 0 && selectedIds.size === rows.length,
    [rows, selectedIds],
  );

  // ── Hierarchical grouping: Hub → Level (CEFR) → Unit → Lessons ──
  const levelGroups = useMemo<LevelGroup[]>(() => {
    if (!rows) return [];
    const unitById = new Map(units.map((u) => [u.id, u]));

    // Group by hub + difficulty_level (CEFR proxy)
    const hubLevelMap = new Map<string, LessonRow[]>();
    for (const lesson of rows) {
      const hub = targetSystemToHub(lesson.target_system);
      const cefr = difficultyToCefr(lesson.difficulty_level);
      const key = `${hub}::${cefr}`;
      if (!hubLevelMap.has(key)) hubLevelMap.set(key, []);
      hubLevelMap.get(key)!.push(lesson);
    }

    // Build level groups
    const groups: LevelGroup[] = [];
    for (const [key, lessons] of hubLevelMap.entries()) {
      const [hub, cefr] = key.split('::');
      // Sub-group by unit
      const unitMap = new Map<string, UnitGroup>();
      const UNCAT_KEY = '__uncategorized__';

      for (const lesson of lessons) {
        const u = lesson.unit_id ? unitById.get(lesson.unit_id) : undefined;
        const metaUnitNumber: number | null =
          typeof lesson.ai_metadata?.unit_number === 'number' ? lesson.ai_metadata.unit_number : null;
        const metaUnitTitle: string | null =
          typeof lesson.ai_metadata?.unit_title === 'string' ? lesson.ai_metadata.unit_title : null;

        const resolvedUnitNumber = u?.unit_number ?? metaUnitNumber;
        const resolvedUnitTitle = u?.title ?? metaUnitTitle ?? 'Uncategorized';
        const uKey = u
          ? u.id
          : metaUnitNumber != null
          ? `meta::${metaUnitNumber}::${metaUnitTitle ?? ''}`
          : UNCAT_KEY;

        if (!unitMap.has(uKey)) {
          unitMap.set(uKey, {
            unit_id: u?.id ?? null,
            unit_number: resolvedUnitNumber,
            unit_title: resolvedUnitTitle,
            lessons: [],
          });
        }
        unitMap.get(uKey)!.lessons.push(lesson);
      }

      // Sort lessons in each unit by sequence_order
      unitMap.forEach((g) => {
        g.lessons.sort((a, b) => {
          const ao = a.sequence_order ?? Number.POSITIVE_INFINITY;
          const bo = b.sequence_order ?? Number.POSITIVE_INFINITY;
          if (ao !== bo) return ao - bo;
          return a.title.localeCompare(b.title);
        });
      });

      const unitGroups = Array.from(unitMap.values()).sort((a, b) => {
        if (a.unit_number == null && b.unit_number == null) return 0;
        if (a.unit_number == null) return 1;
        if (b.unit_number == null) return -1;
        return a.unit_number - b.unit_number;
      });

      groups.push({ hub, cefr, lessons, unitGroups });
    }

    // Sort groups by hub order then CEFR order
    const HUB_ORDER: Record<string, number> = { playground: 0, academy: 1, success: 2 };
    const CEFR_ORDER: Record<string, number> = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4, C2: 5 };
    groups.sort((a, b) => {
      const ho = (HUB_ORDER[a.hub] ?? 9) - (HUB_ORDER[b.hub] ?? 9);
      if (ho !== 0) return ho;
      return (CEFR_ORDER[a.cefr] ?? 9) - (CEFR_ORDER[b.cefr] ?? 9);
    });

    return groups;
  }, [rows, units]);

  const performBulkDelete = async (mode: 'selected' | 'all') => {
    if (!rows) return;
    const ids = mode === 'all' ? rows.map((r) => r.id) : Array.from(selectedIds);
    if (ids.length === 0) return;
    setBulkBusy(true);
    const { error } = await supabase.from('curriculum_lessons').delete().in('id', ids);
    setBulkBusy(false);
    setConfirmBulk(null);
    if (error) {
      toast.error(`Bulk delete failed: ${error.message}`);
      return;
    }
    toast.success(`Deleted ${ids.length} lesson${ids.length === 1 ? '' : 's'}`);
    setRows((prev) => prev?.filter((r) => !ids.includes(r.id)) ?? null);
    setSelectedIds(new Set());
  };

  const { theme } = useHubTheme();
  return (
    <div className={cn('max-w-5xl mx-auto p-6 hub-surface', theme.themeClass, theme.font, theme.radius)}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
          <Library className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Master Library
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your published and draft lessons, grouped by Hub → Level → Unit.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchRows} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
        </Button>
        {!!rows?.length && (
          <AlertDialog
            open={confirmBulk === 'all'}
            onOpenChange={(open) => !open && setConfirmBulk(null)}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="gap-1.5"
                onClick={() => setConfirmBulk('all')}
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear entire library?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete <strong>all {rows.length} lessons</strong> in your
                  library. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={bulkBusy}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={bulkBusy}
                  onClick={() => performBulkDelete('all')}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {bulkBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Bulk select toolbar */}
      {!!rows?.length && (
        <div className="flex items-center gap-3 mb-3 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40">
          <Checkbox
            checked={allSelected}
            onCheckedChange={toggleSelectAll}
            aria-label="Select all lessons"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {selectedIds.size > 0
              ? `${selectedIds.size} selected`
              : `Select lessons to delete in bulk`}
          </span>
          <div className="flex-1" />
          {selectedIds.size > 0 && (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-xs"
                onClick={() => setSelectedIds(new Set())}
              >
                <X className="h-3.5 w-3.5 mr-1" /> Clear
              </Button>
              <AlertDialog
                open={confirmBulk === 'selected'}
                onOpenChange={(open) => !open && setConfirmBulk(null)}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 px-3 text-xs gap-1.5"
                    onClick={() => setConfirmBulk('selected')}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Selected ({selectedIds.size})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {selectedIds.size} selected lesson(s)?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={bulkBusy}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={bulkBusy}
                      onClick={() => performBulkDelete('selected')}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {bulkBusy ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : !rows?.length ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40">
          <FileText className="h-8 w-8 mx-auto text-slate-400 mb-2" />
          <p className="text-sm text-slate-500">No lessons yet. Build one in the Blueprint, then the Slide Studio.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {levelGroups.map((levelGroup) => {
            const gradient = getLevelGradient(levelGroup.hub, levelGroup.cefr);
            const hubGradient = HUB_HEADER_GRADIENT[levelGroup.hub] || HUB_HEADER_GRADIENT.academy;

            return (
              <section key={`${levelGroup.hub}-${levelGroup.cefr}`} className="space-y-5">
                {/* ── Level Header ────────────────────────────── */}
                <div className={cn('flex items-center gap-3 px-5 py-3 rounded-2xl', gradient.bg, gradient.text)}>
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-white/30 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center font-black text-lg">
                    {levelGroup.cefr}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">
                      {levelGroup.hub.charAt(0).toUpperCase() + levelGroup.hub.slice(1)} Hub
                    </p>
                    <h3 className="text-lg font-extrabold tracking-tight">
                      Level {levelGroup.cefr}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {HUB_ICON[levelGroup.hub]}
                    <Badge variant="secondary" className="text-[11px] font-semibold bg-white/20 dark:bg-white/10 border-0">
                      {levelGroup.lessons.length} lesson{levelGroup.lessons.length === 1 ? '' : 's'}
                    </Badge>
                  </div>
                </div>

                {/* ── Unit sub-groups ─────────────────────────── */}
                {levelGroup.unitGroups.map((group) => {
                  const isUncat = group.unit_number == null;
                  return (
                    <div key={group.unit_id ?? '__uncat__'} className="space-y-3 pl-4">
                      {/* Unit Sub-Header */}
                      <div
                        className={cn(
                          'flex items-center gap-3 px-4 py-2.5 rounded-xl',
                          isUncat
                            ? 'bg-slate-100 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700'
                            : `bg-gradient-to-r ${hubGradient} text-white shadow-sm`,
                        )}
                      >
                        {!isUncat && (
                          <div className="h-8 w-8 shrink-0 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center font-extrabold text-sm">
                            {group.unit_number}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'text-[10px] font-bold uppercase tracking-[0.15em]',
                            isUncat ? 'text-slate-500 dark:text-slate-400' : 'text-white/70',
                          )}>
                            {isUncat ? 'Extra' : `Unit ${group.unit_number}`}
                          </p>
                          <h4 className={cn(
                            'text-sm font-bold truncate',
                            isUncat ? 'text-slate-700 dark:text-slate-200' : 'text-white',
                          )}>
                            {group.unit_title}
                          </h4>
                        </div>
                        <Badge variant="secondary" className={cn(
                          'shrink-0 text-[10px] font-semibold',
                          isUncat
                            ? 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            : 'bg-white/20 text-white border-0 backdrop-blur-sm',
                        )}>
                          {group.lessons.length} lesson{group.lessons.length === 1 ? '' : 's'}
                        </Badge>
                      </div>

                      {/* Lesson cards */}
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {group.lessons.map((row) => {
                          const slideCount = Array.isArray(row.content?.slides) ? row.content.slides.length : 0;
                          const isDraft = !row.is_published;
                          const isBusy = busyId === row.id;
                          const isChecked = selectedIds.has(row.id);
                          const lessonNumber: number | null =
                            typeof row.ai_metadata?.lesson_number === 'number'
                              ? row.ai_metadata.lesson_number
                              : row.sequence_order != null && row.sequence_order > 100
                              ? row.sequence_order % 100
                              : row.sequence_order;
                          const cardGradient = getLevelGradient(row.target_system, difficultyToCefr(row.difficulty_level));

                          return (
                            <li
                              key={row.id}
                              className={cn(
                                'group relative rounded-2xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all',
                                isDraft ? 'opacity-80' : '',
                                isChecked
                                  ? 'border-red-400 dark:border-red-500/60 ring-2 ring-red-200 dark:ring-red-900/40'
                                  : 'border-slate-200 dark:border-slate-800',
                              )}
                            >
                              {/* Thumbnail placeholder — level-colored background with faint icon */}
                              <div className={cn(
                                'h-20 rounded-t-2xl flex items-center justify-center relative overflow-hidden',
                                cardGradient.bg,
                              )}>
                                {isDraft ? (
                                  <Lock className={cn('h-8 w-8 opacity-20', cardGradient.text)} />
                                ) : (
                                  <BookOpen className={cn('h-8 w-8 opacity-20', cardGradient.text)} />
                                )}
                                {/* Prominent L# badge */}
                                {lessonNumber != null && (
                                  <div className="absolute top-2 right-2 h-8 min-w-[2rem] px-2 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm flex items-center justify-center font-black text-xs text-slate-900 dark:text-slate-50 tracking-tight">
                                    L{lessonNumber}
                                  </div>
                                )}
                              </div>

                              {/* Selection checkbox */}
                              <div className="absolute top-2 left-2">
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() => toggleSelected(row.id)}
                                  aria-label={`Select ${row.title}`}
                                  className="bg-white/80 dark:bg-slate-900/80"
                                />
                              </div>

                              {/* Hover action toolbar */}
                              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(row)}
                                  disabled={isBusy}
                                  className="h-7 w-7 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 bg-white/80 dark:bg-slate-900/80 rounded-full"
                                  aria-label="Delete lesson"
                                  title="Delete lesson"
                                >
                                  {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                </Button>
                              </div>

                              <div className="p-4">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {lessonNumber != null && (
                                    <Badge
                                      variant="secondary"
                                      className={cn('text-[10px] font-bold tracking-wider border-0', cardGradient.bg, cardGradient.text)}
                                    >
                                      Lesson {lessonNumber}
                                    </Badge>
                                  )}
                                </div>
                                <h4 className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-50 line-clamp-2">
                                  {row.title}
                                </h4>
                                {row.description && (
                                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                    {row.description}
                                  </p>
                                )}
                                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                                  <span>
                                    {slideCount} slide{slideCount === 1 ? '' : 's'}
                                  </span>
                                  {isDraft ? (
                                    <Badge variant="outline" className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 gap-1">
                                      <Lock className="h-3 w-3" /> 🔒 Draft
                                    </Badge>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                                      <CheckCircle2 className="h-3.5 w-3.5" /> ✅ Published
                                    </span>
                                  )}
                                </div>

                                <Button
                                  size="sm"
                                  onClick={() => handleEdit(row)}
                                  className={cn(
                                    'mt-3 w-full gap-1.5 border-0 text-white',
                                    isDraft
                                      ? 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700'
                                      : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600',
                                  )}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  {isDraft ? 'Edit & Publish' : 'Edit Slides'}
                                </Button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Helpers ────────────────────────────────────────────────────────
function difficultyToCefr(difficulty: string): string {
  const d = (difficulty || '').toLowerCase();
  if (d === 'beginner') return 'A1';
  if (d === 'intermediate') return 'B1';
  if (d === 'advanced') return 'C1';
  // Already a CEFR code?
  if (['a1', 'a2', 'b1', 'b2', 'c1', 'c2'].includes(d)) return d.toUpperCase();
  return 'A1';
}
