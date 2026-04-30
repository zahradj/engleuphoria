import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  extractClassroomSlides,
  getLibraryLessonSlides,
  getLibraryLessons,
  getLessonById,
  toLibraryLessonCard,
  type ClassroomSlide,
  type LibraryLessonCard,
} from '@/services/lessonLibraryService';


interface LibraryDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelectLesson: (slides: any[], title: string) => void;
  slideFormat?: 'classroom' | 'raw';
}

const HUB_BADGE_COLORS: Record<string, string> = {
  playground: 'bg-amber-100 text-amber-700 border-amber-200',
  academy: 'bg-violet-100 text-violet-700 border-violet-200',
  professional: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function LibraryDrawer({ open, onClose, onSelectLesson, slideFormat = 'classroom' }: LibraryDrawerProps) {
  const [lessons, setLessons] = useState<LibraryLessonCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingLessonId, setLoadingLessonId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getLibraryLessons()
      .then((data) => setLessons(data.map(toLibraryLessonCard)))
      .catch((error) => {
        console.warn('LibraryDrawer fetch error:', error);
        setLessons([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [open]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return lessons;
    const q = searchQuery.toLowerCase();
    return lessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.difficulty_level.toLowerCase().includes(q) ||
        l.hub.toLowerCase().includes(q) ||
        (l.description && l.description.toLowerCase().includes(q))
    );
  }, [lessons, searchQuery]);

  const handleSelect = async (lessonId: string) => {

    setLoadingLessonId(lessonId);
    try {
      const lesson = await getLessonById(lessonId);
      const slides = slideFormat === 'raw'
        ? getLibraryLessonSlides(lesson)
        : extractClassroomSlides(lesson);
      onSelectLesson(slides, lesson.title || 'Lesson');
    } catch (error) {
      console.error('Failed to load lesson slides:', error);
      setLoadingLessonId(null);
      return;
    }
    setLoadingLessonId(null);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <BookOpen size={22} className="text-indigo-500" />
              <h2 className="text-lg font-bold flex-1">Lesson Library</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                />
              </div>
            </div>

            {/* Lesson list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 opacity-60">
                  <div className="w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm">Loading lessons…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 opacity-50">
                  <BookOpen size={40} />
                  <p className="text-sm font-medium">
                    {searchQuery ? 'No lessons match your search' : 'No lessons available'}
                  </p>
                </div>
              ) : (
                filtered.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleSelect(lesson.id)}
                    disabled={loadingLessonId === lesson.id}
                    className="w-full text-left p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md bg-white dark:bg-slate-800/60 transition-all group disabled:opacity-60"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {lesson.title}
                        </h3>
                        {lesson.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {lesson.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {lesson.hub && (
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                HUB_BADGE_COLORS[lesson.hub] || 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              {lesson.hub}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            {lesson.slide_count} slides
                          </span>
                        </div>
                      </div>
                      {loadingLessonId === lesson.id && (
                        <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0 mt-1" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
