import { Volume2 } from 'lucide-react';

/**
 * SoloVocabCard — single, beautiful card layout for one vocabulary word.
 * Image fills the LEFT side, the word + definition fill the RIGHT.
 * Used in Playground when a slide has flashcards (we feature the active card).
 */

interface Card {
  word?: string;
  front?: string;
  definition?: string;
  back?: string;
  image_url?: string;
  audio_url?: string;
}

interface Props {
  card: Card;
  hub?: 'playground' | 'academy' | 'success';
}

export function SoloVocabCard({ card, hub = 'playground' }: Props) {
  const word = (card.word || card.front || '').toString();
  const def = (card.definition || card.back || '').toString();
  const audio = card.audio_url;

  const palette =
    hub === 'playground'
      ? { ring: 'border-orange-300', text: 'text-orange-600', btn: 'bg-orange-500 hover:bg-orange-600' }
      : hub === 'academy'
      ? { ring: 'border-indigo-300', text: 'text-indigo-700', btn: 'bg-indigo-600 hover:bg-indigo-700' }
      : { ring: 'border-emerald-300', text: 'text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700' };

  const playAudio = () => {
    if (!audio) return;
    try {
      const a = new Audio(audio);
      a.play().catch(() => {});
    } catch {
      /* noop */
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border-4 ${palette.ring} shadow-xl bg-white max-w-3xl mx-auto`}>
      <div className="aspect-square md:aspect-auto bg-muted/40 flex items-center justify-center overflow-hidden">
        {card.image_url ? (
          <img src={card.image_url} alt={word} className="w-full h-full object-cover" />
        ) : (
          <div className="text-muted-foreground text-xs font-semibold">No image yet</div>
        )}
      </div>
      <div className="p-8 flex flex-col items-start justify-center gap-4 text-left">
        <h2 className={`text-5xl md:text-6xl font-extrabold ${palette.text} drop-shadow-sm`}>
          {word || '—'}
        </h2>
        {def && <p className="text-lg text-slate-700 leading-snug">{def}</p>}
        {audio && (
          <button
            type="button"
            onClick={playAudio}
            className={`mt-2 inline-flex items-center gap-2 text-white font-bold rounded-full px-5 py-2.5 shadow-md active:scale-95 transition ${palette.btn}`}
          >
            <Volume2 className="w-4 h-4" /> Listen
          </button>
        )}
      </div>
    </div>
  );
}

export default SoloVocabCard;
