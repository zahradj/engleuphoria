import React, { useState, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';

interface DragItem {
  text: string;
  target: string;
  emoji?: string;
  imageKeywords?: string;
}

interface Props {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

export default function PlaygroundDragDrop({ slide, onCorrect, onIncorrect }: Props) {
  const items: DragItem[] = slide.content?.dragItems || [
    { text: 'Apple', target: 'Fruit', emoji: '🍎' },
    { text: 'Dog', target: 'Animal', emoji: '🐕' },
    { text: 'Sun', target: 'Nature', emoji: '☀️' },
  ];

  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [celebrating, setCelebrating] = useState<string | null>(null);
  const completedRef = useRef(false);

  const targets = [...new Set(items.map((i) => i.target))];
  const targetImages = targets.reduce<Record<string, string>>((acc, t) => {
    const item = items.find(i => i.target === t);
    acc[t] = item?.emoji || '❓';
    return acc;
  }, {});

  const handleDragEnd = (item: DragItem, info: PanInfo) => {
    if (completedRef.current) return;

    const targetEls = document.querySelectorAll('[data-droptarget]');
    targetEls.forEach((t) => {
      const rect = t.getBoundingClientRect();
      const cx = info.point.x;
      const cy = info.point.y;
      if (cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom) {
        const targetId = t.getAttribute('data-droptarget');
        if (targetId === item.target) {
          const newPlaced = { ...placed, [item.text]: targetId! };
          setPlaced(newPlaced);
          setCelebrating(item.text);
          soundEffectsService.playCorrect();
          setTimeout(() => setCelebrating(null), 1200);

          // Check if all items are now placed
          if (Object.keys(newPlaced).length === items.length) {
            completedRef.current = true;
            setTimeout(() => onCorrect(), 800);
          }
        } else {
          soundEffectsService.playIncorrect();
        }
      }
    });
  };

  const allPlaced = Object.keys(placed).length === items.length;

  return (
    <div className="flex flex-col items-center gap-6 p-6 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold" style={{ fontFamily: "'Quicksand', sans-serif", color: '#FF9F1C' }}>
        🎯 {slide.title}
      </h2>
      {slide.content?.prompt && (
        <p className="text-base text-center text-muted-foreground" style={{ fontFamily: "'Quicksand', sans-serif" }}>
          {slide.content.prompt}
        </p>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        {targets.map((t) => {
          const isPlaced = Object.values(placed).includes(t);
          const placedWord = Object.entries(placed).find(([, v]) => v === t)?.[0];
          return (
            <div
              key={t}
              data-droptarget={t}
              className="w-40 rounded-3xl border-4 border-dashed flex flex-col items-center justify-center gap-2 p-4 transition-all"
              style={{
                borderColor: isPlaced ? '#22c55e' : '#FFBF00',
                background: isPlaced ? '#dcfce7' : '#fef3c7',
                minHeight: '140px',
              }}
            >
              <span className="text-4xl">{targetImages[t]}</span>
              <span className="text-xs font-semibold text-center" style={{ fontFamily: "'Quicksand', sans-serif", color: '#78716c' }}>
                {t}
              </span>
              {placedWord && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-1 px-3 py-1 rounded-xl text-sm font-bold"
                  style={{ background: '#86efac', color: '#14532d' }}
                >
                  {placedWord} ✅
                </motion.span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 flex-wrap justify-center mt-2">
        {items
          .filter((i) => !placed[i.text])
          .map((item) => (
            <motion.div
              key={item.text}
              drag
              dragSnapToOrigin
              onDragEnd={(e, info) => handleDragEnd(item, info)}
              whileDrag={{ scale: 1.15, boxShadow: '0 12px 40px rgba(255,159,28,0.4)', zIndex: 50 }}
              whileHover={{ scale: 1.05 }}
              className="px-5 py-3 rounded-2xl cursor-grab active:cursor-grabbing text-lg font-bold select-none flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #FF9F1C, #FFBF00)',
                color: '#1a1a2e',
                fontFamily: "'Quicksand', sans-serif",
              }}
            >
              <span className="text-2xl">{item.emoji}</span>
              {item.text}
            </motion.div>
          ))}
      </div>

      {celebrating && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} className="text-5xl">
          ⭐
        </motion.div>
      )}

      {allPlaced && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl font-bold text-green-500">
          🎉 All Matched!
        </motion.div>
      )}
    </div>
  );
}
