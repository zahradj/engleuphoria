import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign } from 'lucide-react';
import { LESSON_PRICING } from '@/types/pricing';

interface IndividualLessonCardProps {
  duration: 30;
  onBookLesson: () => void;
}

export const IndividualLessonCard: React.FC<IndividualLessonCardProps> = ({
  duration,
  onBookLesson
}) => {
  const pricing = LESSON_PRICING;
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-teacher/30">
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-bold text-foreground">
          {duration}-Minute Lesson
        </CardTitle>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          Individual session
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-teacher">
            €{pricing.student_price.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">
            One-time payment
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium">{duration} minutes</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Teacher receives:</span>
            <span className="font-medium">€{pricing.teacher_payout.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Platform fee:</span>
            <span className="font-medium">€{pricing.platform_profit.toFixed(2)}</span>
          </div>
        </div>
        
        <Button 
          onClick={onBookLesson}
          className="w-full bg-gradient-to-r from-teacher to-teacher-accent hover:from-teacher-dark hover:to-teacher text-white"
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Book {duration}-min Lesson
        </Button>
        
        <div className="text-xs text-center text-muted-foreground">
          ✅ Secure payment via Stripe
          <br />
          ✅ 6-hour cancellation policy
        </div>
      </CardContent>
    </Card>
  );
};