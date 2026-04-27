import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';
import { HUB_CONFIGS } from '@/components/admin/lesson-builder/ai-wizard/hubConfig';
import type { HubType } from '@/components/admin/lesson-builder/ai-wizard/types';

interface Pair {
  left_item: string;
  right_item: string;
}

interface Props {
  slide: GeneratedSlide;
  hub?: HubType;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

/**
 * Drag & Match — touch-friendly two-column matcher.
 * Reads pairs from slide.interactive_data.pairs (capped at 3 for tablet visibility).
 * On a correct match: snap animation, ding sound. When all pairs are matched, fires onCorrect()
 * (the parent then handles confetti + next-slide unlock — same pipeline as Multiple Choice).
 */
export default function DragAndMatch({ slide, hub = 'academy', onCorrect, onIncorrect }: Props) {
  const config = HUB_CONFIGS[hub] || HUB_CONFIGS.academy;
  const primary = (config as any)?.primaryColor || '#6366f1';
  const accent = (config as any)?.accentColor || '#a855f7';

  const data: any = (slide as any).interactive_data || (slide as any).content || {};
  const instruction: string = data.instruction || 'Drag each word to its match!';

  const pairs: Pair[] = useMemo(() => {
    const raw: any[] = Array.isArray(data.pairs) ? data.pairs : [];
    return raw
      .filter((p) => p && (p.left_item || p.left) && (p.right_item || p.right))
      .slice(0, 3)
      .map((p) => ({
        left_item: p.left_item ?? p.left,
        right_item: p.right_item ?? p.right,
      }));
  }, [slide.id]);

  // Shuffle right column once so the order doesn't telegraph the answer.
  const rightItems: string[] = useMemo(() => {
    const arr = pairs.map((p) => p.right_item);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [pairs]);

  const [matched, setMatched] = useState<Record<string, string>>({}); // left_item -> right_item
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [shake, setShake] = useState<string | null>(null);
  const firedRef = useRef(false);

  const allMatched = pairs.length > 0 && Object.keys(matched).length === pairs.length;

  useEffect(() => {
    if (allMatched && !firedRef.current) {
      firedRef.current = true;
      // Slight delay so the user sees the final snap animation before the parent advances.
      const t = setTimeout(() => onCorrect(), 600);
      return () => clearTimeout(t);
    }
  }, [allMatched, onCorrect]);

  const tryMatch = (leftItem: string, rightItem: string) => {
    if (matched[leftItem]) return;
    const correct = pairs.find((p) => p.left_item === leftItem)?.right_item === rightItem;
    if (correct) {
      soundEffectsService.playCorrect();
      setMatched((m) => ({ ...m, [leftItem]: rightItem }));
      setSelectedLeft(null);
    } else {
      soundEffectsService.playIncorrect();
      onIncorrect?.();
      setShake(leftItem + '|' + rightItem);
      setTimeout(() => setShake(null), 400);
    }
  };

  const handleLeftTap = (leftItem: string) => {
    if (matched[leftItem]) return;
    setSelectedLeft((cur) => (cur === leftItem ? null : leftItem));
  };

  const handleRightTap = (rightItem: string) => {
    // If already used, ignore.
    if (Object.values(matched).includes(rightItem)) return;
    if (!selectedLeft) return;
    tryMatch(selectedLeft, rightItem);
  };

  // Drag handlers (HTML5 DnD — works on desktop; tap-to-match handles touch).
  const handleDragStart = (e: React.DragEvent, leftItem: string) => {
    e.dataTransfer.setData('text/plain', leftItem);
    setSelectedLeft(leftItem);
  };
  const handleDrop = (e: React.DragEvent, rightItem: string) => {
    e.preventDefault();
    const leftItem = e.dataTransfer.getData('text/plain');
    if (leftItem) tryMatch(leftItem, rightItem);
  };

  if (pairs.length === 0) {
    return (
      <div className="p-8 text-center" style={{ color: '#cbd5e1' }}>
        No matching pairs available for this slide.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center" style={{ color: '#e2e8f0' }}>
        🔗 {instruction}
      </h2>
      <p className="text-sm" style={{ color: '#94a3b8' }}>
        Tap a word on the left, then tap its match on the right (or drag & drop).
      </p>

      <div className="grid grid-cols-2 gap-6 w-full">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">
          {pairs.map((p) => {
            const isMatched = !!matched[p.left_item];
            const isSelected = selectedLeft === p.left_item;
            const isShaking = shake?.startsWith(p.left_item + '|');
            return (
              <motion.button
                key={`L-${p.left_item}`}
                draggable={!isMatched}
                onDragStart={(e) => handleDragStart(e as any, p.left_item)}
                onClick={() => handleLeftTap(p.left_item)}
                animate={
                  isShaking
                    ? { x: [0, -10, 10, -8, 8, 0] }
                    : isMatched
                    ? { scale: [1, 1.06, 1], opacity: 0.85 }
                    : { scale: 1 }
                }
                transition={{ duration: 0.35 }}
                whileHover={!isMatched ? { scale: 1.03 } : undefined}
                whileTap={!isMatched ? { scale: 0.97 } : undefined}
                className="px-5 py-4 rounded-2xl text-lg font-bold text-left select-none"
                style={{
                  background: isMatched
                    ? `linear-gradient(135deg, ${primary}33, ${accent}33)`
                    : isSelected
                    ? `linear-gradient(135deg, ${primary}, ${accent})`
                    : '#1e1b4b',
                  color: '#fff',
                  border: `2px solid ${isMatched ? '#22c55e' : isSelected ? '#fff' : primary + '88'}`,
                  cursor: isMatched ? 'default' : 'grab',
                  touchAction: 'manipulation',
                }}
              >
                {p.left_item}
                {isMatched && <span className="ml-2">✅</span>}
              </motion.button>
            );
          })}
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4">
          {rightItems.map((right) => {
            const isUsed = Object.values(matched).includes(right);
            const isShakeTarget = shake?.endsWith('|' + right);
            return (
              <motion.div
                key={`R-${right}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, right)}
                onClick={() => handleRightTap(right)}
                animate={
                  isShakeTarget
                    ? { x: [0, 10, -10, 8, -8, 0] }
                    : isUsed
                    ? { scale: [1, 1.06, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.35 }}
                whileHover={!isUsed ? { scale: 1.03 } : undefined}
                whileTap={!isUsed ? { scale: 0.97 } : undefined}
                className="px-5 py-4 rounded-2xl text-lg font-bold text-center select-none"
                style={{
                  background: isUsed
                    ? `linear-gradient(135deg, #22c55e44, #16a34a44)`
                    : '#1e1b4b',
                  color: '#fff',
                  border: `2px dashed ${isUsed ? '#22c55e' : accent + '88'}`,
                  cursor: isUsed ? 'default' : 'pointer',
                  touchAction: 'manipulation',
                }}
              >
                {right}
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {allMatched && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xl font-bold mt-2"
            style={{ color: '#22c55e' }}
          >
            ✨ All matched! Amazing work!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
