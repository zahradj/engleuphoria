import React from 'react';
import { motion } from 'framer-motion';
import { GeneratedSlide, HubType } from '@/components/admin/lesson-builder/ai-wizard/types';
import { HUB_CONFIGS } from '@/components/admin/lesson-builder/ai-wizard/hubConfig';

interface Props {
  slide: GeneratedSlide;
  hub: HubType;
}

export default function SlideVocabulary({ slide, hub }: Props) {
  const config = HUB_CONFIGS[hub];
  const word = slide.content?.word;
  const definition = slide.content?.definition;
  const sentence = slide.content?.sentence;

  const cardStyle: React.CSSProperties =
    hub === 'playground'
      ? { background: 'linear-gradient(135deg, #FF9F1C, #FFBF00)', borderRadius: 24, color: '#1a1a2e' }
      : hub === 'academy'
        ? { background: '#1e1b4b', border: '2px solid #6366f1', borderRadius: 16, color: '#e2e8f0' }
        : { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#1e293b' };

  return (
    <div className="flex flex-col items-center gap-6 p-10 w-full max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold" style={{ color: config.colorPalette.primary }}>
        {hub === 'playground' ? '📖 ' : ''}New Vocabulary
      </h2>

      <motion.div
        className="w-full p-8 flex flex-col gap-4 items-center"
        style={cardStyle}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <span className="text-4xl font-bold">{word || slide.title}</span>
        {definition && <span className="text-lg opacity-80">{definition}</span>}
        {sentence && (
          <span className="text-base italic opacity-70 mt-2">"{sentence}"</span>
        )}
      </motion.div>

      {slide.imageUrl && (
        <img
          src={slide.imageUrl}
          alt={word || slide.title}
          className="w-48 h-48 object-cover rounded-2xl"
        />
      )}

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
