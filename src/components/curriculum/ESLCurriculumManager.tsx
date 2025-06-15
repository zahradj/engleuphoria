
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ESLLevelBrowser } from "./ESLLevelBrowser";
import { ESLAIGenerator } from "./ESLAIGenerator";
import { ESLGamificationDashboard } from "./ESLGamificationDashboard";
import { ESLMaterialUpload } from "./ESLMaterialUpload";
import { ESLProgressTracker } from "./ESLProgressTracker";
import { BookOpen, Sparkles, Trophy, Upload, TrendingUp, Target } from "lucide-react";

export function ESLCurriculumManager() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleContentUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">ESL Curriculum Library</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Comprehensive English as a Second Language curriculum with CEFR levels, 
          gamification features, and AI-powered content generation.
        </p>
      </div>

      <Tabs defaultValue="levels" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="levels" className="flex items-center gap-2">
            <BookOpen size={16} />
            CEFR Levels
          </TabsTrigger>
          <TabsTrigger value="ai-generator" className="flex items-center gap-2">
            <Sparkles size={16} />
            AI Generator
          </TabsTrigger>
          <TabsTrigger value="gamification" className="flex items-center gap-2">
            <Trophy size={16} />
            Gamification
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload size={16} />
            Upload Materials
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp size={16} />
            Progress Tracking
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="flex items-center gap-2">
            <Target size={16} />
            Learning Paths
          </TabsTrigger>
        </TabsList>

        <TabsContent value="levels" className="mt-6">
          <ESLLevelBrowser refreshTrigger={refreshTrigger} />
        </TabsContent>

        <TabsContent value="ai-generator" className="mt-6">
          <ESLAIGenerator onContentGenerated={handleContentUpdate} />
        </TabsContent>

        <TabsContent value="gamification" className="mt-6">
          <ESLGamificationDashboard refreshTrigger={refreshTrigger} />
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <ESLMaterialUpload onUploadComplete={handleContentUpdate} />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <ESLProgressTracker refreshTrigger={refreshTrigger} />
        </TabsContent>

        <TabsContent value="roadmap" className="mt-6">
          <div className="p-8 text-center">
            <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">Learning Paths</h3>
            <p className="text-gray-600">Personalized learning roadmaps coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
