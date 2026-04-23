import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import type { SmartWorksheet } from '@/services/whiteboardService';
import { whiteboardService } from '@/services/whiteboardService';

interface Props {
  worksheet: SmartWorksheet;
  roomId: string;
  userId: string;
  role: 'teacher' | 'student';
}

interface FlashcardsState {
  index: number;
  flipped: boolean;
}

/**
 * Synchronised flashcards. Teacher controls navigation + flip state and
 * broadcasts the change so the student sees the same card in the same state.
 */
export const NativeGameFlashcards: React.FC<Props> = ({ worksheet, roomId, userId, role }) => {
  const cards = worksheet.flashcards ?? [];
  const [state, setState] = useState<FlashcardsState>({ index: 0, flipped: false });

  useEffect(() => {
    const unsub = whiteboardService.subscribeToGameState(roomId, (payload) => {
      if (payload.gameType !== 'flashcards' || payload.senderId === userId) return;
      const next = payload.state as Partial<FlashcardsState>;
      setState((prev) => ({
        index: typeof next.index === 'number' ? next.index : prev.index,
        flipped: typeof next.flipped === 'boolean' ? next.flipped : prev.flipped,
      }));
    });
    return unsub;
  }, [roomId, userId]);

  const broadcast = (next: FlashcardsState) => {
    if (role !== 'teacher') return;
    void whiteboardService.sendGameState(roomId, {
      gameType: 'flashcards',
      state: next,
      senderId: userId,
    });
  };

  const update = (next: FlashcardsState) => {
    setState(next);
    broadcast(next);
  };

  if (cards.length === 0) {
    return <EmptyState message="No flashcards in this worksheet." />;
  }

  const card = cards[state.index];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-8">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        Card {state.index + 1} of {cards.length}
      </div>

      <div className="relative w-full max-w-2xl h-72" style={{ perspective: 1200 }}>
        <AnimatePresence mode="wait">
          <motion.button
            key={`${state.index}-${state.flipped}`}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => role === 'teacher' && update({ ...state, flipped: !state.flipped })}
            className="absolute inset-0 rounded-3xl shadow-2xl bg-white border-4 border-orange-300 flex flex-col items-center justify-center text-center p-8 cursor-pointer hover:border-orange-400 transition-colors disabled:cursor-not-allowed"
            disabled={role !== 'teacher'}
            aria-label={state.flipped ? 'Show word' : 'Show definition'}
          >
            {!state.flipped ? (
              <>
                <p className="text-xs uppercase tracking-wider text-orange-500 mb-3 font-semibold">
                  Word
                </p>
                <h2 className="text-5xl font-extrabold text-foreground mb-4">{card.word}</h2>
                <p className="text-sm text-muted-foreground mt-4">
                  {role === 'teacher' ? 'Tap to reveal definition' : 'Teacher will reveal'}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-wider text-orange-500 mb-3 font-semibold">
                  Definition
                </p>
                <p className="text-2xl font-medium text-foreground mb-4">{card.definition}</p>
                <p className="text-base italic text-muted-foreground">"{card.example_sentence}"</p>
              </>
            )}
          </motion.button>
        </AnimatePresence>
      </div>

      {role === 'teacher' && (
        <div className="mt-6 flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => update({ index: Math.max(0, state.index - 1), flipped: false })}
            disabled={state.index === 0}
          >
            <ChevronLeft className="h-5 w-5" /> Previous
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => update({ ...state, flipped: !state.flipped })}
          >
            <RotateCw className="h-4 w-4 mr-2" /> Flip
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() =>
              update({ index: Math.min(cards.length - 1, state.index + 1), flipped: false })
            }
            disabled={state.index === cards.length - 1}
          >
            Next <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-white">
    <p className="text-muted-foreground">{message}</p>
  </div>
);
