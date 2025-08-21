import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  ChevronRight,
  Clock,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TeacherWelcomeProps {
  teacherName?: string;
  upcomingLessons?: number;
  totalStudents?: number;
  rating?: number;
}

export function TeacherWelcome({ 
  teacherName = "Teacher",
  upcomingLessons = 0,
  totalStudents = 0,
  rating = 0
}: TeacherWelcomeProps) {
  const navigate = useNavigate();

  return (
    <Card className="professional-shadow-lg engagement-gradient text-white overflow-hidden">
      <CardContent className="p-8 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4">
            <Award className="h-8 w-8" />
          </div>
          <div className="absolute bottom-4 left-4">
            <Users className="h-6 w-6" />
          </div>
          <div className="absolute top-1/2 left-1/3">
            <BookOpen className="h-4 w-4" />
          </div>
        </div>

        <div className="relative z-10">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">
              Welcome, {teacherName}! 👨‍🏫
            </h2>
            <p className="text-white/90 text-lg">
              Ready to inspire and educate your students today?
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            {upcomingLessons > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Clock className="mr-1 h-3 w-3" />
                {upcomingLessons} upcoming
              </Badge>
            )}
            {totalStudents > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Users className="mr-1 h-3 w-3" />
                {totalStudents} students
              </Badge>
            )}
            {rating > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                ⭐ {rating.toFixed(1)} rating
              </Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/unified-classroom')}
              variant="secondary"
              size="lg"
              className="hover:scale-105 smooth-transition flex-1"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Start Teaching
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              onClick={() => navigate('/teacher-availability')}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:scale-105 smooth-transition"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Set Schedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}