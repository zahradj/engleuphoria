import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, DollarSign } from 'lucide-react';
import { StudentPackagePurchase } from '@/types/pricing';
import { lessonPricingService } from '@/services/lessonPricingService';
import { useToast } from '@/hooks/use-toast';

interface StudentPackagesSectionProps {
  studentId: string;
}

export const StudentPackagesSection: React.FC<StudentPackagesSectionProps> = ({ 
  studentId 
}) => {
  const [packages, setPackages] = useState<StudentPackagePurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStudentPackages();
  }, [studentId]);

  const loadStudentPackages = async () => {
    try {
      const data = await lessonPricingService.getStudentPackages(studentId);
      setPackages(data);
    } catch (error) {
      console.error('Error loading student packages:', error);
      toast({
        title: "Error",
        description: "Failed to load your lesson packages.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            My Lesson Packages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (packages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            My Lesson Packages
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            You don't have any active lesson packages.
          </p>
          <Button 
            onClick={() => window.location.href = '/pricing'}
            className="bg-gradient-to-r from-student to-student-accent hover:from-student-dark hover:to-student text-white"
          >
            Browse Packages
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          My Lesson Packages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {packages.map((pkg) => (
          <div 
            key={pkg.id}
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{pkg.package?.name}</h4>
              <Badge variant={pkg.lessons_remaining > 0 ? "default" : "secondary"}>
                {pkg.lessons_remaining} lessons left
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {pkg.package?.duration_minutes} min each
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  €{pkg.package?.total_price.toFixed(2)} paid
                </span>
              </div>
              <span>
                Purchased {new Date(pkg.purchased_at).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-muted-foreground">Progress: </span>
                <span className="font-medium">
                  {pkg.total_lessons - pkg.lessons_remaining} / {pkg.total_lessons} used
                </span>
              </div>
              
              {pkg.lessons_remaining > 0 && (
                <Button 
                  size="sm"
                  onClick={() => window.location.href = '/book-lesson'}
                  className="bg-gradient-to-r from-student to-student-accent hover:from-student-dark hover:to-student text-white"
                >
                  Book Lesson
                </Button>
              )}
            </div>
            
            {pkg.expires_at && (
              <div className="text-xs text-muted-foreground mt-2">
                Expires: {new Date(pkg.expires_at).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};