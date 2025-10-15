import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Star, ArrowRight, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface WelcomeSectionProps {
  teacherName: string;
  onJoinClassroom: () => void;
  weeklyEarnings: number;
  todaysClasses?: number;
  totalStudents?: number;
  rating?: string;
  onStartClass?: () => void;
}
export const WelcomeSection = ({
  teacherName,
  onJoinClassroom,
  weeklyEarnings,
  todaysClasses = 3,
  totalStudents = 24,
  rating = "4.8",
  onStartClass
}: WelcomeSectionProps) => {
  const navigate = useNavigate();
  const handleEnterClassroom = () => {
    const teacherId = `teacher-${Date.now()}`;
    navigate(`/classroom?role=teacher&name=${encodeURIComponent(teacherName)}&userId=${teacherId}&roomId=unified-classroom-1`);
  };
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  return <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-purple-900/50 dark:via-pink-900/50 dark:to-blue-900/50 border border-purple-300/50 dark:border-purple-600/50 p-8 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 via-pink-200/30 to-blue-200/30 dark:from-purple-800/20 dark:via-pink-800/20 dark:to-blue-800/20" />
      <div className="absolute top-4 right-4">
        <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-300/40 to-indigo-300/40 animate-pulse" />
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-300/40 to-purple-300/40 animate-pulse delay-1000" />
      </div>
      <div className="absolute top-1/2 right-1/4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-300/30 to-blue-300/30 animate-pulse delay-500" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {getGreeting()}, {teacherName}! 👋
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Ready to inspire your students today?
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-purple-300">
              <Calendar className="h-4 w-4" />
              📅 {todaysClasses} classes today
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-300">
              <Users className="h-4 w-4" />
              👥 {totalStudents} active students
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-300">
              <Star className="h-4 w-4 text-yellow-500" />
              ⭐ {rating} rating
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 text-white px-6 shadow-lg hover:shadow-xl transition-all" onClick={handleEnterClassroom}>
            <Video className="mr-2 h-5 w-5" />
            🎥 Enter Classroom
          </Button>
          
        </div>
      </div>
    </div>;
};