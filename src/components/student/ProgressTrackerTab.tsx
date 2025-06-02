
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Target, BarChart3 } from "lucide-react";

export const ProgressTrackerTab = () => {
  const skillProgress = [
    { skill: "Listening", progress: 75, color: "bg-blue-500" },
    { skill: "Speaking", progress: 60, color: "bg-green-500" },
    { skill: "Reading", progress: 85, color: "bg-purple-500" },
    { skill: "Writing", progress: 50, color: "bg-orange-500" }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Progress Tracker</h1>
      
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Overall Progress - Level A2
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Course Completion</span>
                <span className="text-sm text-gray-500">68%</span>
              </div>
              <Progress value={68} className="h-3" />
            </div>
            <p className="text-sm text-gray-600">
              You're making excellent progress! Keep up the great work.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Skills Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
            Skills Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {skillProgress.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{skill.skill}</span>
                  <span className="text-sm text-gray-500">{skill.progress}%</span>
                </div>
                <Progress value={skill.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: "First Week!", icon: "🎯", date: "Dec 1" },
              { title: "Grammar Master", icon: "📚", date: "Dec 3" },
              { title: "Conversation Star", icon: "💬", date: "Dec 5" }
            ].map((achievement, index) => (
              <div key={index} className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200 text-center">
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <p className="font-medium text-gray-800">{achievement.title}</p>
                <p className="text-xs text-gray-500">{achievement.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
