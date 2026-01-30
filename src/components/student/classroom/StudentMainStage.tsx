import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CollaborativeCanvas } from '@/components/classroom/shared/CollaborativeCanvas';
import { StudentQuizView } from './StudentQuizView';
import { StudentPollView } from './StudentPollView';
import { WhiteboardStroke } from '@/services/whiteboardService';
import { Eye, PenLine, Monitor, ExternalLink } from 'lucide-react';

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface PollOption {
  id: string;
  text: string;
}

interface Slide {
  id: string;
  title: string;
  content?: React.ReactNode;
  imageUrl?: string;
  type?: string;
  quizQuestion?: string;
  quizOptions?: QuizOption[];
  pollQuestion?: string;
  pollOptions?: PollOption[];
}

interface StudentMainStageProps {
  slides: Slide[];
  currentSlideIndex: number;
  studentCanDraw: boolean;
  activeTool: string;
  activeColor: string;
  strokes: WhiteboardStroke[];
  roomId: string;
  userId: string;
  userName: string;
  sessionId?: string;
  quizActive: boolean;
  quizLocked: boolean;
  quizRevealAnswer: boolean;
  pollActive: boolean;
  pollShowResults: boolean;
  // Shared display state
  embeddedUrl: string | null;
  isScreenSharing: boolean;
  onAddStroke: (stroke: Omit<WhiteboardStroke, 'id' | 'roomId' | 'timestamp'>) => void;
}

export const StudentMainStage: React.FC<StudentMainStageProps> = ({
  slides,
  currentSlideIndex,
  studentCanDraw,
  activeTool,
  activeColor,
  strokes,
  roomId,
  userId,
  userName,
  sessionId,
  quizActive,
  quizLocked,
  quizRevealAnswer,
  pollActive,
  pollShowResults,
  embeddedUrl,
  isScreenSharing,
  onAddStroke
}) => {
  const currentSlide = slides[currentSlideIndex];
  const isQuizSlide = currentSlide?.type === 'quiz';
  const isPollSlide = currentSlide?.type === 'poll';

  // Show screen share if teacher is sharing
  if (isScreenSharing) {
    return (
      <div className="flex-1 flex flex-col bg-gray-950 relative overflow-hidden">
        {/* Screen Sharing Indicator */}
        <div className="absolute top-4 left-4 z-20">
          <Badge className="bg-indigo-600/90 text-white flex items-center gap-1">
            <Monitor className="h-3 w-3" />
            Teacher is sharing screen
          </Badge>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="relative w-full max-w-5xl aspect-[16/9] bg-gray-900 rounded-xl shadow-2xl overflow-hidden border-2 border-indigo-500/30 flex items-center justify-center">
            <div className="text-center">
              <Monitor className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Screen share in progress</p>
              <p className="text-gray-500 text-sm mt-2">View the teacher's shared screen</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            Teacher is sharing their screen
          </div>
        </div>
      </div>
    );
  }

  // Show embedded content if teacher has embedded a link
  if (embeddedUrl) {
    // Transform URL for embedding
    const getEmbedUrl = (inputUrl: string): string => {
      try {
        const parsed = new URL(inputUrl);
        if (parsed.hostname.includes('youtube.com') && parsed.searchParams.has('v')) {
          const videoId = parsed.searchParams.get('v');
          return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
        }
        if (parsed.hostname === 'youtu.be') {
          const videoId = parsed.pathname.slice(1);
          return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
        }
        if (parsed.hostname.includes('docs.google.com')) {
          if (!inputUrl.includes('/embed')) {
            return inputUrl.replace('/edit', '/preview').replace('/view', '/preview');
          }
        }
        return inputUrl;
      } catch {
        return inputUrl;
      }
    };

    return (
      <div className="flex-1 flex flex-col bg-gray-950 relative overflow-hidden">
        {/* Embedded Content Indicator */}
        <div className="absolute top-4 left-4 z-20">
          <Badge className="bg-teal-600/90 text-white flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            Shared Content
          </Badge>
        </div>

        {/* Mode Indicator */}
        {studentCanDraw && (
          <div className="absolute top-4 right-4 z-20">
            <Badge className="bg-green-600/90 text-white flex items-center gap-1">
              <PenLine className="h-3 w-3" />
              Draw Mode
            </Badge>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="relative w-full max-w-5xl aspect-[16/9] bg-white rounded-xl shadow-2xl overflow-hidden">
            <iframe
              src={getEmbedUrl(embeddedUrl)}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
            />

            {/* Drawing overlay for embedded content */}
            {studentCanDraw && (
              <CollaborativeCanvas
                roomId={roomId}
                userId={userId}
                userName={userName}
                role="student"
                canDraw={studentCanDraw}
                activeTool="pen"
                activeColor={activeColor}
                strokes={strokes}
                onAddStroke={onAddStroke}
              />
            )}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            Teacher shared content
          </div>
        </div>
      </div>
    );
  }

  // Normal slide view
  return (
    <div className="flex-1 flex flex-col bg-gray-950 relative overflow-hidden">
      {/* Mode Indicator */}
      <div className="absolute top-4 left-4 z-20">
        <Badge 
          variant="secondary" 
          className={`flex items-center gap-1 ${
            studentCanDraw 
              ? 'bg-green-600/90 text-white' 
              : 'bg-gray-700/90 text-gray-300'
          }`}
        >
          {studentCanDraw ? (
            <>
              <PenLine className="h-3 w-3" />
              Draw Mode
            </>
          ) : (
            <>
              <Eye className="h-3 w-3" />
              View Only
            </>
          )}
        </Badge>
      </div>

      {/* Main Slide Display */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-4xl aspect-[16/9] bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Quiz Slide */}
          {isQuizSlide && currentSlide.quizQuestion && currentSlide.quizOptions && sessionId ? (
            <StudentQuizView
              sessionId={sessionId}
              slideId={currentSlide.id}
              question={currentSlide.quizQuestion}
              options={currentSlide.quizOptions}
              studentId={userId}
              studentName={userName}
              quizActive={quizActive}
              quizLocked={quizLocked}
              quizRevealAnswer={quizRevealAnswer}
            />
          ) : isPollSlide && currentSlide.pollQuestion && currentSlide.pollOptions && sessionId ? (
            <StudentPollView
              sessionId={sessionId}
              slideId={currentSlide.id}
              question={currentSlide.pollQuestion}
              options={currentSlide.pollOptions}
              studentId={userId}
              studentName={userName}
              pollActive={pollActive}
              pollShowResults={pollShowResults}
            />
          ) : currentSlide?.imageUrl ? (
            <img 
              src={currentSlide.imageUrl} 
              alt={currentSlide.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {currentSlide?.title || 'Slide ' + (currentSlideIndex + 1)}
                </h2>
                {currentSlide?.content && (
                  <div className="text-gray-600 text-lg">
                    {currentSlide.content}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Collaborative Canvas Overlay (not for quiz or poll slides) */}
          {!isQuizSlide && !isPollSlide && (
            <CollaborativeCanvas
              roomId={roomId}
              userId={userId}
              userName={userName}
              role="student"
              canDraw={studentCanDraw}
              activeTool={studentCanDraw ? 'pen' : 'pointer'}
              activeColor={activeColor}
              strokes={strokes}
              onAddStroke={onAddStroke}
            />
          )}
          
          {/* Slide Number Indicator */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-20">
            {currentSlideIndex + 1} / {slides.length}
          </div>
        </div>
      </div>

      {/* Teacher Control Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Teacher is controlling slides
        </div>
      </div>
    </div>
  );
};
