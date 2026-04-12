import React, { useState, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';
import { VocabularyImage } from '@/components/ui/VocabularyImage';

interface DragItem {
  text: string;
  target: string;
  emoji?: string;
  imageKeywords?: string;
  description?: string;
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
    <div className="flex flex-col items-center gap-6 p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold" style={{ fontFamily: "'Quicksand', sans-serif", color: '#FF9F1C' }}>
        🎯 {slide.title}
      </h2>
      {slide.content?.prompt && (
        <p className="text-base text-center text-muted-foreground" style={{ fontFamily: "'Quicksand', sans-serif" }}>
          {slide.content.prompt}
        </p>
      )}

      {/* Drop targets */}
      <div className="flex gap-5 flex-wrap justify-center">
        {targets.map((t) => {
          const isPlaced = Object.values(placed).includes(t);
          const placedItems = Object.entries(placed).filter(([, v]) => v === t).map(([k]) => k);
          return (
            <div
              key={t}
              data-droptarget={t}
              className="w-44 rounded-3xl border-4 border-dashed flex flex-col items-center justify-center gap-2 p-4 transition-all"
              style={{
                borderColor: isPlaced ? '#22c55e' : '#FFBF00',
                background: isPlaced ? '#dcfce7' : '#fef3c7',
                minHeight: '160px',
              }}
            >
              <VocabularyImage
                prompt={`Simple flat 2D illustration of the category "${t}" for young ESL students, white background, minimal, professional educational asset`}
                alt={t}
                style="minimalist"
                className="w-20 h-20"
              />
              <span className="text-sm font-semibold text-center" style={{ fontFamily: "'Quicksand', sans-serif", color: '#78716c' }}>
                {t}
              </span>
              {placedItems.map((word) => (
                <motion.span
                  key={word}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-1 px-3 py-1 rounded-xl text-sm font-bold"
                  style={{ background: '#86efac', color: '#14532d' }}
                >
                  {word} ✅
                </motion.span>
              ))}
            </div>
          );
        })}
      </div>

      {/* Draggable items with AI images */}
      <div className="flex gap-4 flex-wrap justify-center mt-2">
        {items
          .filter((i) => !placed[i.text])
          .map((item) => (
            <motion.div
              key={item.text}
              drag
              dragSnapToOrigin
              onDragEnd={(e, info) => handleDragEnd(item, info)}
              whileDrag={{ scale: 1.08, boxShadow: '0 12px 40px rgba(255,159,28,0.4)', zIndex: 50 }}
              whileHover={{ scale: 1.04 }}
              className="rounded-2xl cursor-grab active:cursor-grabbing select-none flex flex-col items-center overflow-hidden"
              style={{
                background: '#fff',
                border: '3px solid #FFBF00',
                width: '140px',
              }}
            >
              <div className="w-full h-24 bg-muted/30">
                <VocabularyImage
                  prompt={`Simple flat 2D illustration of "${item.text}" for young ESL students, isolated object, white background, professional educational, no text, no shadows`}
                  alt={item.text}
                  style="minimalist"
                  className="w-full h-full object-contain"
                />
              </div>
              <div
                className="w-full text-center py-2 font-bold text-base"
                style={{
                  background: 'linear-gradient(135deg, #FF9F1C, #FFBF00)',
                  color: '#1a1a2e',
                  fontFamily: "'Quicksand', sans-serif",
                }}
              >
                {item.text}
              </div>
              {item.description && (
                <p className="text-xs text-muted-foreground px-2 py-1 text-center leading-tight">
                  {item.description}
                </p>
              )}
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
