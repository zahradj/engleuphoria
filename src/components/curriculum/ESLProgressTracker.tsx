
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { eslCurriculumService } from "@/services/eslCurriculumService";
import { TrendingUp, Target, Calendar, BookOpen, Award, Star } from "lucide-react";

interface ESLProgressTrackerProps {
  refreshTrigger: number;
}

export function ESLProgressTracker({ refreshTrigger }: ESLProgressTrackerProps) {
  const [selectedStudent, setSelectedStudent] = useState("emma_rodriguez");
  
  const levels = eslCurriculumService.getAllLevels();
  
  // Mock student data
  const studentProgress = {
    emma_rodriguez: {
      name: "Emma Rodriguez",
      currentLevel: "A2",
      totalXP: 1350,
      levelProgress: 54,
      skillProgress: [
        { skill: "Vocabulary", current: 85, target: 100, category: "vocabulary" },
        { skill: "Grammar", current: 72, target: 100, category: "grammar" },
        { skill: "Speaking", current: 68, target: 100, category: "speaking" },
        { skill: "Listening", current: 78, target: 100, category: "listening" },
        { skill: "Reading", current: 81, target: 100, category: "reading" },
        { skill: "Writing", current: 59, target: 100, category: "writing" }
      ],
      recentActivities: [
        { date: "2024-01-25", activity: "Family Vocabulary Worksheet", xp: 25, type: "worksheet" },
        { date: "2024-01-24", activity: "Past Simple Practice", xp: 30, type: "activity" },
        { date: "2024-01-23", activity: "Daily Routines Dialogue", xp: 20, type: "dialogue" },
        { date: "2024-01-22", activity: "Shopping Conversation", xp: 35, type: "speaking" }
      ],
      weeklyGoals: [
        { goal: "Complete 5 vocabulary exercises", progress: 80, completed: 4, total: 5 },
        { goal: "Practice speaking for 30 minutes", progress: 66, completed: 20, total: 30 },
        { goal: "Finish grammar unit", progress: 100, completed: 1, total: 1 }
      ],
      badges: [
        { name: "Vocabulary Master", earned: true, date: "2024-01-20" },
        { name: "Week Warrior", earned: true, date: "2024-01-22" },
        { name: "Grammar Guru", earned: false, progress: 75 }
      ]
    }
  };

  const currentStudent = studentProgress[selectedStudent];

  const getSkillColor = (category: string) => {
    const colors = {
      vocabulary: "bg-blue-500",
      grammar: "bg-green-500", 
      speaking: "bg-purple-500",
      listening: "bg-orange-500",
      reading: "bg-pink-500",
      writing: "bg-indigo-500"
    };
    return colors[category] || "bg-gray-500";
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      worksheet: "📝",
      activity: "🎯", 
      dialogue: "💬",
      speaking: "🗣️",
      listening: "🎧",
      reading: "📖"
    };
    return icons[type] || "📋";
  };

  return (
    <div className="space-y-6">
      {/* Student Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Student Progress Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Select Student:</label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emma_rodriguez">Emma Rodriguez</SelectItem>
                <SelectItem value="alex_chen">Alex Chen</SelectItem>
                <SelectItem value="maria_silva">Maria Silva</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{currentStudent.totalXP}</div>
            <div className="text-sm text-gray-600">Total XP</div>
            <Badge variant="outline" className="mt-2">
              Level {currentStudent.currentLevel}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{currentStudent.levelProgress}%</div>
            <div className="text-sm text-gray-600">Level Progress</div>
            <Progress value={currentStudent.levelProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {currentStudent.badges.filter(b => b.earned).length}
            </div>
            <div className="text-sm text-gray-600">Badges Earned</div>
            <div className="flex justify-center mt-2">
              <Award className="h-5 w-5 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Skills Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentStudent.skillProgress.map((skill) => (
              <div key={skill.skill} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{skill.skill}</span>
                  <span className="text-sm text-gray-500">{skill.current}%</span>
                </div>
                <Progress value={skill.current} className="h-3" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Current: {skill.current}</span>
                  <span>Target: {skill.target}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentStudent.weeklyGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{goal.goal}</span>
                  <Badge variant={goal.progress === 100 ? "default" : "secondary"}>
                    {goal.completed}/{goal.total}
                  </Badge>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentStudent.recentActivities.map((activity, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getActivityIcon(activity.type)}</span>
                    <div>
                      <h5 className="font-medium text-sm">{activity.activity}</h5>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">+{activity.xp} XP</Badge>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badges Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Badge Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentStudent.badges.map((badge, index) => (
              <Card 
                key={index} 
                className={`p-3 ${badge.earned ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {badge.earned ? '🏆' : '🔒'}
                  </div>
                  <h5 className="font-medium text-sm mb-1">{badge.name}</h5>
                  {badge.earned ? (
                    <Badge variant="default" className="text-xs">
                      Earned {badge.date}
                    </Badge>
                  ) : (
                    <div className="space-y-1">
                      <Progress value={badge.progress} className="h-2" />
                      <div className="text-xs text-gray-500">{badge.progress}% complete</div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
