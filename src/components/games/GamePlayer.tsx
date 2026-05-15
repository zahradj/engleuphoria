import { lazy, Suspense, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const SentenceBuilderGame = lazy(() => import('./SentenceBuilderGame'));
const VerbMatchingGame = lazy(() => import('./VerbMatchingGame'));
const InterviewGame = lazy(() => import('./InterviewGame'));
const GrammarSortingGame = lazy(() => import('./GrammarSortingGame'));

interface Props {
  gameId: string;
  onComplete?: () => void;
}

interface GameRow {
  id: string;
  game_type: 'sentence_builder' | 'verb_trio' | 'interview' | 'sorting';
  level: string;
  title: string;
  description: string | null;
  content_json: any;
}

export default function GamePlayer({ gameId, onComplete }: Props) {
  const [game, setGame] = useState<GameRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    supabase
      .from('learning_games')
      .select('id, game_type, level, title, description, content_json')
      .eq('id', gameId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancel) return;
        if (error || !data) setError(error?.message || 'Game not found');
        else setGame(data as GameRow);
        setLoading(false);
      });
    return () => { cancel = true; };
  }, [gameId]);

  async function handleComplete() {
    if (finished) return;
    setFinished(true);
    onComplete?.();
    try {
      await supabase.functions.invoke('award-xp', {
        body: { event_type: 'game_complete', metadata: { game_id: gameId, level: game?.level } },
      });
    } catch (e) {
      console.warn('[award-xp] failed', e);
    }
  }

  if (loading) return <div className="flex items-center justify-center p-10 text-slate-400"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (error) return <div className="p-6 text-rose-600">Couldn't load this game: {error}</div>;
  if (!game) return null;

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">{game.title}</h2>
        {game.description && <p className="text-slate-600">{game.description}</p>}
        <span className="inline-block text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">{game.level}</span>
      </header>

      <Suspense fallback={<div className="flex items-center justify-center p-6"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>}>
        {game.game_type === 'sentence_builder' && <SentenceBuilderGame content={game.content_json} onComplete={handleComplete} />}
        {game.game_type === 'verb_trio' && <VerbMatchingGame content={game.content_json} onComplete={handleComplete} />}
        {game.game_type === 'interview' && <InterviewGame content={game.content_json} onComplete={handleComplete} />}
        {game.game_type === 'sorting' && <GrammarSortingGame content={game.content_json} onComplete={handleComplete} />}
      </Suspense>
    </div>
  );
}
