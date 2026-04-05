import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';

interface Props {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

export default function PlaygroundDragDrop({ slide, onCorrect, onIncorrect }: Props) {
  const items = slide.content?.dragItems || [
    { text: slide.content?.options?.[0] || 'Word A', target: 'slot-1' },
    { text: slide.content?.options?.[1] || 'Word B', target: 'slot-2' },
    { text: slide.content?.options?.[2] || 'Word C', target: 'slot-1' },
  ];

  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [celebrating, setCelebrating] = useState<string | null>(null);

  const handleDragEnd = (item: { text: string; target: string }, info: PanInfo, el: HTMLElement) => {
    // Simple proximity check to targets
    const targets = document.querySelectorAll('[data-droptarget]');
    let matched = false;
    targets.forEach((t) => {
      const rect = t.getBoundingClientRect();
      const cx = info.point.x;
      const cy = info.point.y;
      if (cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom) {
        const targetId = t.getAttribute('data-droptarget');
        if (targetId === item.target) {
          matched = true;
          setPlaced((p) => ({ ...p, [item.text]: targetId! }));
          setCelebrating(item.text);
          soundEffectsService.playCorrect();
          onCorrect();
          setTimeout(() => setCelebrating(null), 1200);
        } else {
          soundEffectsService.playIncorrect();
          onIncorrect?.();
        }
      }
    });
  };

  const targets = [...new Set(items.map((i) => i.target))];

  return (
    <div className="flex flex-col items-center gap-8 p-8 w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold" style={{ fontFamily: "'Quicksand', sans-serif", color: '#FF9F1C' }}>
        🎯 {slide.title}
      </h2>
      {slide.content?.prompt && (
        <p className="text-lg text-center" style={{ fontFamily: "'Quicksand', sans-serif" }}>
          {slide.content.prompt}
        </p>
      )}

      {/* Drop Targets */}
      <div className="flex gap-6 flex-wrap justify-center">
        {targets.map((t) => (
          <div
            key={t}
            data-droptarget={t}
            className="w-44 h-32 rounded-3xl border-4 border-dashed flex items-center justify-center text-lg font-bold"
            style={{
              borderColor: '#FFBF00',
              background: Object.values(placed).includes(t) ? '#d1fae5' : '#fef3c7',
              fontFamily: "'Quicksand', sans-serif",
            }}
          >
            {Object.entries(placed).find(([, v]) => v === t)?.[0] || (
              <span className="text-amber-400 text-4xl">?</span>
            )}
          </div>
        ))}
      </div>

      {/* Draggable Items */}
      <div className="flex gap-4 flex-wrap justify-center mt-4">
        {items
          .filter((i) => !placed[i.text])
          .map((item) => (
            <motion.div
              key={item.text}
              drag
              dragSnapToOrigin
              onDragEnd={(e, info) => handleDragEnd(item, info, e.target as HTMLElement)}
              whileDrag={{ scale: 1.15, boxShadow: '0 12px 40px rgba(255,159,28,0.4)' }}
              className="px-6 py-4 rounded-2xl cursor-grab active:cursor-grabbing text-xl font-bold select-none"
              style={{
                background: 'linear-gradient(135deg, #FF9F1C, #FFBF00)',
                color: '#1a1a2e',
                fontFamily: "'Quicksand', sans-serif",
              }}
            >
              {item.text}
            </motion.div>
          ))}
      </div>

      {celebrating && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          className="text-5xl"
        >
          ⭐
        </motion.div>
      )}
    </div>
  );
}
