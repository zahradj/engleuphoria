import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playElevenLabs } from '@/lib/elevenLabsAudio';
import { LISTENING_ITEMS } from './content';

export interface ListeningResult {
  itemId: string;
  choice: string;
  correct: boolean;
}

interface Props {
  onComplete: (results: ListeningResult[]) => void;
}

const ListeningPhase: React.FC<Props> = ({ onComplete }) => {
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<ListeningResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  const item = LISTENING_ITEMS[idx];

  const handlePlay = async () => {
    setLoading(true);
    try {
      await playElevenLabs(item.audio_text);
    } finally {
      setLoading(false);
    }
  };

  const handlePick = (choiceId: string) => {
    if (picked) return;
    setPicked(choiceId);
    const r: ListeningResult = {
      itemId: item.id,
      choice: choiceId,
      correct: choiceId === item.correctId,
    };
    const next = [...results, r];
    setResults(next);
    setTimeout(() => {
      if (idx + 1 < LISTENING_ITEMS.length) {
        setIdx(idx + 1);
        setPicked(null);
      } else {
        onComplete(next);
      }
    }, 700);
  };

  return (
    <div className="h-full flex flex-col p-5 sm:p-6 text-white">
      <h2 className="text-lg sm:text-xl font-bold mb-1">Listening</h2>
      <p className="text-xs text-white/70 mb-4">
        Item {idx + 1} of {LISTENING_ITEMS.length} — Press play, then choose the matching picture.
      </p>

      <div className="flex justify-center mb-5">
        <Button
          onClick={handlePlay}
          disabled={loading}
          size="lg"
          className="rounded-full h-16 w-16 bg-white text-slate-900 hover:bg-white/90 shadow-xl"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Volume2 className="w-6 h-6" />}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1 overflow-auto">
        {item.options.map((opt) => {
          const isPicked = picked === opt.id;
          const isCorrect = opt.id === item.correctId;
          const showState = picked !== null;
          return (
            <motion.button
              key={opt.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => handlePick(opt.id)}
              className={[
                'rounded-2xl p-4 backdrop-blur-md border text-left transition-all',
                showState && isCorrect ? 'bg-emerald-500/20 border-emerald-300' :
                isPicked && !isCorrect ? 'bg-rose-500/20 border-rose-300' :
                                         'bg-white/5 border-white/15 hover:bg-white/10',
              ].join(' ')}
            >
              <div className="text-3xl mb-2">{opt.emoji}</div>
              <div className="text-sm font-semibold">{opt.label}</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ListeningPhase;
