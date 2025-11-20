import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Library, TrendingUp, Calendar } from 'lucide-react';
import { CurriculumGenerator } from './CurriculumGenerator';
import { MaterialLibrary } from './MaterialLibrary';
import { ProgressionGuide } from './ProgressionGuide';

export const CurriculumExpertDashboard = () => {
  const [activeTab, setActiveTab] = useState('generator');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Curriculum Expert</h1>
        <p className="text-muted-foreground mt-2">
          AI-powered curriculum generation for ages 5-17 (Pre-A1 to B2)
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Generator</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Library className="h-4 w-4" />
            <span>Library</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Progression</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-6">
          <CurriculumGenerator />
        </TabsContent>

        <TabsContent value="library" className="mt-6">
          <MaterialLibrary />
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <ProgressionGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
};