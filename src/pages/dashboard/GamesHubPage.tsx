import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Gamepad2, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCEFRProgress } from '@/hooks/useCEFRProgress';

const GamePlayer = lazy(() => import('@/components/games/GamePlayer'));

interface GameCard {
  id: string;
  title: string;
  description: string | null;
  level: string;
  game_type: string;
  tags: string[] | null;
}

const TYPE_LABEL: Record<string, string> = {
  sentence_builder: 'Sentence Builder',
  verb_trio: 'Verb Trio',
  interview: 'Interview',
  sorting: 'Sorting',
};

const TYPE_GRADIENT: Record<string, string> = {
  sentence_builder: 'from-indigo-500 to-purple-600',
  verb_trio: 'from-amber-500 to-orange-600',
  interview: 'from-emerald-500 to-teal-600',
  sorting: 'from-fuchsia-500 to-pink-600',
};

const FEATURED_TAGS = [
  { tag: 'past_simple', label: 'Past Simple', emoji: '⏪' },
  { tag: 'present_perfect', label: 'Present Perfect', emoji: '✨' },
  { tag: 'modals', label: 'Modals (Can/Could)', emoji: '🛡️' },
  { tag: 'irregular_verbs', label: 'Irregular Verbs', emoji: '🌀' },
];

export default function GamesHubPage() {
  const { user } = useAuth();
  const cefr = useCEFRProgress();
  const studentLevel = (cefr?.data?.level as string) || 'A1';

  const [filter, setFilter] = useState<string | null>(null);
  const [games, setGames] = useState<GameCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    supabase
      .from('learning_games')
      .select('id, title, description, level, game_type, tags')
      .eq('is_published', true)
      .eq('level', studentLevel)
      .order('created_at', { ascending: false })
      .limit(60)
      .then(({ data }) => {
        if (cancel) return;
        setGames((data as GameCard[]) || []);
        setLoading(false);
      });
    return () => { cancel = true; };
  }, [studentLevel]);

  const filtered = useMemo(() => {
    if (!filter) return games;
    return games.filter((g) => (g.tags || []).includes(filter));
  }, [games, filter]);

  if (activeGameId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 sm:p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <button onClick={() => setActiveGameId(null)} className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Arcade
          </button>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <Suspense fallback={<div className="flex items-center justify-center p-10"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>}>
              <GamePlayer gameId={activeGameId} />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between gap-4">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-semibold">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <div className="text-xs font-bold bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600">
            Your level: <span className="text-indigo-700">{studentLevel}</span>
          </div>
        </header>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
            <Gamepad2 className="w-4 h-4" /> Grammar Arcade
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">Pick your challenge</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Mini-games crafted for level <strong>{studentLevel}</strong>. Earn XP every time you finish one.
          </p>
        </div>

        {/* Topic chips */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setFilter(null)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition ${filter === null ? 'bg-indigo-600 text-white shadow' : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-400'}`}
          >
            All
          </button>
          {FEATURED_TAGS.map((t) => (
            <button
              key={t.tag}
              onClick={() => setFilter(t.tag)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition ${filter === t.tag ? 'bg-indigo-600 text-white shadow' : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-400'}`}
            >
              <span className="mr-1">{t.emoji}</span>{t.label}
            </button>
          ))}
        </div>

        {/* Game grid */}
        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-10 text-center space-y-2">
            <Sparkles className="w-10 h-10 mx-auto text-indigo-400" />
            <p className="text-slate-700 font-semibold">No games here yet.</p>
            <p className="text-slate-500 text-sm">Your teacher hasn't published a {filter ? FEATURED_TAGS.find((t) => t.tag === filter)?.label : 'game'} for level {studentLevel}. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveGameId(g.id)}
                className="text-left rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition overflow-hidden group"
              >
                <div className={`h-24 bg-gradient-to-br ${TYPE_GRADIENT[g.game_type] || 'from-slate-500 to-slate-700'} flex items-center justify-center`}>
                  <Gamepad2 className="w-10 h-10 text-white/90 group-hover:scale-110 transition" />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">{TYPE_LABEL[g.game_type] || g.game_type}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{g.level}</span>
                  </div>
                  <div className="font-bold text-slate-900">{g.title}</div>
                  {g.description && <div className="text-xs text-slate-500 line-clamp-2">{g.description}</div>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
