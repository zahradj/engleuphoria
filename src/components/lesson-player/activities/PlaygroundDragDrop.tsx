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
  imageUrl?: string;
}

interface Props {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

const DIFFICULTY_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  easy:   { label: 'Easy · A1–A2',   bg: '#dcfce7', color: '#14532d' },
  medium: { label: 'Medium · B1–B2', bg: '#fef3c7', color: '#854d0e' },
  hard:   { label: 'Hard · C1–C2',   bg: '#fee2e2', color: '#7f1d1d' },
};

export default function PlaygroundDragDrop({ slide, onCorrect, onIncorrect }: Props) {
  // Source priority: AI ai-core/director output (`interactive_data.pairs` with
  // {draggable, target_zone, image_url?}) → legacy creator data (`content.dragItems`).
  const interactive: any = (slide as any).interactive_data || {};
  const aiPairs: any[] = Array.isArray(interactive.pairs) ? interactive.pairs : [];

  const items: DragItem[] = aiPairs.length
    ? aiPairs
        .filter((p) => p && (p.draggable || p.left_item) && (p.target_zone || p.right_item))
        .map((p) => ({
          text: String(p.draggable ?? p.left_item),
          target: String(p.target_zone ?? p.right_item),
          imageUrl: p.image_url || p.imageUrl || undefined,
        }))
    : (slide.content?.dragItems || [
        { text: 'Apple', target: 'Fruit', emoji: '🍎' },
        { text: 'Dog', target: 'Animal', emoji: '🐕' },
        { text: 'Sun', target: 'Nature', emoji: '☀️' },
      ]);

  const difficulty: string | undefined = (slide as any).difficulty || (slide as any).content?.difficulty;
  const diffMeta = difficulty ? DIFFICULTY_STYLES[String(difficulty).toLowerCase()] : null;

  const promptText: string =
    interactive.instruction ||
    slide.content?.prompt ||
    'Drag each item to the correct category.';

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
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Quicksand', sans-serif", color: '#FF9F1C' }}>
          🎯 {slide.title}
        </h2>
        {diffMeta && (
          <span
            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
            style={{ background: diffMeta.bg, color: diffMeta.color, fontFamily: "'Quicksand', sans-serif" }}
          >
            {diffMeta.label}
          </span>
        )}
      </div>
      <p className="text-base text-center text-muted-foreground" style={{ fontFamily: "'Quicksand', sans-serif" }}>
        {promptText}
      </p>

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
                prompt={`Colorful flat 2D vector icon of "${t}", vibrant saturated colors, bold clean outlines, isolated on a pure transparent background, no shadows, no gradients, no 3D, professional educational asset for kids`}
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
              <div className="w-full h-24 bg-muted/30 flex items-center justify-center">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.text}
                    className="w-full h-full object-contain"
                    draggable={false}
                    onError={(e) => {
                      // Hide broken images so the text label still reads cleanly.
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <VocabularyImage
                    prompt={`Colorful flat 2D vector illustration of "${item.text}", vibrant bright colors, bold clean outlines, isolated on a pure transparent background, no shadows, no gradients, no 3D, clear and simple, professional educational asset for young children`}
                    alt={item.text}
                    style="minimalist"
                    className="w-full h-full object-contain"
                  />
                )}
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
