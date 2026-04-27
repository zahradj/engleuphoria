import React, { useEffect, useState, useMemo } from 'react';
import { Library, Loader2, FileText, CheckCircle2, Pencil, Trash2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
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
}

interface UnitGroup {
  unit_id: string | null;
  unit_number: number | null; // null = uncategorized
  unit_title: string;
  lessons: LessonRow[];
}

const HUB_TINT: Record<string, string> = {
  playground: 'from-orange-500/15 to-amber-500/15 text-orange-700 dark:text-orange-300',
  academy: 'from-violet-500/15 to-purple-500/15 text-violet-700 dark:text-violet-300',
  success: 'from-emerald-500/15 to-teal-500/15 text-emerald-700 dark:text-emerald-300',
};

export const LibraryManager: React.FC = () => {
  const { setActiveLessonData, setCurrentStep, setDirty } = useCreator();
  const [rows, setRows] = useState<LessonRow[] | null>(null);
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
    const { data, error } = await supabase
      .from('curriculum_lessons')
      .select(
        'id, title, description, target_system, difficulty_level, is_published, updated_at, content, ai_metadata, level_id, unit_id, skills_focus',
      )
      .eq('created_by', uid)
      .order('updated_at', { ascending: false })
      .limit(50);
    if (error) {
      console.error('library fetch error', error);
      toast.error(`Could not load library: ${error.message}`);
    }
    setRows(data ?? []);
    setSelectedIds(new Set());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const handleEdit = (row: LessonRow) => {
    const slides: PPPSlide[] = Array.isArray(row.content?.slides) ? row.content.slides : [];
    const blueprintRef = row.ai_metadata?.blueprint_ref ?? undefined;
    const next: ActiveLessonData = {
      lesson_id: row.id,
      lesson_title: row.title,
      target_goal: row.description ?? undefined,
      cefr_level: (row.difficulty_level as CEFRLevel) ?? 'A1',
      hub: (row.target_system as HubType) ?? 'academy',
      slides,
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

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
          <Library className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Master Library
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your published and draft lessons. Newest first.
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
        <ul className="grid gap-3 sm:grid-cols-2">
          {rows.map((row) => {
            const slideCount = Array.isArray(row.content?.slides) ? row.content.slides.length : 0;
            const tint = HUB_TINT[row.target_system] ?? HUB_TINT.academy;
            const isBusy = busyId === row.id;
            const isChecked = selectedIds.has(row.id);
            return (
              <li
                key={row.id}
                className={cn(
                  'group relative rounded-2xl border bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-lg transition-all',
                  isChecked
                    ? 'border-red-400 dark:border-red-500/60 ring-2 ring-red-200 dark:ring-red-900/40'
                    : 'border-slate-200 dark:border-slate-800',
                )}
              >
                {/* Selection checkbox — top-left, always visible */}
                <div className="absolute top-3 left-3">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleSelected(row.id)}
                    aria-label={`Select ${row.title}`}
                  />
                </div>

                {/* Hover action toolbar */}
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(row)}
                    disabled={isBusy}
                    className="h-7 w-7 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    aria-label="Delete lesson"
                    title="Delete lesson"
                  >
                    {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </Button>
                </div>

                <div className="pl-7">
                  <div
                    className={cn(
                      'inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-gradient-to-r',
                      tint,
                    )}
                  >
                    {row.target_system} · {row.difficulty_level}
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-slate-50 line-clamp-2 pr-8">
                    {row.title}
                  </h3>
                  {row.description && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {row.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      {slideCount} slide{slideCount === 1 ? '' : 's'}
                    </span>
                    {row.is_published ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Published
                      </span>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700">
                        Draft
                      </Badge>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleEdit(row)}
                    className="mt-3 w-full gap-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit Slides
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
