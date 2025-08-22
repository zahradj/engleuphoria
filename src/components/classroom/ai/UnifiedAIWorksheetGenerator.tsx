
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Library, BookOpen } from "lucide-react";
import { useUnifiedAIContent } from "@/hooks/useUnifiedAIContent";
import { AIContentRequest } from "@/services/unifiedAIContentService";
import { unifiedAIContentService } from "@/services/unifiedAIContentService";
import { AIGeneratorHeader } from "./components/AIGeneratorHeader";
import { ProgressTracker } from "./components/ProgressTracker";
import { GenerationForm } from "./components/GenerationForm";
import { ContentLibraryTab } from "./components/ContentLibraryTab";
import { CurriculumGenerationPanel } from "./CurriculumGenerationPanel";

interface UnifiedAIWorksheetGeneratorProps {
  onContentGenerated?: (content: any) => void;
  onInsertToWhiteboard?: (content: string) => void;
}

export function UnifiedAIWorksheetGenerator({ 
  onContentGenerated, 
  onInsertToWhiteboard 
}: UnifiedAIWorksheetGeneratorProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'library' | 'curriculum'>('generate');
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [contentType, setContentType] = useState<'worksheet' | 'activity' | 'lesson_plan' | 'quiz' | 'flashcards'>('worksheet');
  const [duration, setDuration] = useState('30');
  const [specificRequirements, setSpecificRequirements] = useState('');
  const [learningObjectives, setLearningObjectives] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState('');
  
  // Progress tracking states
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const {
    isGenerating,
    contentLibrary,
    generateContent,
    clearContentLibrary,
    exportContent,
    isProduction
  } = useUnifiedAIContent();

  // Timer for elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 100);
      }, 100);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Progress simulation
  useEffect(() => {
    if (isGenerating) {
      const steps = [
        { step: 'Analyzing requirements...', progress: 20 },
        { step: 'Optimizing content structure...', progress: 40 },
        { step: 'Generating content...', progress: 70 },
        { step: 'Finalizing and formatting...', progress: 90 },
        { step: 'Complete!', progress: 100 }
      ];

      let currentIndex = 0;
      const updateProgress = () => {
        if (currentIndex < steps.length && isGenerating) {
          setGenerationStep(steps[currentIndex].step);
          setGenerationProgress(steps[currentIndex].progress);
          currentIndex++;
          
          if (currentIndex < steps.length) {
            setTimeout(updateProgress, estimatedTime / steps.length);
          }
        }
      };

      updateProgress();
    } else {
      setGenerationProgress(0);
      setGenerationStep('');
    }
  }, [isGenerating, estimatedTime]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    console.log('🚀 Starting comprehensive content generation with ChatGPT:', {
      type: contentType,
      topic: topic.trim(),
      level,
      duration: parseInt(duration),
      specificRequirements,
      learningObjectives
    });

    // Set estimated time
    const estimated = unifiedAIContentService.getEstimatedGenerationTime(contentType);
    setEstimatedTime(estimated);

    const request: AIContentRequest = {
      type: contentType,
      topic: topic.trim(),
      level,
      duration: parseInt(duration),
      specificRequirements: specificRequirements || undefined,
      learningObjectives: learningObjectives.length > 0 ? learningObjectives : undefined
    };

    try {
      const result = await generateContent(request);
      console.log('✅ Comprehensive content generated:', {
        hasWorksheet: !!result.worksheet,
        hasActivities: !!result.activities,
        hasVocabulary: !!result.vocabulary && result.vocabulary.length > 0,
        hasSlides: !!result.slides && result.slides.length > 0
      });
      
      if (result && onContentGenerated) {
        onContentGenerated(result);
      }

      setActiveTab('library');
    } catch (error) {
      console.error('❌ Content generation failed:', error);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const insertToWhiteboard = (content: string) => {
    if (onInsertToWhiteboard) {
      onInsertToWhiteboard(content);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden">
      <AIGeneratorHeader />

      <ProgressTracker
        isGenerating={isGenerating}
        generationStep={generationStep}
        generationProgress={generationProgress}
        elapsedTime={elapsedTime}
      />

      {/* Tabs */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="px-4 pt-4 flex-shrink-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate" onClick={() => setActiveTab('generate')} className="flex items-center gap-2">
              <Sparkles size={16} />
              Generate
            </TabsTrigger>
            <TabsTrigger value="curriculum" onClick={() => setActiveTab('curriculum')} className="flex items-center gap-2">
              <BookOpen size={16} />
              A-Z Curriculum
            </TabsTrigger>
            <TabsTrigger value="library" onClick={() => setActiveTab('library')} className="flex items-center gap-2">
              <Library size={16} />
              Library ({contentLibrary.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {activeTab === 'generate' && (
            <GenerationForm
              topic={topic}
              setTopic={setTopic}
              level={level}
              setLevel={setLevel}
              contentType={contentType}
              setContentType={setContentType}
              duration={duration}
              setDuration={setDuration}
              specificRequirements={specificRequirements}
              setSpecificRequirements={setSpecificRequirements}
              learningObjectives={learningObjectives}
              setLearningObjectives={setLearningObjectives}
              newObjective={newObjective}
              setNewObjective={setNewObjective}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />
          )}

          {activeTab === 'curriculum' && (
            <div className="p-4">
              <CurriculumGenerationPanel 
                onCurriculumGenerated={(curriculum) => {
                  console.log('Curriculum generated:', curriculum);
                  if (onContentGenerated) {
                    onContentGenerated(curriculum);
                  }
                }}
              />
            </div>
          )}

          {activeTab === 'library' && (
            <ContentLibraryTab
              contentLibrary={contentLibrary}
              onClearLibrary={clearContentLibrary}
              onCopyToClipboard={copyToClipboard}
              onInsertToWhiteboard={insertToWhiteboard}
              onExportContent={exportContent}
            />
          )}
        </div>
      </div>
    </div>
  );
}
