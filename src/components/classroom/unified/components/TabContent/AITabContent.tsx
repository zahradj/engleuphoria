import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Book, Library } from "lucide-react";
import { UnifiedAIWorksheetGenerator } from "@/components/classroom/ai/UnifiedAIWorksheetGenerator";
import { DictionaryTabContent } from "./DictionaryTabContent";

interface AITabContentProps {
  currentUser: {
    id: string;
    role: 'teacher' | 'student';
    name: string;
  };
  onInsertToWhiteboard?: (content: string) => void;
}

export function AITabContent({ currentUser, onInsertToWhiteboard }: AITabContentProps) {
  const [activeAITab, setActiveAITab] = useState("generator");

  console.log('AITabContent rendering with user:', currentUser);

  const handleContentGenerated = (content: any) => {
    console.log('AI Content generated:', content);
    // This could integrate with the whiteboard or lesson content
  };

  const handleInsertToWhiteboard = (content: string) => {
    if (onInsertToWhiteboard) {
      onInsertToWhiteboard(content);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeAITab} onValueChange={setActiveAITab} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Brain size={16} />
            <span className="hidden sm:inline">AI Generator</span>
          </TabsTrigger>
          <TabsTrigger value="dictionary" className="flex items-center gap-2">
            <Book size={16} />
            <span className="hidden sm:inline">Dictionary</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Library size={16} />
            <span className="hidden sm:inline">Content Library</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-0">
          <TabsContent value="generator" className="h-full m-0">
            <UnifiedAIWorksheetGenerator
              onContentGenerated={handleContentGenerated}
              onInsertToWhiteboard={handleInsertToWhiteboard}
            />
          </TabsContent>

          <TabsContent value="dictionary" className="h-full m-0 p-4">
            <DictionaryTabContent />
          </TabsContent>

          <TabsContent value="library" className="h-full m-0 p-4">
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Library size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Content Library</h3>
                <p className="text-sm">
                  Generated AI content and saved materials will appear here
                </p>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}