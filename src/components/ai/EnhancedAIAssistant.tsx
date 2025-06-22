
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Sparkles, Wifi, WifiOff } from "lucide-react";
import { AIHeader } from "./components/AIHeader";
import { ContentGenerationTab } from "./components/ContentGenerationTab";
import { ContentLibraryTab } from "./components/ContentLibraryTab";
import { useUnifiedAIContent } from "@/hooks/useUnifiedAIContent";
import { useToast } from "@/hooks/use-toast";

export const EnhancedAIAssistant = () => {
  const {
    isGenerating,
    contentLibrary,
    generateContent,
    clearContentLibrary,
    exportContent,
    isDemoMode
  } = useUnifiedAIContent();

  const { toast } = useToast();

  const [topic, setTopic] = React.useState("");
  const [level, setLevel] = React.useState("");
  const [duration, setDuration] = React.useState("30");
  const [activeTab, setActiveTab] = React.useState("generate");

  const levels = [
    { value: "beginner", label: "Beginner (A1-A2)" },
    { value: "intermediate", label: "Intermediate (B1-B2)" },
    { value: "advanced", label: "Advanced (C1-C2)" }
  ];

  const handleGenerate = async (type: 'worksheet' | 'activity' | 'lesson_plan' | 'quiz' | 'flashcards') => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your content.",
        variant: "destructive"
      });
      return;
    }

    if (!level) {
      toast({
        title: "Level Required",
        description: "Please select a difficulty level.",
        variant: "destructive"
      });
      return;
    }

    console.log('EnhancedAIAssistant: Starting generation', { type, topic, level, duration });

    try {
      const result = await generateContent({
        type,
        topic: topic.trim(),
        level: level as any,
        duration: parseInt(duration)
      });

      if (result) {
        // Check if this was fallback content
        if (result.metadata?.isFallback) {
          toast({
            title: "⚠️ Content Generated (Offline Mode)",
            description: `Generated sample content for "${topic}". Connect to Supabase for AI-powered generation.`,
            variant: "default"
          });
        } else {
          toast({
            title: "🤖 AI Content Generated!",
            description: `Your ${type.replace('_', ' ')} about "${topic}" is ready to use.`,
          });
        }
        
        setActiveTab("library");
      }
    } catch (error) {
      console.error('EnhancedAIAssistant: Generation failed:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = (content: any) => {
    try {
      exportContent(content);
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export content. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AIHeader />
        {isDemoMode ? (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 flex items-center gap-1">
            <WifiOff size={12} />
            Demo Mode
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 flex items-center gap-1">
            <Wifi size={12} />
            AI Connected
          </Badge>
        )}
      </div>

      {isDemoMode && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Demo mode active. Content generation uses sample data. 
            For AI-powered generation, ensure your OpenAI API key is configured in Supabase Edge Function secrets.
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
