
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, User, ArrowLeft, Home } from "lucide-react";

const SimpleClassroomSelector = () => {
  const navigate = useNavigate();

  const handleSelectClassroom = (mode: string) => {
    navigate(`/classroom?mode=${mode}`);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header with navigation */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Choose Your Classroom</h1>
            <p className="text-muted-foreground">Select the type of learning session you want to join</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Group Classroom */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Group Classes</CardTitle>
                <CardDescription>
                  Join a classroom with multiple students and interact with your peers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li>• Interactive group activities</li>
                  <li>• Collaborative learning</li>
                  <li>• Multiple student participants</li>
                  <li>• Group discussions</li>
                </ul>
                <Button 
                  onClick={() => handleSelectClassroom("group")} 
                  className="w-full"
                >
                  Join Group Class
                </Button>
              </CardContent>
            </Card>

            {/* One-on-One Classroom */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                  <User className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>One-on-One Sessions</CardTitle>
                <CardDescription>
                  Personal learning session with dedicated teacher attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li>• Personalized instruction</li>
                  <li>• Direct teacher feedback</li>
                  <li>• Customized lesson pace</li>
                  <li>• Individual attention</li>
                </ul>
                <Button 
                  onClick={() => handleSelectClassroom("oneOnOne")} 
                  className="w-full"
                  variant="outline"
                >
                  Start One-on-One
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleClassroomSelector;
