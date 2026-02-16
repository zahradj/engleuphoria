import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTeacherMatchmaker } from '@/hooks/useTeacherMatchmaker';
import { toast } from 'sonner';

interface RecommendedTeachersProps {
  isDarkMode?: boolean;
}

export const RecommendedTeachers: React.FC<RecommendedTeachersProps> = ({ isDarkMode = false }) => {
  const { teachers, loading, hasBookings, bookTrialLesson } = useTeacherMatchmaker();

  if (loading || hasBookings || teachers.length === 0) return null;

  const handleBook = async (teacherId: string, teacherName: string) => {
    try {
      await bookTrialLesson(teacherId);
      toast.success(`Trial lesson booked with ${teacherName}! 🎉`);
    } catch {
      toast.error('Failed to book trial lesson. Please try again.');
    }
  };

  const cardBg = isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-100';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <Card className={cardBg}>
      <CardHeader>
        <CardTitle className={`text-lg flex items-center gap-2 ${textColor}`}>
          <BookOpen className="w-5 h-5 text-violet-500" />
          Recommended Teachers for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {teachers.map((teacher, i) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl p-4 border flex flex-col items-center text-center gap-3 ${
                isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white text-2xl font-bold">
                {(teacher.full_name || 'T')[0]}
              </div>

              <h3 className={`font-semibold text-sm ${textColor}`}>
                {teacher.full_name || 'Teacher'}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className={`text-sm font-medium ${textColor}`}>{teacher.rating?.toFixed(1) || '5.0'}</span>
                <span className={`text-xs ${mutedColor}`}>({teacher.total_reviews || 0})</span>
              </div>

              {/* Specializations */}
              <div className="flex flex-wrap gap-1 justify-center">
                {(teacher.specializations || []).slice(0, 2).map((spec, j) => (
                  <span
                    key={j}
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isDarkMode ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700'
                    }`}
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Experience */}
              <div className={`flex items-center gap-1 text-xs ${mutedColor}`}>
                <Clock className="w-3 h-3" />
                {teacher.years_experience || 0} years exp.
              </div>

              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:opacity-90"
                onClick={() => handleBook(teacher.user_id, teacher.full_name || 'Teacher')}
              >
                Book Trial Lesson
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
