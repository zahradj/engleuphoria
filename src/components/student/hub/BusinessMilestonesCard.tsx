import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, Circle, Clock, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  date?: string;
}

interface BusinessMilestonesCardProps {
  milestones?: Milestone[];
  timeSavedHours?: number;
  isDarkMode?: boolean;
}

const defaultMilestones: Milestone[] = [
  { id: '1', title: 'Business Email Course', completed: true, date: 'Jan 15' },
  { id: '2', title: 'Interview Prep Module', completed: true, date: 'Jan 22' },
  { id: '3', title: 'Public Speaking Workshop', completed: false },
  { id: '4', title: 'Negotiation Skills', completed: false },
];

export const BusinessMilestonesCard: React.FC<BusinessMilestonesCardProps> = ({
  milestones = defaultMilestones,
  timeSavedHours = 4.5,
  isDarkMode = false,
}) => {
  const completedCount = milestones.filter(m => m.completed).length;
  const progress = (completedCount / milestones.length) * 100;
  const nextMilestone = milestones.find(m => !m.completed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 ${
        isDarkMode
          ? 'bg-gray-800/50 border border-gray-700'
          : 'bg-white border border-gray-100 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Milestones
          </h3>
        </div>
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {completedCount}/{milestones.length} completed
        </span>
      </div>
      
      {/* Progress */}
      <div className="mb-4">
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Milestones List */}
      <div className="space-y-3 mb-5">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              milestone.completed
                ? isDarkMode
                  ? 'bg-emerald-900/20'
                  : 'bg-emerald-50'
                : isDarkMode
                  ? 'bg-gray-700/30'
                  : 'bg-gray-50'
            }`}
          >
            {milestone.completed ? (
              <CheckCircle2 className={`w-5 h-5 ${
                isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
              }`} />
            ) : (
              <Circle className={`w-5 h-5 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
            )}
            
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                milestone.completed
                  ? isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
                  : isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {milestone.title}
              </p>
              {milestone.date && (
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Completed {milestone.date}
                </p>
              )}
            </div>
            
            {milestone.completed && (
              <Award className={`w-4 h-4 ${
                isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`} />
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Time Saved Widget */}
      <div className={`rounded-xl p-4 ${
        isDarkMode
          ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-700/30'
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}>
              <Clock className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Time Saved This Month
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {timeSavedHours} <span className="text-sm font-normal">hours</span>
              </p>
            </div>
          </div>
          
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
            isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'
          }`}>
            <TrendingUp className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span className={`text-xs font-medium ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
            }`}>
              +23%
            </span>
          </div>
        </div>
        
        <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          You're learning 23% faster than the average professional learner
        </p>
      </div>
      
      {/* Next Milestone CTA */}
      {nextMilestone && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full mt-4 py-3 rounded-xl font-medium transition-all ${
            isDarkMode
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg'
          }`}
        >
          Start: {nextMilestone.title}
        </motion.button>
      )}
    </motion.div>
  );
};
