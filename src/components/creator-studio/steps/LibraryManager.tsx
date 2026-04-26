import React, { useEffect, useState } from 'react';
import { Library, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface LessonRow {
  id: string;
  title: string;
  description: string | null;
  target_system: string;
  difficulty_level: string;
  is_published: boolean | null;
  updated_at: string | null;
  content: any;
}

const HUB_TINT: Record<string, string> = {
  playground: 'from-orange-500/15 to-amber-500/15 text-orange-700 dark:text-orange-300',
  academy: 'from-violet-500/15 to-purple-500/15 text-violet-700 dark:text-violet-300',
  success: 'from-emerald-500/15 to-teal-500/15 text-emerald-700 dark:text-emerald-300',
};

export const LibraryManager: React.FC = () => {
  const [rows, setRows] = useState<LessonRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) {
        if (!cancelled) {
          setRows([]);
          setLoading(false);
        }
        return;
      }
      const { data, error } = await supabase
        .from('curriculum_lessons')
        .select('id, title, description, target_system, difficulty_level, is_published, updated_at, content')
        .eq('created_by', uid)
        .order('updated_at', { ascending: false })
        .limit(20);
      if (!cancelled) {
        if (error) console.error('library fetch error', error);
        setRows(data ?? []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
          <Library className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Master Library
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your published and draft lessons. Newest first.
          </p>
        </div>
      </div>

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
            return (
              <li
                key={row.id}
                className={cn(
                  'rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-shadow',
                )}
              >
                <div className={cn('inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-gradient-to-r', tint)}>
                  {row.target_system} · {row.difficulty_level}
                </div>
                <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-slate-50 line-clamp-2">
                  {row.title}
                </h3>
                {row.description && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{row.description}</p>
                )}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{slideCount} slide{slideCount === 1 ? '' : 's'}</span>
                  {row.is_published ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Published
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">Draft</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
