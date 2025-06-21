
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Sparkles } from "lucide-react";
import { AIHeader } from "./components/AIHeader";
import { ContentGenerationTab } from "./components/ContentGenerationTab";
import { ContentLibraryTab } from "./components/ContentLibraryTab";
import { useUnifiedAIContent } from "@/hooks/useUnifiedAIContent";

export const EnhancedAIAssistant = () => {
  const {
    isGenerating,
    contentLibrary,
    generateContent,
    clearContentLibrary,
    exportContent,
    isDemoMode
  } = useUnifiedAIContent();

  const [topic, setTopic] = React.useState("");
  const [level, setLevel] = React.useState("");
  const [duration, setDuration] = React.useState("30");
  const [activeTab, setActiveTab] = React.useState("generate");

  const levels = [
    { value: "beginner", label: "Beginner (A1-A2)" },
    { value: "intermediate", label: "Intermediate (B1-B2)" },
    { value: "advanced", label: "Advanced (C1-C2)" }
  ];

  const handleGenerate = async (type: 'worksheet' | 'activity' | 'lesson_plan') => {
    if (!topic || !level) {
      return;
    }

    await generateContent({
      type,
      topic,
      level: level as any,
      duration: parseInt(duration)
    });

    setActiveTab("library");
  };

  const handleDownload = (content: any) => {
    exportContent(content);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AIHeader />
        {isDemoMode && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            Demo Mode
          </Badge>
        )}
      </div>

      {isDemoMode && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            You're in demo mode. Content generation uses enhanced mock data. 
            Connect to Supabase for real AI-powered generation.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Sparkles size={16} />
            Generate Content
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            Content Library ({contentLibrary.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <ContentGenerationTab
            topic={topic}
            setTopic={setTopic}
            level={level}
            setLevel={setLevel}
            duration={duration}
            setDuration={setDuration}
            levels={levels}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
          />
        </TabsContent>

        <TabsContent value="library">
          <ContentLibraryTab
            generatedContent={contentLibrary}
            onClearContent={clearContentLibrary}
            onDownload={handleDownload}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
