
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Brain, 
  Upload, 
  Users, 
  TrendingUp, 
  BookOpen, 
  Sparkles,
  Eye,
  Ear,
  Hand,
  Target,
  Clock,
  Award
} from 'lucide-react';
import { useClassroomAuth } from '@/hooks/useClassroomAuth';
import { NLPDashboardStats } from '@/components/teacher/nlp/NLPDashboardStats';
import { MaterialLibraryIntegrated } from '@/components/teacher/nlp/MaterialLibraryIntegrated';
import { LearningPathVisualizer } from '@/components/teacher/nlp/LearningPathVisualizer';
import { StudentAnalytics } from '@/components/teacher/nlp/StudentAnalytics';
import { AILessonRecommendations } from '@/components/teacher/nlp/AILessonRecommendations';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const EnhancedTeacherDashboard = () => {
  const { user } = useClassroomAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activePhase, setActivePhase] = useState(1);
  const [selectedLearningStyle, setSelectedLearningStyle] = useState<'visual' | 'auditory' | 'kinesthetic'>('visual');

  const nlpPhases = [
    {
      id: 1,
      name: "Foundation Building",
      description: "Sentence Construction Mastery",
      color: "from-blue-500 to-cyan-500",
      icon: Target,
      duration: "4 weeks",
      focus: "Basic anchoring & confidence building"
    },
    {
      id: 2,
      name: "Pattern Recognition", 
      description: "Grammar Patterns as Building Blocks",
      color: "from-purple-500 to-pink-500",
      icon: Brain,
      duration: "4 weeks",
      focus: "Pattern anchoring & systematic thinking"
    },
    {
      id: 3,
      name: "Contextual Application",
      description: "Theme-Based Communication", 
      color: "from-green-500 to-emerald-500",
      icon: Users,
      duration: "8 weeks",
      focus: "Context anchoring & real-world connections"
    },
    {
      id: 4,
      name: "Advanced Integration",
      description: "Complex Communication",
      color: "from-orange-500 to-red-500", 
      icon: Award,
      duration: "8 weeks",
      focus: "Fluency anchoring & confident expression"
    }
  ];

  const learningStyles = [
    { 
      type: 'visual' as const, 
      icon: Eye, 
      name: 'Visual Learners',
      color: 'bg-blue-100 text-blue-800',
      description: 'Charts, diagrams, color-coding'
    },
    { 
      type: 'auditory' as const, 
      icon: Ear, 
      name: 'Auditory Learners',
      color: 'bg-green-100 text-green-800',
      description: 'Sound patterns, rhythm, verbal repetition'
    },
    { 
      type: 'kinesthetic' as const, 
      icon: Hand, 
      name: 'Kinesthetic Learners',
      color: 'bg-purple-100 text-purple-800',
      description: 'Movement-based, hands-on activities'
    }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="bg-white/20 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {user.full_name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      Welcome, {user.full_name}! 🌟
                    </h1>
                    <p className="text-gray-600 text-lg">
                      Transform minds with NLP-powered English learning
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        <Sparkles size={12} className="mr-1" />
                        NLP Enhanced
                      </Badge>
                      <Badge variant="outline" className="border-green-300 text-green-700">
                        Active Teacher
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => navigate('/classroom')}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Start Live Lesson
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* NLP Framework Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Brain className="text-purple-500" />
              NLP Learning Framework
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {nlpPhases.map((phase) => (
                <Card 
                  key={phase.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                    activePhase === phase.id 
                      ? 'ring-2 ring-blue-500 shadow-xl' 
                      : 'hover:shadow-lg'
                  } bg-white/80 backdrop-blur-sm border-white/20`}
                  onClick={() => setActivePhase(phase.id)}
                >
                  <CardContent className="p-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${phase.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                      <phase.icon className="text-white" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">{phase.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock size={12} />
                      {phase.duration}
                    </div>
                    <p className="text-xs text-purple-600 mt-2 font-medium">{phase.focus}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Learning Styles Selector */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Learning Modalities (VAK)</h3>
            <div className="flex gap-4">
              {learningStyles.map((style) => (
                <Button
                  key={style.type}
                  variant={selectedLearningStyle === style.type ? "default" : "outline"}
                  onClick={() => setSelectedLearningStyle(style.type)}
                  className={`flex items-center gap-2 ${
                    selectedLearningStyle === style.type 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <style.icon size={16} />
                  {style.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Main Dashboard Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-14 bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 rounded-xl p-1">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all"
              >
                <BarChart3 size={16} />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="materials"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all"
              >
                <Upload size={16} />
                Materials
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all"
              >
                <TrendingUp size={16} />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="students"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all"
              >
                <Users size={16} />
                Students
              </TabsTrigger>
              <TabsTrigger 
                value="recommendations"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all"
              >
                <Sparkles size={16} />
                AI Insights
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="overview" className="animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <NLPDashboardStats activePhase={activePhase} learningStyle={selectedLearningStyle} />
                  </div>
                  <div>
                    <LearningPathVisualizer activePhase={activePhase} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="materials" className="animate-fade-in">
                <MaterialLibraryIntegrated learningStyle={selectedLearningStyle} activePhase={activePhase} />
              </TabsContent>

              <TabsContent value="analytics" className="animate-fade-in">
                <StudentAnalytics activePhase={activePhase} learningStyle={selectedLearningStyle} />
              </TabsContent>

              <TabsContent value="students" className="animate-fade-in">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Student Management (Coming Soon)</h3>
                  <p className="text-gray-600">Advanced student tracking with NLP progress analysis</p>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="animate-fade-in">
                <AILessonRecommendations activePhase={activePhase} learningStyle={selectedLearningStyle} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
