import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Star, 
  Target, 
  ChevronRight,
  Trophy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StudentWelcomeProps {
  userName?: string;
  level?: number;
  xp?: number;
  streak?: number;
}

export function StudentWelcome({ 
  userName = "Student",
  level = 1,
  xp = 0,
  streak = 0
}: StudentWelcomeProps) {
  const navigate = useNavigate();

  return (
    <Card className="professional-shadow-lg engagement-gradient text-white overflow-hidden">
      <CardContent className="p-8 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4">
            <Star className="h-8 w-8" />
          </div>
          <div className="absolute bottom-4 left-4">
            <Trophy className="h-6 w-6" />
          </div>
          <div className="absolute top-1/2 left-1/3">
            <Target className="h-4 w-4" />
          </div>
        </div>

        <div className="relative z-10">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {userName}! 🌟
            </h2>
            <p className="text-white/90 text-lg">
              Ready to continue your English learning journey?
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Level {level}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {xp} XP
            </Badge>
            {streak > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {streak} day streak 🔥
              </Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/k12-lessons')}
              variant="secondary"
              size="lg"
              className="hover:scale-105 smooth-transition flex-1"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Start Learning
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              onClick={() => navigate('/unified-classroom')}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:scale-105 smooth-transition"
            >
              Join Live Class
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}