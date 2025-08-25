import { K12LessonLibrary } from '@/components/curriculum/K12LessonLibrary';
import { CEFRLessonGenerator } from '@/components/curriculum/CEFRLessonGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Palette } from 'lucide-react';

export default function CurriculumGeneration() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Curriculum Generation</h1>
        <p className="text-muted-foreground">Create engaging ESL lessons with AI-powered tools</p>
      </div>
      
      <Tabs defaultValue="cefr-generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cefr-generator" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            CEFR Interactive Generator
          </TabsTrigger>
          <TabsTrigger value="k12-library" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            K12 Lesson Library
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cefr-generator">
          <CEFRLessonGenerator />
        </TabsContent>
        
        <TabsContent value="k12-library">
          <K12LessonLibrary />
        </TabsContent>
      </Tabs>
    </div>
  );
}