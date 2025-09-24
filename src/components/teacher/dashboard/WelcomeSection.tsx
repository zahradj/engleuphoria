import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Star, ArrowRight } from 'lucide-react';

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
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <div className="absolute top-4 right-4">
        <div className="h-20 w-20 rounded-full bg-primary/10 animate-pulse" />
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="h-12 w-12 rounded-full bg-primary/20 animate-pulse delay-1000" />
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
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
              <Calendar className="h-4 w-4" />
              {todaysClasses} classes today
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
              <Users className="h-4 w-4" />
              {totalStudents} active students
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
              <Star className="h-4 w-4 text-yellow-500" />
              {rating} rating
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
            onClick={onJoinClassroom}
          >
            Start Teaching
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};