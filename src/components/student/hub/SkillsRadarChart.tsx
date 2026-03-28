import React, { useState, useEffect } from 'react';
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
import { Target, Loader2, Eye, EyeOff } from 'lucide-react';
import { useStudentSkills } from '@/hooks/useStudentSkills';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SkillsRadarChartProps {
  isDarkMode?: boolean;
}

const CustomTooltip = ({ active, payload, isDarkMode }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-xl shadow-xl text-sm border backdrop-blur-md',
        isDarkMode
          ? 'bg-[hsl(210,40%,12%)/90] border-[hsl(38,50%,60%)/30] text-gray-100'
          : 'bg-card/90 border-border text-foreground'
      )}
    >
      <p className="font-bold mb-1">{data.skillLabel}</p>
      <p>
        Current Level:{' '}
        <span className="font-semibold text-primary">
          {data.cefrEquivalent}
        </span>{' '}
        ({data.current}/10)
      </p>
      {data.nextFocus && (
        <p className="text-xs mt-1 text-muted-foreground">
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
  const [showGlobalAvg, setShowGlobalAvg] = useState(false);
  const [globalAvgs, setGlobalAvgs] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!showGlobalAvg) return;
    const fetchAvgs = async () => {
      const { data } = await supabase.rpc('get_global_skill_averages');
      if (data) {
        const map: Record<string, number> = {};
        data.forEach((r: any) => { map[r.skill_name] = Number(r.avg_score); });
        setGlobalAvgs(map);
      }
    };
    fetchAvgs();
  }, [showGlobalAvg]);

  const chartData = skills.map((s) => ({
    skill: s.skillLabel,
    current: s.current,
    target: s.target,
    globalAvg: globalAvgs[s.skill] || 0,
    skillLabel: s.skillLabel,
    cefrEquivalent: s.cefrEquivalent,
    nextFocus: s.nextFocus,
    isMastered: s.current >= 10,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.2 }}
      className={cn(
        'rounded-2xl p-5',
        isDarkMode
          ? 'bg-[hsl(210,40%,12%)/80] border border-[hsl(210,30%,22%)]'
          : 'bg-card border border-border shadow-sm'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold tracking-tight text-foreground">
            Skills Radar
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Global avg toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGlobalAvg(!showGlobalAvg)}
            className="text-xs gap-1.5 h-7 rounded-lg"
          >
            {showGlobalAvg ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            Global Avg
          </Button>

          {/* Legend */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground text-xs">Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-secondary opacity-50" />
              <span className="text-muted-foreground text-xs">Target</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="80%">
              <defs>
                <linearGradient id="auroraGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--accent, var(--primary)))" stopOpacity={0.15} />
                </linearGradient>
                <linearGradient id="targetGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <PolarGrid stroke={isDarkMode ? 'hsl(210, 30%, 22%)' : 'hsl(var(--border))'} />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 10]}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                axisLine={false}
              />

              {/* Global average (grey, behind everything) */}
              {showGlobalAvg && (
                <Radar
                  name="Global Average"
                  dataKey="globalAvg"
                  stroke="hsl(var(--muted-foreground))"
                  fill="hsl(var(--muted-foreground))"
                  fillOpacity={0.08}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              )}

              {/* Target Area */}
              <Radar
                name="Target"
                dataKey="target"
                stroke="hsl(var(--secondary-foreground))"
                fill="url(#targetGradient)"
                fillOpacity={0.15}
                strokeWidth={1.5}
                strokeDasharray="5 5"
              />

              {/* Current Area — Aurora gradient */}
              <Radar
                name="Current Level"
                dataKey="current"
                stroke="hsl(var(--primary))"
                fill="url(#auroraGradient)"
                fillOpacity={0.3}
                strokeWidth={2}
                style={{
                  filter: isDarkMode ? 'drop-shadow(0 0 6px hsl(var(--primary) / 0.4))' : 'none',
                }}
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
              className={cn(
                'text-center p-2 rounded-lg relative overflow-hidden',
                isDarkMode ? 'bg-[hsl(210,40%,12%)] border border-[hsl(210,30%,22%)]' : 'bg-muted/50'
              )}
            >
              {/* Ripple animation for mastered skills */}
              {skill.current >= 10 && (
                <div className="absolute inset-0 animate-pulse bg-primary/5 rounded-lg" />
              )}
              <p className="text-[10px] leading-tight text-muted-foreground relative z-10">
                {skill.skillLabel}
              </p>
              <p className="text-sm font-bold mt-0.5 text-primary relative z-10">
                {skill.cefrEquivalent}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
