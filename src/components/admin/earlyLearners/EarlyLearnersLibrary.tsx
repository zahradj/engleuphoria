import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LessonList } from './LessonList';
import { LessonGenerator } from './LessonGenerator';
import { AssetLibrary } from './AssetLibrary';
import { Baby, Sparkles, ImageIcon } from 'lucide-react';

export function EarlyLearnersLibrary() {
  const [activeTab, setActiveTab] = useState('lessons');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-pink-400 flex items-center justify-center">
          <Baby className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Early Learners Library</h2>
          <p className="text-muted-foreground">Foundation Level • Ages 5-7 • Interactive ESL Lessons</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="lessons" className="flex items-center gap-2">
            <Baby className="h-4 w-4" />
            Lessons
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Assets
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="lessons" className="mt-6">
          <LessonList />
        </TabsContent>
        
        <TabsContent value="generate" className="mt-6">
          <LessonGenerator />
        </TabsContent>
        
        <TabsContent value="assets" className="mt-6">
          <AssetLibrary />
        </TabsContent>
      </Tabs>
    </div>
  );
}
