
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Layers, TrendingUp, Settings, Sparkles } from "lucide-react";
import { ESLLevelBrowser } from "./ESLLevelBrowser";
import { SystematicLearningPath } from "./SystematicLearningPath";
import { CurriculumAnalytics } from "../teacher/curriculum/CurriculumAnalytics";
import { AIContentGenerator } from "./AIContentGenerator";
import { InteractiveLessonsLibrary } from "./InteractiveLessonsLibrary";

export function ESLCurriculumManager() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleContentUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Enhanced ESL Curriculum Framework
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
          A comprehensive 8-level systematic program designed for age-appropriate ESL learning, 
          from Pre-A1 (Young Learners) to B2 (Advanced Teens). Features systematic progression, 
          AI-powered content generation, and comprehensive progress tracking.
        </p>
        
        <div className="flex justify-center gap-3 mb-8">
          <Badge variant="secondary" className="px-4 py-2">
            <BookOpen size={16} className="mr-2" />
            8 CEFR Levels
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <Layers size={16} className="mr-2" />
            Age-Appropriate Content
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <TrendingUp size={16} className="mr-2" />
            Systematic Progression
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <Sparkles size={16} className="mr-2" />
            AI-Enhanced Learning
          </Badge>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="lessons" className="flex items-center gap-2">
            <BookOpen size={16} />
            Interactive Lessons
          </TabsTrigger>
          <TabsTrigger value="levels" className="flex items-center gap-2">
            <Layers size={16} />
            Curriculum Levels
          </TabsTrigger>
          <TabsTrigger value="learning-paths" className="flex items-center gap-2">
            <Layers size={16} />
            Learning Paths
          </TabsTrigger>
          <TabsTrigger value="ai-content" className="flex items-center gap-2">
            <Sparkles size={16} />
            AI Content Generator
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp size={16} />
            Analytics
          </TabsTrigger>
        </TabsList>

          <TabsContent value="lessons" className="mt-6">
            <InteractiveLessonsLibrary />
          </TabsContent>

          <TabsContent value="levels" className="mt-6">
            <ESLLevelBrowser refreshTrigger={refreshTrigger} />
          </TabsContent>

        <TabsContent value="learning-paths" className="mt-6">
          <SystematicLearningPath onContentUpdate={handleContentUpdate} />
        </TabsContent>

        <TabsContent value="ai-content" className="mt-6">
          <AIContentGenerator onContentGenerated={handleContentUpdate} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <CurriculumAnalytics />
        </TabsContent>
      </Tabs>

      {/* Framework Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            Framework Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Systematic Progression</h3>
              <p className="text-sm text-gray-600">
                Carefully structured 8-level progression from beginner to advanced
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Layers className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Age-Appropriate</h3>
              <p className="text-sm text-gray-600">
                Content tailored for different age groups from 4 to 17+ years
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">AI-Enhanced</h3>
              <p className="text-sm text-gray-600">
                AI-powered content generation and adaptive learning paths
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Progress Tracking</h3>
              <p className="text-sm text-gray-600">
                Comprehensive analytics and progress monitoring tools
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
