import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Clock, Zap, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { HubId, HUB_THEMES } from '@/utils/hubTheme';
import { cn } from '@/lib/utils';

interface JoinLessonHeroProps {
  hubId: HubId;
  isDark?: boolean;
}

interface UpcomingLesson {
  id: string;
  title: string;
  scheduled_at: string;
  room_link?: string;
  room_id?: string;
  teacher_name?: string;
}

export const JoinLessonHero: React.FC<JoinLessonHeroProps> = ({ hubId, isDark = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<UpcomingLesson | null>(null);
  const [minutesUntil, setMinutesUntil] = useState(999);
  const theme = HUB_THEMES[hubId];

  useEffect(() => {
    if (!user?.id) return;

    const fetchNext = async () => {
      const now = new Date();
      const windowEnd = new Date(now.getTime() + 60 * 60 * 1000); // next hour

      const { data } = await supabase
        .from('lessons')
        .select('id, title, scheduled_at, room_link, room_id')
        .eq('student_id', user.id)
        .eq('status', 'scheduled')
        .gte('scheduled_at', new Date(now.getTime() - 5 * 60000).toISOString())
        .lte('scheduled_at', windowEnd.toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(1);

      if (data && data.length > 0) {
        setLesson(data[0]);
        const diff = Math.ceil((new Date(data[0].scheduled_at).getTime() - now.getTime()) / 60000);
        setMinutesUntil(diff);
      } else {
        setLesson(null);
      }
    };

    fetchNext();
    const interval = setInterval(fetchNext, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // Update countdown
  useEffect(() => {
    if (!lesson) return;
    const timer = setInterval(() => {
      const diff = Math.ceil((new Date(lesson.scheduled_at).getTime() - Date.now()) / 60000);
      setMinutesUntil(diff);
    }, 15000);
    return () => clearInterval(timer);
  }, [lesson]);

  const handleJoin = () => {
    if (!lesson) return;
    if (lesson.room_link) {
      navigate(lesson.room_link);
    } else {
      navigate(`/student-classroom/${lesson.id}`);
    }
  };

  const isStartingSoon = minutesUntil <= 5 && minutesUntil >= -5;
  const isLive = minutesUntil < 0;
  const showHero = lesson && minutesUntil <= 15;

  if (!showHero) {
    // Empty state — encourage booking
    return (
      <div className={cn(
        'rounded-2xl p-6 border-2 border-dashed transition-colors',
        isDark
          ? 'border-white/10 bg-white/5'
          : 'border-gray-200 bg-gray-50/50'
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl',
            isDark ? theme.darkCardBg : theme.activeBg
          )}>
            <Rocket className="w-7 h-7" style={{ color: isDark ? theme.darkPrimary : theme.primary }} />
          </div>
          <div className="flex-1">
            <p className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-800')}>
              No upcoming lessons
            </p>
            <p className={cn('text-sm mt-0.5', isDark ? 'text-white/60' : 'text-gray-500')}>
              Book your next {theme.label} session to start learning!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative rounded-2xl overflow-hidden',
        isStartingSoon && 'ring-2 ring-offset-2',
      )}
      style={{
        ['--tw-ring-color' as any]: isDark ? theme.darkPrimary : theme.primary,
      }}
    >
      <div className={cn(
        'bg-gradient-to-r p-5',
        isDark ? theme.darkHeaderGradient : theme.headerGradient
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              animate={isStartingSoon ? { scale: [1, 1.15, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
            >
              <Video className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-lg">
                  {isLive ? '🔴 Class In Progress' : isStartingSoon ? '⏰ Starting Soon!' : 'Next Lesson'}
                </h3>
                {isStartingSoon && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-white text-xs font-medium animate-pulse">
                    LIVE SOON
                  </span>
                )}
              </div>
              <p className="text-white/80 text-sm mt-0.5">{lesson.title}</p>
              <div className="flex items-center gap-1.5 text-white/70 text-xs mt-1">
                <Clock className="w-3 h-3" />
                {isLive
                  ? `Started ${Math.abs(minutesUntil)} min ago`
                  : minutesUntil === 0
                    ? 'Starting now!'
                    : `Starts in ${minutesUntil} min`
                }
              </div>
            </div>
          </div>

          <Button
            onClick={handleJoin}
            size="lg"
            className={cn(
              'text-white font-bold px-6 shadow-lg',
              isStartingSoon && 'animate-pulse',
              `bg-gradient-to-r ${isDark ? theme.darkButtonGradient : theme.buttonGradient}`
            )}
          >
            <Zap className="w-4 h-4 mr-2" />
            {isLive ? 'Join Now' : 'Join Classroom'}
          </Button>
        </div>
      </div>

      {/* Glow effect when starting soon */}
      {isStartingSoon && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          animate={{
            boxShadow: [
              `0 0 0 0 ${isDark ? theme.darkPrimary : theme.primary}66`,
              `0 0 0 12px ${isDark ? theme.darkPrimary : theme.primary}00`,
            ],
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
    </motion.div>
  );
};
