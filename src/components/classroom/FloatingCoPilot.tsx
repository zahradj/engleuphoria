import React, { useState, useMemo } from 'react';
import { Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Target, GripVertical, AlertTriangle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { SharedNotesPanel } from './SharedNotesPanel';

interface MissionItem {
  id: string;
  label: string;
  category: 'vocabulary' | 'grammar' | 'goal';
  checked: boolean;
}

interface FloatingCoPilotProps {
  lessonTitle: string;
  isTeacher: boolean;
  sharedNotes: string;
  sessionContext: Record<string, any>;
  onNotesChange: (notes: string) => void;
}

const getDefaultMission = (title: string, ctx: Record<string, any>): MissionItem[] => {
  const level = ctx?.level || 'unknown';
  return [
    { id: 'vocab', label: level === 'playground' ? 'Learn 5 new animal words' : level === 'academy' ? 'Master 6 topic-related words' : 'Acquire 6 business vocabulary terms', category: 'vocabulary', checked: false },
    { id: 'grammar', label: level === 'playground' ? 'Practice simple present tense' : level === 'academy' ? 'Use present perfect correctly' : 'Master conditional structures', category: 'grammar', checked: false },
    { id: 'goal', label: level === 'playground' ? 'Describe your favorite animal' : level === 'academy' ? 'Hold a 2-minute conversation' : 'Deliver a mini-presentation', category: 'goal', checked: false },
  ];
};

const categoryIcons: Record<string, string> = {
  vocabulary: '📚',
  grammar: '✏️',
  goal: '🎯'
};

const categoryLabels: Record<string, string> = {
  vocabulary: 'Target Vocabulary',
  grammar: 'Grammar Point',
  goal: 'Practical Goal'
};

export const FloatingCoPilot: React.FC<FloatingCoPilotProps> = ({
  lessonTitle,
  isTeacher,
  sharedNotes,
  sessionContext,
  onNotesChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [missionItems, setMissionItems] = useState<MissionItem[]>(() =>
    getDefaultMission(lessonTitle, sessionContext)
  );

  // Extract weak points from mistake_history in session context
  const weakPointsTips = useMemo(() => {
    const mistakes: Array<{ error_type: string }> = sessionContext?.mistakeHistory || [];
    if (mistakes.length === 0) return [];
    // Count frequency
    const freq: Record<string, number> = {};
    for (const m of mistakes) {
      freq[m.error_type] = (freq[m.error_type] || 0) + 1;
    }
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([area, count]) => `${area} (${count} occurrence${count > 1 ? 's' : ''})`);
  }, [sessionContext?.mistakeHistory]);

  const handleToggle = (id: string) => {
    if (!isTeacher) return;
    setMissionItems(prev => prev.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => setIsExpanded(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-transform"
          animate={{ boxShadow: ['0 0 15px rgba(168,85,247,0.3)', '0 0 25px rgba(168,85,247,0.5)', '0 0 15px rgba(168,85,247,0.3)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-5 h-5" />
        </motion.button>
      </div>
    );
  }

  return (
    <Rnd
      default={{ x: window.innerWidth - 390, y: window.innerHeight - 520, width: 360, height: 'auto' as any }}
      minWidth={320}
      maxWidth={420}
      enableResizing={{ right: true, left: true }}
      dragHandleClassName="copilot-drag-handle"
      bounds="window"
      className="z-40"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel rounded-2xl shadow-2xl shadow-black/40 overflow-hidden flex flex-col max-h-[70vh]"
      >
        {/* Header */}
        <div className="copilot-drag-handle flex items-center justify-between px-4 py-3 border-b border-gray-800 cursor-grab active:cursor-grabbing select-none">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-gray-500" />
            <Target className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-white">AI Co-Pilot</span>
          </div>
          <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {/* Context Banner */}
          {sessionContext?.summary && (
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-300">{sessionContext.summary}</p>
            </div>
          )}

          {/* Mission Checklist */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Today's Mission</p>
            {missionItems.map(item => (
              <div key={item.id} className="flex items-start gap-2">
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={() => handleToggle(item.id)}
                  disabled={!isTeacher}
                  className="mt-0.5 border-gray-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <div className="flex-1">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    {categoryIcons[item.category]} {categoryLabels[item.category]}
                  </p>
                  <p className={`text-xs ${item.checked ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-gray-800" />

          {/* AI Weak Points Tips */}
          {isTeacher && weakPointsTips.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                Student Weak Areas
              </p>
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-1">
                {weakPointsTips.map((tip, i) => (
                  <p key={i} className="text-xs text-amber-300">• Focus on: {tip}</p>
                ))}
              </div>
            </div>
          )}

          <div className="h-px bg-gray-800" />

          {/* Shared Notes */}
          <SharedNotesPanel
            notes={sharedNotes}
            onNotesChange={onNotesChange}
            sessionContext={sessionContext}
            readOnly={false}
          />
        </div>
      </motion.div>
    </Rnd>
  );
};
