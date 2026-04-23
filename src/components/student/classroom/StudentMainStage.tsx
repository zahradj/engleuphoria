import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CollaborativeCanvas } from '@/components/classroom/shared/CollaborativeCanvas';
import { StudentQuizView } from './StudentQuizView';
import { StudentPollView } from './StudentPollView';
import { WhiteboardStroke } from '@/services/whiteboardService';
import { TargetWordsOverlay } from '@/components/classroom/TargetWordsOverlay';
import { SmartSummaryTip } from '@/components/classroom/SmartSummaryTip';
import { Eye, PenLine, Monitor, Layout, PenTool, Globe, Pencil, Eraser, MousePointer2 } from 'lucide-react';

const STUDENT_COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#AA96DA', '#2D4059', '#000000'];

interface QuizOption { id: string; text: string; isCorrect: boolean; }
interface PollOption { id: string; text: string; }

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
  embeddedUrl: string | null;
  isScreenSharing: boolean;
  activeCanvasTab?: string;
  sessionContext?: Record<string, any>;
  onAddStroke: (stroke: Omit<WhiteboardStroke, 'id' | 'roomId' | 'timestamp'>) => void;
}

const CANVAS_TABS = [
  { id: 'slides', label: 'Slides', icon: Layout },
  { id: 'whiteboard', label: 'Whiteboard', icon: PenTool },
  { id: 'web', label: 'Web Content', icon: Globe },
];

const getEmbedUrl = (inputUrl: string): string => {
  try {
    const parsed = new URL(inputUrl);
    if (parsed.hostname.includes('youtube.com') && parsed.searchParams.has('v')) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get('v')}?autoplay=0&rel=0`;
    }
    if (parsed.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}?autoplay=0&rel=0`;
    }
    if (parsed.hostname.includes('docs.google.com') && !inputUrl.includes('/embed')) {
      return inputUrl.replace('/edit', '/preview').replace('/view', '/preview');
    }
    return inputUrl;
  } catch { return inputUrl; }
};

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
  activeCanvasTab = 'slides',
  sessionContext = {},
  onAddStroke
}) => {
  const currentSlide = slides[currentSlideIndex];
  const isQuizSlide = currentSlide?.type === 'quiz';
  const isPollSlide = currentSlide?.type === 'poll';

  // Student-local drawing controls
  const [studentTool, setStudentTool] = useState<'pointer' | 'pen' | 'eraser'>('pen');
  const [studentColor, setStudentColor] = useState<string>(activeColor || STUDENT_COLORS[0]);
  // Whiteboard tab is collaborative — student can always draw there
  const canDrawOnWhiteboard = true;
  const canDrawOnSlides = studentCanDraw;
  const canDrawOnWeb = studentCanDraw;

  // Show screen share if teacher is sharing
  if (isScreenSharing) {
    return (
      <div className="flex-1 flex flex-col bg-white/40 relative overflow-hidden">
        <div className="absolute top-4 left-4 z-20">
          <Badge className="bg-indigo-600/90 text-white flex items-center gap-1">
            <Monitor className="h-3 w-3" />
            Teacher is sharing screen
          </Badge>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="relative w-full max-w-5xl aspect-[16/9] bg-gray-50 rounded-xl shadow-2xl overflow-hidden border-2 border-indigo-300/50 flex items-center justify-center">
            <div className="text-center">
              <Monitor className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Screen share in progress</p>
              <p className="text-gray-400 text-sm mt-2">View the teacher's shared screen</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-600 flex items-center gap-2 shadow-sm border border-gray-200">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            Teacher is sharing their screen
          </div>
        </div>
      </div>
    );
  }

  const renderSlideContent = () => {
    if (isQuizSlide && currentSlide.quizQuestion && currentSlide.quizOptions && sessionId) {
      return (
        <StudentQuizView
          sessionId={sessionId} slideId={currentSlide.id}
          question={currentSlide.quizQuestion} options={currentSlide.quizOptions}
          studentId={userId} studentName={userName}
          quizActive={quizActive} quizLocked={quizLocked} quizRevealAnswer={quizRevealAnswer}
        />
      );
    }
    if (isPollSlide && currentSlide.pollQuestion && currentSlide.pollOptions && sessionId) {
      return (
        <StudentPollView
          sessionId={sessionId} slideId={currentSlide.id}
          question={currentSlide.pollQuestion} options={currentSlide.pollOptions}
          studentId={userId} studentName={userName}
          pollActive={pollActive} pollShowResults={pollShowResults}
        />
      );
    }
    if (currentSlide?.imageUrl) {
      return <img src={currentSlide.imageUrl} alt={currentSlide.title} className="w-full h-full object-contain" />;
    }
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {currentSlide?.title || 'Slide ' + (currentSlideIndex + 1)}
          </h2>
          {currentSlide?.content && <div className="text-gray-600 text-lg">{currentSlide.content}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-white/40 relative overflow-hidden">
      {/* Tabs (read-only for student, shows teacher's active tab) */}
      <div className="flex items-center gap-1 px-4 pt-2 shrink-0">
        {CANVAS_TABS.map(tab => (
          <div
            key={tab.id}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-medium ${
              activeCanvasTab === tab.id
                ? 'bg-white text-gray-900 border-b-2 border-purple-500 shadow-sm'
                : 'text-gray-400'
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </div>
        ))}
      </div>

      {/* Target Words Overlay */}
      <TargetWordsOverlay sessionContext={sessionContext} isTeacher={false} />

      {/* Smart Summary Tip */}
      <SmartSummaryTip sessionContext={sessionContext} />

      {/* Mode Indicator */}
      <div className="absolute top-12 left-4 z-20">
        <Badge
          variant="secondary"
          className={`flex items-center gap-1 ${studentCanDraw ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}
        >
          {studentCanDraw ? <><PenLine className="h-3 w-3" /> Draw Mode</> : <><Eye className="h-3 w-3" /> View Only</>}
        </Badge>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        {activeCanvasTab === 'slides' && (
          <div className="relative w-full max-w-4xl aspect-[16/9] bg-white rounded-xl shadow-2xl overflow-hidden">
            {renderSlideContent()}
            {!isQuizSlide && !isPollSlide && (
              <CollaborativeCanvas
                roomId={roomId} userId={userId} userName={userName} role="student"
                canDraw={canDrawOnSlides && studentTool !== 'pointer'}
                activeTool={studentTool === 'pointer' ? 'pen' : studentTool}
                activeColor={studentColor} strokes={strokes} onAddStroke={onAddStroke}
              />
            )}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-20">
              {currentSlideIndex + 1} / {slides.length}
            </div>
          </div>
        )}

        {activeCanvasTab === 'whiteboard' && (
          <div className="relative w-full max-w-5xl aspect-[16/9] bg-white rounded-xl shadow-2xl overflow-hidden">
            <CollaborativeCanvas
              roomId={roomId} userId={userId} userName={userName} role="student"
              canDraw={canDrawOnWhiteboard && studentTool !== 'pointer'}
              activeTool={studentTool === 'pointer' ? 'pen' : studentTool}
              activeColor={studentColor} strokes={strokes} onAddStroke={onAddStroke}
            />
          </div>
        )}

        {activeCanvasTab === 'web' && (
          <div className="relative w-full max-w-5xl aspect-[16/9] bg-white rounded-xl shadow-2xl overflow-hidden">
            {embeddedUrl ? (
              <>
                <iframe
                  src={getEmbedUrl(embeddedUrl)}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
                />
                {/* Always render canvas overlay so teacher's strokes appear; only intercept pointer when student is drawing */}
                <CollaborativeCanvas
                  roomId={roomId} userId={userId} userName={userName} role="student"
                  canDraw={canDrawOnWeb && studentTool !== 'pointer'}
                  activeTool={studentTool === 'pointer' ? 'pen' : studentTool}
                  activeColor={studentColor} strokes={strokes} onAddStroke={onAddStroke}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Globe className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No web content shared yet.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Student Drawing Toolbar (whiteboard always; slides/web when teacher allows) */}
      {(activeCanvasTab === 'whiteboard' ||
        (activeCanvasTab === 'slides' && canDrawOnSlides) ||
        (activeCanvasTab === 'web' && canDrawOnWeb && embeddedUrl)) && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30">
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md rounded-full px-2 py-2 shadow-xl border border-gray-200">
            <Button
              variant="ghost" size="icon"
              onClick={() => setStudentTool('pointer')}
              className={`h-9 w-9 rounded-full ${studentTool === 'pointer' ? 'bg-purple-500 text-white hover:bg-purple-600' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Pointer"
            >
              <MousePointer2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="icon"
              onClick={() => setStudentTool('pen')}
              className={`h-9 w-9 rounded-full ${studentTool === 'pen' ? 'bg-purple-500 text-white hover:bg-purple-600' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Pen"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost" size="icon"
              onClick={() => setStudentTool('eraser')}
              className={`h-9 w-9 rounded-full ${studentTool === 'eraser' ? 'bg-orange-500 text-white hover:bg-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Eraser"
            >
              <Eraser className="h-4 w-4" />
            </Button>
            <div className="h-5 w-px bg-gray-300 mx-1" />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-gray-100" title="Color">
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300" style={{ backgroundColor: studentColor }} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="center">
                <div className="grid grid-cols-3 gap-1.5">
                  {STUDENT_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setStudentColor(color)}
                      className={`w-7 h-7 rounded-full transition-transform ${studentColor === color ? 'ring-2 ring-offset-1 ring-purple-500 scale-110' : 'hover:scale-105'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* Teacher Control Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-600 flex items-center gap-2 shadow-sm border border-gray-200">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Teacher is controlling slides
        </div>
      </div>
    </div>
  );
};