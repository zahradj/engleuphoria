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
import { Target, Loader2 } from 'lucide-react';
import { useStudentSkills } from '@/hooks/useStudentSkills';

interface SkillsRadarChartProps {
  isDarkMode?: boolean;
}

const CustomTooltip = ({ active, payload, isDarkMode }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div
      className={`px-4 py-3 rounded-xl shadow-xl text-sm border ${
        isDarkMode
          ? 'bg-[#1A2B3C] border-[#C9A96E]/30 text-gray-100'
          : 'bg-white border-gray-200 text-gray-800'
      }`}
    >
      <p className="font-bold mb-1">{data.skillLabel}</p>
      <p>
        Current Level:{' '}
        <span className="font-semibold" style={{ color: '#C9A96E' }}>
          {data.cefrEquivalent}
        </span>{' '}
        ({data.current}/10)
      </p>
      {data.nextFocus && (
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Focus on &ldquo;{data.nextFocus}&rdquo; to reach next level.
        </p>
      )}
    </div>
  );
};

export const SkillsRadarChart: React.FC<SkillsRadarChartProps> = ({
  isDarkMode = false,
}) => {
  const { skills, loading } = useStudentSkills();

  const colors = {
    current: '#C9A96E',
    target: isDarkMode ? '#4B6A8A' : '#3B5998',
    grid: isDarkMode ? '#2A3D50' : '#E2E8F0',
    text: isDarkMode ? '#8BA4B8' : '#64748B',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl p-5 ${
        isDarkMode
          ? 'bg-[#1A2B3C]/80 border border-[#2A3D50]'
          : 'bg-white border border-gray-100 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5" style={{ color: '#C9A96E' }} />
          <h3
            className={`font-semibold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Skills Overview
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#C9A96E' }} />
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full opacity-50"
              style={{ backgroundColor: colors.target }}
            />
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Target</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A96E' }} />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={skills.map((s) => ({
                skill: s.skillLabel,
                current: s.current,
                target: s.target,
                skillLabel: s.skillLabel,
                cefrEquivalent: s.cefrEquivalent,
                nextFocus: s.nextFocus,
              }))}
              cx="50%"
              cy="50%"
              outerRadius="80%"
            >
              <PolarGrid stroke={colors.grid} />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: colors.text, fontSize: 11 }}
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
                fillOpacity={0.12}
                strokeWidth={2}
                strokeDasharray="5 5"
              />

              {/* Current Area (Foreground) */}
              <Radar
                name="Current Level"
                dataKey="current"
                stroke={colors.current}
                fill={colors.current}
                fillOpacity={0.25}
                strokeWidth={2}
              />

              <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Skills Summary */}
      {!loading && skills.length > 0 && (
        <div className="grid grid-cols-5 gap-2 mt-4">
          {skills.map((skill) => (
            <div
              key={skill.skill}
              className={`text-center p-2 rounded-lg ${
                isDarkMode ? 'bg-[#1A2B3C] border border-[#2A3D50]' : 'bg-gray-50'
              }`}
            >
              <p
                className={`text-[10px] leading-tight ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {skill.skillLabel}
              </p>
              <p
                className="text-sm font-bold mt-0.5"
                style={{ color: '#C9A96E' }}
              >
                {skill.cefrEquivalent}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
