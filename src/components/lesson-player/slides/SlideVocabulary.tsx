import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GeneratedSlide, HubType } from '@/components/admin/lesson-builder/ai-wizard/types';
import { HUB_CONFIGS } from '@/components/admin/lesson-builder/ai-wizard/hubConfig';
import { Volume2 } from 'lucide-react';

interface Props {
  slide: GeneratedSlide;
  hub: HubType;
}

export default function SlideVocabulary({ slide, hub }: Props) {
  const config = HUB_CONFIGS[hub];
  const [flipped, setFlipped] = useState(false);
  const word = slide.content?.word || slide.title;
  const definition = slide.content?.definition || '';
  const sentence = slide.content?.sentence || '';

  return (
    <div className="flex flex-col items-center gap-6 p-8 w-full text-center">
      <h2 className="text-lg font-bold uppercase tracking-widest opacity-60" style={{ color: config.colorPalette.primary }}>
        New Vocabulary
      </h2>

      {/* 3D Flip Flashcard */}
      <div
        className="w-full cursor-pointer"
        style={{ perspective: 1000, minHeight: 220 }}
        onClick={() => setFlipped((f) => !f)}
      >
        <motion.div
          className="relative w-full"
          style={{ transformStyle: 'preserve-3d', minHeight: 220 }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[20px] p-6"
            style={{
              backfaceVisibility: 'hidden',
              background: hub === 'playground'
                ? 'linear-gradient(135deg, #FF9F1C, #FFBF00)'
                : hub === 'academy'
                  ? '#1e1b4b'
                  : '#fff',
              border: hub === 'academy' ? '2px solid #6366f1' : '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
              color: hub === 'playground' ? '#1a1a2e' : hub === 'academy' ? '#e2e8f0' : '#1e293b',
            }}
          >
            <span className="text-4xl font-bold">{word}</span>
            {definition && <span className="text-base opacity-70">{definition}</span>}
            <button
              onClick={(e) => { e.stopPropagation(); }}
              className="mt-2 w-10 h-10 rounded-full flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors"
            >
              <Volume2 size={20} />
            </button>
            <span className="text-xs opacity-40 mt-1">Tap to flip</span>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[20px] p-6"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: hub === 'playground'
                ? 'linear-gradient(135deg, #FFBF00, #FF9F1C)'
                : hub === 'academy'
                  ? '#312e81'
                  : '#f8fafc',
              border: hub === 'academy' ? '2px solid #818cf8' : '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
              color: hub === 'playground' ? '#1a1a2e' : hub === 'academy' ? '#e2e8f0' : '#1e293b',
            }}
          >
            {sentence && <span className="text-lg italic opacity-80">"{sentence}"</span>}
            {hub === 'playground' && <span className="text-5xl mt-2">🐧</span>}
            <span className="text-xs opacity-40 mt-1">Tap to flip back</span>
          </div>
        </motion.div>
      </div>

      {/* Keywords */}
      {slide.keywords?.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center">
          {slide.keywords.map((kw) => (
            <span
              key={kw}
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ background: config.colorPalette.highlight, color: config.colorPalette.primary }}
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
