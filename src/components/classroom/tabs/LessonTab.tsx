
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { QuizContainer } from "@/components/assessment/QuizContainer";
import { PlayCircle, MessageCircle, Book } from "lucide-react";

interface LessonTabProps {
  quizQuestions: any[];
  onQuizComplete: (score: number, total: number) => void;
}

export function LessonTab({ quizQuestions, onQuizComplete }: LessonTabProps) {
  const { languageText } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-bold mb-2">Animal Sounds</h2>
          <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            <div className="text-center">
              <PlayCircle className="mx-auto h-12 w-12 text-muted-foreground/60 mb-2" />
              <p className="text-muted-foreground">{languageText.clickToPlayVideo}</p>
              <Button className="mt-2">{languageText.play}</Button>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button variant="outline" className="flex items-center gap-2">
              <MessageCircle size={16} />
              {languageText.chat}
            </Button>
            <Button className="flex items-center gap-2">
              <Book size={16} />
              {languageText.resources}
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Animal Sounds Quiz</h2>
          <QuizContainer 
            title={languageText.animalSoundsQuiz} 
            description={languageText.matchAnimalsWithSounds}
            questions={quizQuestions}
            onComplete={onQuizComplete}
          />
        </div>
      </div>
    </div>
  );
}
