import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LessonPackageGrid } from '@/components/pricing/LessonPackageGrid';
import { IndividualLessonCard } from '@/components/pricing/IndividualLessonCard';
import { lessonPricingService } from '@/services/lessonPricingService';
import { LessonPackage } from '@/types/pricing';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Clock, DollarSign, Users } from 'lucide-react';

const NewPricingPage = () => {
  const [packages, setPackages] = useState<LessonPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const data = await lessonPricingService.getAvailablePackages();
      setPackages(data);
    } catch (error) {
      console.error('Error loading packages:', error);
      toast({
        title: "Error Loading Packages",
        description: "Failed to load lesson packages. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPackage = (packageId: string) => {
    // TODO: Implement Stripe payment integration
    toast({
      title: "Package Selected",
      description: "Redirecting to secure payment...",
    });
    console.log('Selected package:', packageId);
  };

  const handleBookIndividualLesson = () => {
    // TODO: Implement individual lesson booking flow
    toast({
      title: "Lesson Selected",
      description: "Proceeding to book 30-minute lesson...",
    });
    console.log('Book individual lesson: 30 minutes');
  };

  return (
    <div className="min-h-screen bg-dashboard-blend">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            English Lesson Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from individual lessons or money-saving packages. All payments are secure and backed by our 6-hour cancellation policy.
          </p>
        </div>

        {/* Policy Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-sm font-medium">Secure Payments</p>
              <p className="text-xs text-muted-foreground">Powered by Stripe</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-sm font-medium">6-Hour Policy</p>
              <p className="text-xs text-muted-foreground">Free cancellation</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-sm font-medium">Quality Teachers</p>
              <p className="text-xs text-muted-foreground">Verified & trained</p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Options */}
        <Tabs defaultValue="packages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Badge variant="secondary">Save Money</Badge>
              Packages
            </TabsTrigger>
            <TabsTrigger value="individual">Individual Lessons</TabsTrigger>
          </TabsList>

          <TabsContent value="packages" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Lesson Packages
              </h2>
              <p className="text-muted-foreground">
                Save money with our discounted lesson packages. Perfect for committed learners!
              </p>
            </div>
            
            <LessonPackageGrid
              packages={packages}
              onSelectPackage={handleSelectPackage}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="individual" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Individual Lessons
              </h2>
              <p className="text-muted-foreground">
                Pay as you go with our flexible individual lesson options.
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <IndividualLessonCard
                duration={30}
                onBookLesson={handleBookIndividualLesson}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Cancellation Policy */}
        <Card className="mt-12 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Booking & Cancellation Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">✅ Valid Cancellations</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Cancellations 6+ hours before lesson</li>
                  <li>• 100% refund processed automatically</li>
                  <li>• Emergency situations considered</li>
                  <li>• Teacher technical issues covered</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">❌ Late Cancellations</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Less than 6 hours before lesson</li>
                  <li>• Full charge applies (no refund)</li>
                  <li>• Teacher no-shows: full refund</li>
                  <li>• Technical failures: full refund</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default NewPricingPage;