import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import { TrendingUp, Trophy, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLearningVelocity, WeekPoint } from '@/hooks/useLearningVelocity';

interface LearningVelocityChartProps {
  isDarkMode?: boolean;
  // Legacy props kept for backwards compat but ignored when real data is available
  weeklyData?: any[];
  dailyGoalHours?: number;
}

const CustomTooltip = ({ active, payload, isDarkMode }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as WeekPoint;
  if (!d) return null;

  return (
    <div
      className={`px-3 py-2 rounded-lg shadow-lg text-xs border ${
        isDarkMode
          ? 'bg-[#1A2B3C] border-[#C9A96E]/30 text-gray-100'
          : 'bg-white border-gray-200 text-gray-800'
      }`}
    >
      <p className="font-bold mb-1">{d.week}</p>
      <p>
        Progress Points: <strong style={{ color: '#C9A96E' }}>{d.points}</strong>
      </p>
      <p>Lessons completed: {d.lessonsCompleted}</p>
      {d.isMilestone && (
        <p className="mt-1 text-yellow-500 font-semibold">
          🏆 {d.milestoneType === '20th' ? '20th' : '10th'} session milestone!
        </p>
      )}
    </div>
  );
};

export const LearningVelocityChart: React.FC<LearningVelocityChartProps> = ({
  isDarkMode = false,
}) => {
  const { weeklyData, totalLessons, loading } = useLearningVelocity();

  const gridColor = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const axisColor = isDarkMode ? '#6B7280' : '#94A3B8';

  return (
    <Card
      className={
        isDarkMode
          ? 'bg-[#1A2B3C]/80 border-[#2A3D50]'
          : 'border-gray-100'
      }
    >
      <CardHeader className="pb-2">
        <CardTitle
          className={`text-lg flex items-center gap-2 tracking-tight ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          <TrendingUp className="w-5 h-5" style={{ color: '#C9A96E' }} />
          Learning Velocity
        </CardTitle>
        <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
          Weekly progress points — lessons × score
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A96E' }} />
          </div>
        ) : weeklyData.length === 0 ? (
          <div className="h-[200px] flex flex-col items-center justify-center text-center gap-2">
            <Trophy className={`w-10 h-10 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Complete your first lesson to start tracking progress
            </p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: axisColor }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: axisColor }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
                <Line
                  type="monotone"
                  dataKey="points"
                  name="Progress Points"
                  stroke="#C9A96E"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#C9A96E', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
                {/* Milestone markers */}
                {weeklyData
                  .filter((w) => w.isMilestone)
                  .map((w, i) => (
                    <ReferenceDot
                      key={i}
                      x={w.week}
                      y={w.points}
                      r={8}
                      fill="#F59E0B"
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>

            {/* Summary */}
            <div
              className={`mt-3 flex items-center justify-between text-sm rounded-lg px-4 py-2.5 ${
                isDarkMode ? 'bg-[#1A2B3C] border border-[#2A3D50]' : 'bg-gray-50'
              }`}
            >
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Total lessons completed:{' '}
                <strong style={{ color: '#C9A96E' }}>{totalLessons}</strong>
              </span>
              {totalLessons >= 10 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                  🏆 {totalLessons >= 20 ? 'Master' : 'Rising Star'}
                </span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
