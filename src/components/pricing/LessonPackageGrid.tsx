import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, Zap } from 'lucide-react';
import { LessonPackage } from '@/types/pricing';

interface LessonPackageGridProps {
  packages: LessonPackage[];
  onSelectPackage: (packageId: string) => void;
  loading?: boolean;
}

export const LessonPackageGrid: React.FC<LessonPackageGridProps> = ({
  packages,
  onSelectPackage,
  loading = false
}) => {
  const formatPrice = (price: number) => `€${price.toFixed(2)}`;
  
  const getPerLessonPrice = (totalPrice: number, lessonCount: number) => {
    return totalPrice / lessonCount;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {packages.map((pkg) => {
        const perLessonPrice = getPerLessonPrice(pkg.total_price, pkg.lesson_count);
        const originalPrice = perLessonPrice * pkg.lesson_count + pkg.savings_amount;
        
        return (
          <Card 
            key={pkg.id} 
            className="relative hover:shadow-lg transition-all duration-300 border-2 hover:border-student/30"
          >
            {pkg.savings_amount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              >
                Save €{pkg.savings_amount.toFixed(2)}
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-lg font-bold text-foreground">
                {pkg.name}
              </CardTitle>
              <CardDescription className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                {pkg.lesson_count} × {pkg.duration_minutes} min lessons
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-student">
                  {formatPrice(pkg.total_price)}
                </div>
                {pkg.savings_amount > 0 && (
                  <div className="text-sm text-muted-foreground line-through">
                    was {formatPrice(originalPrice)}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  {formatPrice(perLessonPrice)} per lesson
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{pkg.duration_minutes} minutes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Lessons:</span>
                  <span className="font-medium">{pkg.lesson_count}</span>
                </div>
                {pkg.savings_amount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">You Save:</span>
                    <span className="font-medium text-green-600">
                      €{pkg.savings_amount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={() => onSelectPackage(pkg.id)}
                className="w-full bg-gradient-to-r from-student to-student-accent hover:from-student-dark hover:to-student text-white"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Purchase Package
              </Button>
              
              <div className="text-xs text-center text-muted-foreground">
                ✅ 6-hour cancellation policy
                <br />
                ✅ Valid for 1 year
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};