import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getLibraryLessons, LibraryLesson } from '@/services/lessonLibraryService';
import { HUB_CONFIGS } from '@/components/admin/lesson-builder/ai-wizard/hubConfig';
import { HubType } from '@/components/admin/lesson-builder/ai-wizard/types';
import { BookOpen, Clock, Play, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HUB_TABS = [
  { value: 'all', label: 'All', emoji: '📚' },
  { value: 'playground', label: 'Playground', emoji: '🛝' },
  { value: 'academy', label: 'Academy', emoji: '🏫' },
  { value: 'professional', label: 'Professional', emoji: '🏢' },
];

const HUB_CARD_STYLES: Record<string, { bg: string; border: string; badge: string }> = {
  playground: {
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    border: 'border-amber-200/60',
    badge: 'bg-amber-500 text-white',
  },
  academy: {
    bg: 'bg-gradient-to-br from-indigo-950 to-slate-900',
    border: 'border-indigo-500/30',
    badge: 'bg-violet-600 text-white',
  },
  professional: {
    bg: 'bg-gradient-to-br from-slate-50 to-gray-100',
    border: 'border-slate-200',
    badge: 'bg-slate-700 text-white',
  },
};

export default function LessonLibraryHub() {
  const [lessons, setLessons] = useState<LibraryLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadLessons();
  }, [activeTab]);

  const loadLessons = async () => {
    setLoading(true);
    try {
      const data = await getLibraryLessons(activeTab === 'all' ? undefined : activeTab);
      setLessons(data);
    } catch (err) {
      console.error('Failed to load lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  const openLesson = (lesson: LibraryLesson) => {
    navigate(`/lesson/${lesson.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Lesson Library
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Browse and play AI-generated lessons. Click any card to start.
        </p>
      </div>

      {/* Hub filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {HUB_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.value
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {/* Lesson Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No lessons found. Generate one in the AI Wizard!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {lessons.map((lesson, i) => {
              const hub = (lesson.target_system || 'playground') as HubType;
              const cardStyle = HUB_CARD_STYLES[hub] || HUB_CARD_STYLES.playground;
              const hubConfig = HUB_CONFIGS[hub];
              const slideCount = lesson.content?.slides?.length || 0;

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => openLesson(lesson)}
                  className={`group cursor-pointer rounded-2xl border overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] ${cardStyle.bg} ${cardStyle.border}`}
                >
                  {/* Thumbnail / cover */}
                  <div className="relative h-36 overflow-hidden">
                    {lesson.thumbnail_url ? (
                      <img
                        src={lesson.thumbnail_url}
                        alt={lesson.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: hubConfig?.colorPalette?.highlight || '#f0f0f0' }}>
                        {hubConfig?.emoji || '📖'}
                      </div>
                    )}

                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <motion.div
                        className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Play className="h-5 w-5 text-slate-800 ml-0.5" />
                      </motion.div>
                    </div>

                    {/* Hub badge */}
                    <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${cardStyle.badge}`}>
                      {hub.toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className={`font-bold text-base mb-1 line-clamp-1 ${hub === 'academy' ? 'text-white' : 'text-foreground'}`}>
                      {lesson.title}
                    </h3>
                    <p className={`text-xs mb-3 line-clamp-2 ${hub === 'academy' ? 'text-indigo-300' : 'text-muted-foreground'}`}>
                      {lesson.description || 'AI-generated lesson'}
                    </p>
                    <div className={`flex items-center gap-3 text-[11px] ${hub === 'academy' ? 'text-indigo-400' : 'text-muted-foreground'}`}>
                      <span className="flex items-center gap-1">
                        <BookOpen size={11} /> {slideCount} slides
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {lesson.duration_minutes || 30}m
                      </span>
                      <span className="uppercase font-medium">{lesson.difficulty_level}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
