import React from 'react';
import { motion } from 'framer-motion';
import { GeneratedSlide, HubType } from '@/components/admin/lesson-builder/ai-wizard/types';
import { HUB_CONFIGS } from '@/components/admin/lesson-builder/ai-wizard/hubConfig';

interface Props {
  slide: GeneratedSlide;
  hub: HubType;
}

export default function SlideHook({ slide, hub }: Props) {
  const config = HUB_CONFIGS[hub];
  const content = slide.content?.prompt || slide.title;
  const hasImage = slide.imageUrl && slide.imageUrl.length > 5;

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-10 w-full max-w-3xl mx-auto text-center">
      {hasImage && (
        <motion.img
          src={slide.imageUrl}
          alt={slide.title}
          className="w-full max-w-md rounded-2xl object-cover"
          style={{ maxHeight: 280 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      <motion.h1
        className="text-4xl font-bold"
        style={{ color: config.colorPalette.primary, fontFamily: hub === 'playground' ? "'Quicksand', sans-serif" : undefined }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {slide.title}
      </motion.h1>

      <motion.p
        className="text-xl leading-relaxed max-w-xl whitespace-pre-line"
        style={{ color: config.colorPalette.text }}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {content}
      </motion.p>

      {hub === 'playground' && config.mascot && (
        <motion.div
          className="text-6xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🐣
        </motion.div>
      )}
    </div>
  );
}
