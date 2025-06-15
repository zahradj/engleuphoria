
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIHeader } from "./components/AIHeader";
import { ContentGenerationTab } from "./components/ContentGenerationTab";
import { ContentLibraryTab } from "./components/ContentLibraryTab";
import { useAIAssistant } from "./hooks/useAIAssistant";

export const EnhancedAIAssistant = () => {
  const {
    topic,
    setTopic,
    level,
    setLevel,
    duration,
    setDuration,
    activeTab,
    setActiveTab,
    levels,
    isGenerating,
    generatedContent,
    handleGenerate,
    clearContent
  } = useAIAssistant();

  const handleDownload = (content: any) => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${content.title}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <AIHeader />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate Content</TabsTrigger>
          <TabsTrigger value="library">Content Library ({generatedContent.length})</TabsTrigger>
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
            generatedContent={generatedContent}
            onClearContent={clearContent}
            onDownload={handleDownload}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
