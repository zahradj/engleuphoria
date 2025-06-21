
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Play, Clock, Award, Target, BookOpen, CheckCircle, Circle, ArrowRight } from "lucide-react";
import { curriculumPlannerService } from "@/services/curriculumPlannerService";
import { progressTrackingService } from "@/services/progressTrackingService";
import { CurriculumPlan, StudentProfile } from "@/types/curriculum";
import { CURRICULUM_PHASES } from "@/data/curriculumPhases";

interface SystematicLearningPathProps {
  onContentUpdate: () => void;
}

export function SystematicLearningPath({ onContentUpdate }: SystematicLearningPathProps) {
  const [currentPlan, setCurrentPlan] = useState<CurriculumPlan | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadExistingProgress();
  }, []);

  const loadExistingProgress = () => {
    // Mock student profile - in real app this would come from authentication
    const mockProfile: StudentProfile = {
      id: "student_1",
      name: "Sample Student",
      age: 12,
      cefrLevel: "A1",
      strengths: ["visual learning", "games"],
      gaps: ["pronunciation", "grammar"],
      learningStyle: "Visual",
      interests: ["animals", "sports", "music"],
      weeklyMinutes: 180,
      longTermGoal: "Improve English for school",
      parentContact: { email: "parent@example.com" },
      currentXP: 150,
      badges: ["first_lesson", "week_completion"],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setStudentProfile(mockProfile);

    // Check for existing progress
    const existingProgress = progressTrackingService.getStudentProgress(mockProfile.id);
    if (existingProgress) {
      setProgress(existingProgress);
    }
  };

  const generateLearningPath = async () => {
    if (!studentProfile) return;

    setIsGenerating(true);
    try {
      const response = curriculumPlannerService.generateEnhancedCurriculum({
        studentProfile,
        availableResources: [],
        weekCount: 16,
        framework: 'NLEFP'
      });

      if (response.success && response.plan) {
        setCurrentPlan(response.plan);
        
        // Initialize progress tracking
        progressTrackingService.initializeStudentProgress(
          studentProfile.id,
          response.plan.weeks[0],
          CURRICULUM_PHASES[0]
        );

        toast({
          title: "Learning path generated!",
          description: "Your systematic ESL learning journey is ready to begin.",
        });

        onContentUpdate();
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate learning path. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const startWeek = (weekIndex: number) => {
    if (!currentPlan) return;

    const week = currentPlan.weeks[weekIndex];
    toast({
      title: "Week started!",
      description: `Beginning ${week.theme} - Week ${weekIndex + 1}`,
    });

    // Update progress
    if (progress) {
      const updatedProgress = progressTrackingService.completeWeek(
        studentProfile!.id,
        weekIndex,
        week,
        { xpEarned: 200, skillsImproved: ["vocabulary", "grammar"] }
      );
      setProgress(updatedProgress);
    }
  };

  const completeLesson = (weekIndex: number, lessonIndex: number) => {
    if (!currentPlan) return;

    const lesson = currentPlan.weeks[weekIndex].lessons[lessonIndex];
    toast({
      title: "Lesson completed!",
      description: `Earned ${lesson.xpReward} XP for completing the lesson.`,
    });

    // Update progress
    if (progress && studentProfile) {
      const updatedProgress = progressTrackingService.completeLesson(
        studentProfile.id,
        weekIndex,
        lessonIndex,
        { score: 85, timeSpent: 30, skillsAssessed: ["vocabulary"] }
      );
      setProgress(updatedProgress);
    }
  };

  const getWeekProgress = (weekIndex: number) => {
    if (!progress) return 0;
    const completedLessons = progress.completedLessons.filter(
      (l: any) => l.weekIndex === weekIndex
    ).length;
    const totalLessons = currentPlan?.weeks[weekIndex]?.lessons?.length || 1;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const isWeekCompleted = (weekIndex: number) => {
    return getWeekProgress(weekIndex) === 100;
  };

  const isWeekAccessible = (weekIndex: number) => {
    if (weekIndex === 0) return true;
    return isWeekCompleted(weekIndex - 1);
  };

  if (!studentProfile) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Loading Profile</h3>
          <p className="text-gray-500">Setting up your personalized learning path...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target size={20} />
            Systematic Learning Path for {studentProfile.name}
          </CardTitle>
          <p className="text-gray-600">
            Personalized ESL curriculum based on {studentProfile.cefrLevel} level and {studentProfile.learningStyle} learning style
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{studentProfile.cefrLevel}</div>
              <div className="text-sm text-blue-700">Current Level</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{studentProfile.currentXP}</div>
              <div className="text-sm text-green-700">Total XP</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{studentProfile.badges.length}</div>
              <div className="text-sm text-purple-700">Badges Earned</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{studentProfile.weeklyMinutes}</div>
              <div className="text-sm text-orange-700">Weekly Minutes</div>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <Badge variant="outline">Age: {studentProfile.age}</Badge>
            <Badge variant="outline">{studentProfile.learningStyle} Learner</Badge>
            {studentProfile.interests.map((interest) => (
              <Badge key={interest} variant="secondary">{interest}</Badge>
            ))}
          </div>

          {!currentPlan && (
            <Button 
              onClick={generateLearningPath} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? "Generating Path..." : "Generate Systematic Learning Path"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Learning Path */}
      {currentPlan && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Path Overview</TabsTrigger>
            <TabsTrigger value="current-week">Current Week</TabsTrigger>
            <TabsTrigger value="progress">Progress Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-4">
              {currentPlan.weeks.map((week, weekIndex) => (
                <Card 
                  key={weekIndex} 
                  className={`${
                    isWeekCompleted(weekIndex) 
                      ? 'border-green-200 bg-green-50' 
                      : isWeekAccessible(weekIndex)
                      ? 'border-blue-200'
                      : 'border-gray-200 opacity-60'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isWeekCompleted(weekIndex) ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : isWeekAccessible(weekIndex) ? (
                          <Circle className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-400" />
                        )}
                        <div>
                          <CardTitle className="text-lg">
                            Week {weekIndex + 1}: {week.theme}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {week.lessons.length} lessons • {week.isProgressWeek ? 'Progress Assessment Week' : 'Learning Week'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">
                          {getWeekProgress(weekIndex)}% Complete
                        </div>
                        <Progress value={getWeekProgress(weekIndex)} className="w-20 h-2" />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {week.lessons.map((lesson, lessonIndex) => (
                        <div 
                          key={lessonIndex}
                          className="p-3 border rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm line-clamp-2">
                              {lesson.objective}
                            </h4>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {lesson.xpReward} XP
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                            <Clock size={12} />
                            <span>~30 min</span>
                            <Award size={12} />
                            <span>{lesson.xpReward} XP</span>
                          </div>
                          
                          <Button 
                            size="sm" 
                            variant={isWeekAccessible(weekIndex) ? "default" : "outline"}
                            disabled={!isWeekAccessible(weekIndex)}
                            onClick={() => completeLesson(weekIndex, lessonIndex)}
                            className="w-full text-xs"
                          >
                            {isWeekAccessible(weekIndex) ? "Start Lesson" : "Locked"}
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    {isWeekAccessible(weekIndex) && !isWeekCompleted(weekIndex) && (
                      <div className="mt-4 pt-4 border-t">
                        <Button 
                          onClick={() => startWeek(weekIndex)}
                          className="w-full"
                        >
                          <Play size={16} className="mr-2" />
                          Begin Week {weekIndex + 1}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="current-week" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Week Activities</CardTitle>
                <p className="text-gray-600">Focus on systematic skill building with NLP-enhanced learning</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">This Week's Focus</h4>
                    <p className="text-blue-700 text-sm">
                      Master sentence building patterns through visual and kinesthetic learning approaches.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded-lg">
                      <div className="text-lg font-bold text-green-600">2/5</div>
                      <div className="text-sm text-gray-600">Lessons Completed</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-lg font-bold text-blue-600">120</div>
                      <div className="text-sm text-gray-600">XP This Week</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-lg font-bold text-purple-600">65</div>
                      <div className="text-sm text-gray-600">Minutes Studied</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Course Completion</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-xl font-bold text-green-600">4</div>
                        <div className="text-xs text-green-700">Weeks Completed</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-xl font-bold text-blue-600">12</div>
                        <div className="text-xs text-blue-700">Weeks Remaining</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skill Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Vocabulary', 'Grammar', 'Listening', 'Speaking'].map((skill) => (
                      <div key={skill}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{skill}</span>
                          <span>{Math.floor(Math.random() * 40) + 60}%</span>
                        </div>
                        <Progress value={Math.floor(Math.random() * 40) + 60} className="h-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
