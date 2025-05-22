
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { LayoutGrid, Award, BookOpen, Video } from "lucide-react";

// Import tab components
import { LessonTab } from "@/components/classroom/tabs/LessonTab";
import { ActivitiesTab } from "@/components/classroom/tabs/ActivitiesTab";
import { LearningPathTab } from "@/components/classroom/tabs/LearningPathTab";
import { StudentsTab } from "@/components/classroom/tabs/StudentsTab";

// Import mock data
import { 
  quizQuestions, 
  storyScenes, 
  learningPath,
  classStudents 
} from "@/data/classroomData";

// This component handles the content tabs in the classroom
export function ClassroomContent() {
  const { languageText } = useLanguage();
  const [vocabPoints, setVocabPoints] = useState(0);
  
  // Event handlers
  const handleQuizComplete = (score: number, total: number) => {
    const points = score * 10;
    setVocabPoints(prev => prev + points);
    
    // In a real app, we would send this to an API
    console.log(`Quiz completed with score: ${score}/${total}`);
  };
  
  const handleStoryComplete = () => {
    setVocabPoints(prev => prev + 25);
    console.log("Story completed!");
  };
  
  const handleVocabLearned = (newWords: string[]) => {
    const points = newWords.length * 5;
    setVocabPoints(prev => prev + points);
    console.log(`Learned ${newWords.length} new words! +${points} points`);
  };
  
  const handleStartActivity = (milestoneId: string, activityId: string) => {
    console.log(`Starting activity ${activityId} from milestone ${milestoneId}`);
    // In a real app, we would load the activity content
  };
  
  const handleMessageStudent = (studentId: string) => {
    console.log(`Opening message dialog for student ${studentId}`);
    // In a real app, we would open a message dialog
  };
  
  const handleToggleSpotlight = (studentId: string) => {
    console.log(`Toggling spotlight for student ${studentId}`);
    // In a real app, we would feature this student's video
  };

  return (
    <Tabs defaultValue="lesson">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="lesson" className="flex items-center gap-1.5">
          <LayoutGrid size={16} />
          <span>{languageText.lessonContent}</span>
        </TabsTrigger>
        <TabsTrigger value="activities" className="flex items-center gap-1.5">
          <Award size={16} />
          <span>{languageText.activities}</span>
        </TabsTrigger>
        <TabsTrigger value="learning-path" className="flex items-center gap-1.5">
          <BookOpen size={16} />
          <span>{languageText.learningPath}</span>
        </TabsTrigger>
        <TabsTrigger value="students" className="flex items-center gap-1.5">
          <Video size={16} />
          <span>{languageText.students}</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="lesson">
        <LessonTab 
          quizQuestions={quizQuestions} 
          onQuizComplete={handleQuizComplete} 
        />
      </TabsContent>
      
      <TabsContent value="activities">
        <ActivitiesTab 
          storyScenes={storyScenes}
          onStoryComplete={handleStoryComplete}
          onVocabLearned={handleVocabLearned}
        />
      </TabsContent>
      
      <TabsContent value="learning-path">
        <LearningPathTab 
          learningPath={learningPath}
          onStartActivity={handleStartActivity}
        />
      </TabsContent>
      
      <TabsContent value="students">
        <StudentsTab 
          students={classStudents}
          onMessageStudent={handleMessageStudent}
          onToggleSpotlight={handleToggleSpotlight}
        />
      </TabsContent>
    </Tabs>
  );
}
