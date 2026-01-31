import React from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Target } from 'lucide-react';

interface SkillData {
  skill: string;
  current: number;
  target: number;
}

interface SkillsRadarChartProps {
  skills?: SkillData[];
  isDarkMode?: boolean;
}

const defaultSkills: SkillData[] = [
  { skill: 'Speaking', current: 7, target: 9 },
  { skill: 'Listening', current: 8, target: 9 },
  { skill: 'Reading', current: 6, target: 8 },
  { skill: 'Writing', current: 5, target: 8 },
  { skill: 'Grammar', current: 7, target: 9 },
  { skill: 'Vocabulary', current: 6, target: 8 },
];

export const SkillsRadarChart: React.FC<SkillsRadarChartProps> = ({
  skills = defaultSkills,
  isDarkMode = false,
}) => {
  const colors = {
    current: isDarkMode ? '#10B981' : '#059669',
    target: isDarkMode ? '#3B82F6' : '#2563EB',
    grid: isDarkMode ? '#374151' : '#E5E7EB',
    text: isDarkMode ? '#9CA3AF' : '#6B7280',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl p-5 ${
        isDarkMode
          ? 'bg-gray-800/50 border border-gray-700'
          : 'bg-white border border-gray-100 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Skills Overview
          </h3>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500 opacity-50" />
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Target</span>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={skills} cx="50%" cy="50%" outerRadius="80%">
            <PolarGrid stroke={colors.grid} />
            <PolarAngleAxis 
              dataKey="skill" 
              tick={{ fill: colors.text, fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 10]} 
              tick={{ fill: colors.text, fontSize: 10 }}
              axisLine={false}
            />
            
            {/* Target Area (Background) */}
            <Radar
              name="Target"
              dataKey="target"
              stroke={colors.target}
              fill={colors.target}
              fillOpacity={0.15}
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            
            {/* Current Area (Foreground) */}
            <Radar
              name="Current Level"
              dataKey="current"
              stroke={colors.current}
              fill={colors.current}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
              labelStyle={{ color: isDarkMode ? '#F9FAFB' : '#111827', fontWeight: 600 }}
              formatter={(value: number, name: string) => [
                `Level ${value}/10`,
                name === 'current' ? 'Current' : 'Target',
              ]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Skills Summary */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {skills.slice(0, 3).map((skill) => (
          <div
            key={skill.skill}
            className={`text-center p-2 rounded-lg ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}
          >
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {skill.skill}
            </p>
            <p className={`text-lg font-bold ${
              skill.current >= skill.target - 1
                ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                : isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {skill.current}/10
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
