
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Calendar, 
  Clock, 
  Star, 
  BookOpen, 
  Play, 
  CheckCircle,
  Trophy,
  Rocket,
  Heart,
  Zap
} from "lucide-react";

interface WeekPlan {
  week: number;
  theme: string;
  objective: string;
  xpTarget: number;
  lessons: {
    title: string;
    duration: string;
    skills: string[];
    completed: boolean;
  }[];
  activities: string[];
  completed: boolean;
}

export const LearningPathTab = () => {
  const [profile, setProfile] = useState<any>(null);
  const [learningPath, setLearningPath] = useState<WeekPlan[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);

  useEffect(() => {
    // Load student profile from localStorage
    const savedProfile = localStorage.getItem('studentProfile');
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      setProfile(profileData);
      generateLearningPath(profileData);
    }
  }, []);

  const generateLearningPath = (profileData: any) => {
    // Generate personalized learning path based on profile
    const themes = getPersonalizedThemes(profileData);
    const path: WeekPlan[] = themes.map((theme, index) => ({
      week: index + 1,
      theme: theme.title,
      objective: theme.objective,
      xpTarget: 150,
      lessons: [
        {
          title: `${theme.title}: Introduction`,
          duration: "25 min",
          skills: ["Vocabulary", "Listening"],
          completed: index === 0
        },
        {
          title: `${theme.title}: Practice`,
          duration: "25 min", 
          skills: ["Speaking", "Grammar"],
          completed: false
        }
      ],
      activities: theme.activities,
      completed: index === 0
    }));
    
    setLearningPath(path);
  };

  const getPersonalizedThemes = (profileData: any) => {
    const interests = profileData.interests || [];
    const level = profileData.englishLevel;
    const goals = profileData.goals || [];
    
    // Base themes that adapt to interests
    const baseThemes = [
      {
        title: "All About Me",
        objective: "Introduce yourself confidently",
        activities: ["Create your avatar", "Record introduction video", "Family tree project"]
      },
      {
        title: interests.includes('Animals & Nature') ? "Amazing Animals" : "My World",
        objective: "Describe things you love",
        activities: interests.includes('Animals & Nature') 
          ? ["Animal habitat game", "Pet care guide", "Zoo virtual tour"]
          : ["Hobby presentation", "Dream job interview", "Cultural exchange"]
      },
      {
        title: interests.includes('Food & Cooking') ? "Delicious Foods" : "Daily Life",
        objective: "Talk about daily activities",
        activities: interests.includes('Food & Cooking')
          ? ["Recipe creation", "Restaurant role-play", "Food from around the world"]
          : ["Daily routine video", "Time management game", "Schedule planner"]
      },
      {
        title: interests.includes('Space & Science') ? "Space Adventure" : "Future Dreams",
        objective: "Express future plans and dreams",
        activities: interests.includes('Space & Science')
          ? ["Planet exploration", "Astronaut training", "Space mission planning"]
          : ["Dream board creation", "Goal setting workshop", "Future timeline"]
      },
      {
        title: interests.includes('Adventure & Travel') ? "World Explorer" : "Community Heroes",
        objective: "Describe places and people",
        activities: interests.includes('Adventure & Travel')
          ? ["Virtual world tour", "Travel blog", "Adventure story writing"]
          : ["Community helpers interview", "Local heroes presentation", "Neighborhood map"]
      },
      {
        title: "Celebration Time",
        objective: "Share experiences and stories",
        activities: ["Festival around the world", "Memory sharing", "Achievement celebration"]
      }
    ];

    return baseThemes.slice(0, 6); // 6-week program
  };

  const getTotalProgress = () => {
    const completedWeeks = learningPath.filter(week => week.completed).length;
    return (completedWeeks / learningPath.length) * 100;
  };

  const getTotalXP = () => {
    return learningPath.filter(week => week.completed).reduce((total, week) => total + week.xpTarget, 0);
  };

  if (!profile) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-12">
            <Rocket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Complete Your Profile First!
            </h3>
            <p className="text-gray-600 mb-4">
              To see your personalized learning path, please complete your student application form.
            </p>
            <Button 
              onClick={() => window.location.href = '/student-application'}
              className="bg-gradient-to-r from-emerald-600 to-blue-600"
            >
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-6 w-6 text-emerald-600" />
            Your Path to Fluency
          </h1>
          <p className="text-gray-600 mt-1">
            Personalized just for you, {profile.basicInfo.name}! 🌟
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-600">{getTotalXP()} XP</div>
          <div className="text-sm text-gray-500">Total Earned</div>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Your Progress Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(getTotalProgress())}% Complete</span>
            </div>
            <Progress value={getTotalProgress()} className="h-3" />
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600">
                  {learningPath.filter(w => w.completed).length}
                </div>
                <div className="text-xs text-gray-500">Weeks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {currentWeek}
                </div>
                <div className="text-xs text-gray-500">Current Week</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {learningPath.length - learningPath.filter(w => w.completed).length}
                </div>
                <div className="text-xs text-gray-500">Weeks Remaining</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Path Timeline */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Your 6-Week Learning Journey
        </h2>
        
        {learningPath.map((week, index) => (
          <Card key={week.week} className={`
            ${week.week === currentWeek ? 'ring-2 ring-emerald-500 bg-emerald-50/50' : ''}
            ${week.completed ? 'bg-green-50/50' : ''}
            transition-all duration-200 hover:shadow-md
          `}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                    ${week.completed ? 'bg-green-500' : week.week === currentWeek ? 'bg-emerald-500' : 'bg-gray-400'}
                  `}>
                    {week.completed ? <CheckCircle className="h-5 w-5" /> : week.week}
                  </div>
                  <div>
                    <div className="text-lg">Week {week.week}: {week.theme}</div>
                    <div className="text-sm text-gray-600 font-normal">{week.objective}</div>
                  </div>
                </CardTitle>
                
                <div className="flex items-center gap-2">
                  {week.week === currentWeek && (
                    <Badge variant="default" className="bg-emerald-600">
                      Current Week
                    </Badge>
                  )}
                  {week.completed && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      ✓ Completed
                    </Badge>
                  )}
                  <div className="text-right">
                    <div className="text-sm font-medium">{week.xpTarget} XP</div>
                    <div className="text-xs text-gray-500">Target</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Lessons */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Lessons
                  </h4>
                  <div className="space-y-2">
                    {week.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center
                            ${lesson.completed ? 'bg-green-500 text-white' : 'bg-gray-200'}
                          `}>
                            {lesson.completed ? <CheckCircle className="h-3 w-3" /> : lessonIndex + 1}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{lesson.title}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {lesson.duration}
                              <span>•</span>
                              {lesson.skills.join(", ")}
                            </div>
                          </div>
                        </div>
                        
                        {week.week === currentWeek && !lesson.completed && (
                          <Button size="sm" variant="outline">
                            <Play className="h-3 w-3 mr-1" />
                            Start
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Fun Activities */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    Fun Activities
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {week.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="text-sm bg-white p-2 rounded border text-center">
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Motivational Footer */}
      <Card className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
        <CardContent className="text-center py-6">
          <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
          <h3 className="text-lg font-bold mb-2">You're Doing Amazing!</h3>
          <p className="text-emerald-100">
            Keep going, {profile.basicInfo.name}! Every lesson brings you closer to English fluency. 🚀
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
