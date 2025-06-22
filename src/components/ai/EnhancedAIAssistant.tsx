
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Wifi, WifiOff } from "lucide-react";
import { AIHeader } from "./components/AIHeader";
import { ContentLibraryTab } from "./components/ContentLibraryTab";
import { useUnifiedAIContent } from "@/hooks/useUnifiedAIContent";

export const EnhancedAIAssistant = () => {
  const {
    contentLibrary,
    clearContentLibrary,
    exportContent,
    isDemoMode
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
