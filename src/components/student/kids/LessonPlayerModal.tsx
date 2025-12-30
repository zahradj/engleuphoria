import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Play, CheckCircle } from 'lucide-react';

interface LessonPlayerModalProps {
  isOpen: boolean;
  lesson: {
    id: number;
    title: string;
    type: 'video' | 'quiz' | 'game';
  } | null;
  onClose: () => void;
  onComplete: (lessonId: number) => void;
}

export const LessonPlayerModal: React.FC<LessonPlayerModalProps> = ({
  isOpen,
  lesson,
  onClose,
  onComplete,
}) => {
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = () => {
    if (!lesson) return;
    setIsFinishing(true);
    
    // Small delay for animation feel
    setTimeout(() => {
      onComplete(lesson.id);
      setIsFinishing(false);
      onClose();
    }, 300);
  };

  const renderContent = () => {
    if (!lesson) return null;

    switch (lesson.type) {
      case 'video':
        return (
          <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-inner">
            {/* Mock YouTube Player */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500 transition-colors shadow-lg"
              >
                <Play className="w-10 h-10 text-white fill-white ml-1" />
              </motion.div>
              <p className="mt-4 text-lg font-medium text-gray-300">Click to Play Video</p>
              <p className="text-sm text-gray-500 mt-1">Mock Video Player - {lesson.title}</p>
            </div>
            {/* Fake progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 10, ease: 'linear' }}
                className="h-full bg-red-500"
              />
            </div>
          </div>
        );

      case 'game':
        return (
          <div className="w-full aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-16 h-16 text-purple-500" />
            </motion.div>
            <p className="mt-4 text-xl font-bold text-purple-700">Game Loading...</p>
            <p className="text-purple-500 mt-2">Get ready to play!</p>
          </div>
        );

      case 'quiz':
        return (
          <div className="w-full aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-6xl mb-4"
            >
              🧠
            </motion.div>
            <p className="text-xl font-bold text-blue-700">Quiz Time!</p>
            <p className="text-blue-500 mt-2">Answer the questions to earn stars</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && lesson && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-6 pt-8">
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl md:text-4xl font-bold text-white text-center drop-shadow-lg"
                style={{ fontFamily: "'Fredoka', cursive" }}
              >
                {lesson.title}
              </motion.h2>
              <p className="text-white/80 text-center mt-2 capitalize">
                {lesson.type === 'video' && '🎬 Watch & Learn'}
                {lesson.type === 'game' && '🎮 Play & Practice'}
                {lesson.type === 'quiz' && '📝 Test Your Knowledge'}
              </p>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
              {renderContent()}
            </div>

            {/* Footer with Finish Button */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFinish}
                disabled={isFinishing}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xl font-bold rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all disabled:opacity-70"
              >
                {isFinishing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    I Finished!
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
