
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Wifi } from "lucide-react";
import { AIHeader } from "./components/AIHeader";
import { ContentLibraryTab } from "./components/ContentLibraryTab";
import { useUnifiedAIContent } from "@/hooks/useUnifiedAIContent";

export const EnhancedAIAssistant = () => {
  const {
    contentLibrary,
    clearContentLibrary,
    exportContent
  } = useUnifiedAIContent();

  const handleDownload = (content: any) => {
    try {
      exportContent(content);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AIHeader />
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 flex items-center gap-1">
          <Wifi size={12} />
          AI Assistant
        </Badge>
      </div>

      <Tabs value="library" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="library" className="flex items-center gap-2">
            Content Library ({contentLibrary.length})
          </TabsTrigger>
        </TabsList>

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
