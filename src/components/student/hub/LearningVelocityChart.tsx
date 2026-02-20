import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface DayData {
  day: string;
  studied: number;
  goal: number;
}

interface LearningVelocityChartProps {
  isDarkMode?: boolean;
  weeklyData?: DayData[];
  dailyGoalHours?: number;
}

const DEFAULT_DATA: DayData[] = [
  { day: 'Mon', studied: 1.5, goal: 2 },
  { day: 'Tue', studied: 2.0, goal: 2 },
  { day: 'Wed', studied: 0.5, goal: 2 },
  { day: 'Thu', studied: 1.0, goal: 2 },
  { day: 'Fri', studied: 2.5, goal: 2 },
  { day: 'Sat', studied: 0.0, goal: 2 },
  { day: 'Sun', studied: 1.0, goal: 2 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  isDarkMode: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, isDarkMode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`px-3 py-2 rounded-lg shadow-lg text-xs border ${
      isDarkMode
        ? 'bg-gray-800 border-gray-600 text-gray-100'
        : 'bg-white border-gray-200 text-gray-800'
    }`}>
      <p className="font-bold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{p.value} hrs</strong>
        </p>
      ))}
    </div>
  );
};

export const LearningVelocityChart: React.FC<LearningVelocityChartProps> = ({
  isDarkMode = false,
  weeklyData = DEFAULT_DATA,
  dailyGoalHours = 2,
}) => {
  const totalStudied = weeklyData.reduce((s, d) => s + d.studied, 0);
  const totalGoal = dailyGoalHours * weeklyData.length;
  const pct = Math.round((totalStudied / totalGoal) * 100);

  const gridColor = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const axisColor = isDarkMode ? '#6B7280' : '#94A3B8';

  return (
    <Card className={isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'border-gray-100'}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
          Learning Velocity
        </CardTitle>
        <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
          Hours studied vs. daily goal — last 7 days
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={weeklyData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="studiedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: axisColor }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: axisColor }}
              axisLine={false}
              tickLine={false}
              domain={[0, 'dataMax + 0.5']}
            />
            <Tooltip content={<CustomTooltip isDarkMode={isDarkMode} />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, color: axisColor, paddingTop: 8 }}
            />

            {/* Studied area */}
            <Area
              type="monotone"
              dataKey="studied"
              name="Hours Studied"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#studiedGradient)"
              dot={{ r: 3, fill: '#10B981', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />

            {/* Goal dashed line */}
            <Area
              type="monotone"
              dataKey="goal"
              name="Daily Goal"
              stroke="#94A3B8"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              fill="none"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Summary */}
        <div className={`mt-3 flex items-center justify-between text-sm rounded-lg px-4 py-2.5 ${
          isDarkMode ? 'bg-gray-700/40' : 'bg-gray-50'
        }`}>
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            You've studied <strong className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}>
              {totalStudied.toFixed(1)} hrs
            </strong> this week
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            pct >= 80
              ? isDarkMode ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
              : isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {pct}% of goal
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
