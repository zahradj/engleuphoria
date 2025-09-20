
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurriculumUploadSection } from "./CurriculumUploadSection";
import { CurriculumBrowser } from "./CurriculumBrowser";
import { CurriculumCollections } from "./CurriculumCollections";
import { CurriculumAnalytics } from "./CurriculumAnalytics";
import { FeaturedExternalLessons } from "../features/FeaturedExternalLessons";
import { HelloAdventuresMigrator } from "./HelloAdventuresMigrator";
import { Upload, Search, FolderOpen, BarChart3, Sparkles, Download } from "lucide-react";

export function CurriculumLibraryManager() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Curriculum Content Library</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload, organize, and manage all your educational content in one place. 
          Create curriculum collections and track usage analytics.
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload size={16} />
            Upload Content
          </TabsTrigger>
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Search size={16} />
            Browse Library
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Sparkles size={16} />
            Featured Lessons
          </TabsTrigger>
          <TabsTrigger value="migrate" className="flex items-center gap-2">
            <Download size={16} />
            Hello Adventures
          </TabsTrigger>
          <TabsTrigger value="collections" className="flex items-center gap-2">
            <FolderOpen size={16} />
            Collections
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <CurriculumUploadSection onUploadComplete={handleUploadComplete} />
        </TabsContent>

        <TabsContent value="browse" className="mt-6">
          <CurriculumBrowser refreshTrigger={refreshTrigger} />
        </TabsContent>

        <TabsContent value="featured" className="mt-6">
          <FeaturedExternalLessons onImportLesson={handleUploadComplete} />
        </TabsContent>

        <TabsContent value="migrate" className="mt-6">
          <HelloAdventuresMigrator />
        </TabsContent>

        <TabsContent value="collections" className="mt-6">
          <CurriculumCollections refreshTrigger={refreshTrigger} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <CurriculumAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
