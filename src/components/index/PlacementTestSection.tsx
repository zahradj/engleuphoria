import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Clock, Target, Award } from "lucide-react";

export const PlacementTestSection = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Clock,
      title: "Quick Assessment",
      description: "Complete in just 15-20 minutes"
    },
    {
      icon: Target,
      title: "Accurate Results",
      description: "Get your precise English level"
    },
    {
      icon: Award,
      title: "Personalized Path",
      description: "Custom curriculum based on your level"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-emerald-50/50">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
            Free Assessment
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Find Your Perfect Starting Point
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Take our comprehensive English placement test to discover your current level 
            and receive a personalized learning plan tailored just for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                What You'll Get:
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Your CEFR level (A1-C2)</li>
                <li>• Detailed skill breakdown</li>
                <li>• Personalized study recommendations</li>
                <li>• Custom lesson plan</li>
              </ul>
            </div>
          </div>

          <Card className="bg-card/80 backdrop-blur-sm border-2">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 bg-gradient-to-r from-primary to-secondary p-3 rounded-full w-fit">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Ready to Start?</CardTitle>
              <CardDescription>
                Take the test now and unlock your English learning journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-primary/5 p-3 rounded-lg">
                  <div className="font-bold text-primary">25</div>
                  <div className="text-xs text-muted-foreground">Questions</div>
                </div>
                <div className="bg-secondary/5 p-3 rounded-lg">
                  <div className="font-bold text-secondary">20 min</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => navigate('/placement-test')}
                >
                  Quick Placement Test
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full border-2 border-purple-200 hover:bg-purple-50"
                  onClick={() => navigate('/placement-test-2')}
                >
                  🚀 Full Adventure Test (A1→C2)
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                No registration required • Completely free
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};