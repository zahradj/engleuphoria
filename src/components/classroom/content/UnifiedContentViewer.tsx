import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedWhiteboardCanvas } from "@/components/classroom/whiteboard/EnhancedWhiteboardCanvas";
import { EnhancedWhiteboardToolbar } from "@/components/classroom/whiteboard/EnhancedWhiteboardToolbar";
import { EnhancedContentLibrary } from "./EnhancedContentLibrary";
import { EnhancedUploadDialog } from "./EnhancedUploadDialog";
import { LessonSlideViewer } from "./LessonSlideViewer";
import { useEnhancedContentManager } from "./useEnhancedContentManager";
import { ContentItem } from "./types";
import { SoundButton } from "@/components/ui/sound-button";
import { TeacherAssignmentPanel } from "../assignment/TeacherAssignmentPanel";
import { StudentAssignmentPanel } from "../assignment/StudentAssignmentPanel";
import { Upload, Plus, BookOpen, PenTool, Gamepad2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmbeddedContent {
  id: string;
  title: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fileType?: string;
  originalType?: string;
}

interface UnifiedContentViewerProps {
  isTeacher: boolean;
  studentName: string;
  currentUser?: {
    id: string;
    role: 'teacher' | 'student';
    name: string;
  };
}

export function UnifiedContentViewer({ isTeacher, studentName, currentUser }: UnifiedContentViewerProps) {
  const [activeTab, setActiveTab] = useState(() => {
    // Default to Content Library for teachers to see lessons immediately
    return isTeacher ? "content" : "whiteboard";
  });
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser" | "text" | "highlighter" | "shape" | "move">("pencil");
  const [color, setColor] = useState("#9B87F5");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [activeShape, setActiveShape] = useState<"rectangle" | "circle">("rectangle");
  const [embeddedContent, setEmbeddedContent] = useState<EmbeddedContent[]>([]);
  const [currentLessonSlides, setCurrentLessonSlides] = useState<any>(null);
  const [currentLessonTitle, setCurrentLessonTitle] = useState("");
  const [isGeneratingSlides, setIsGeneratingSlides] = useState(false);
  const { toast } = useToast();
  
  // Debug embedded content changes
  React.useEffect(() => {
    console.log('📋 EmbeddedContent state updated:', embeddedContent);
  }, [embeddedContent]);

  // Auto-load lesson from URL parameter
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('lesson');
    
    if (lessonId) {
      console.log('🔄 Auto-loading lesson from URL:', lessonId);
      setActiveTab('whiteboard');
      loadLessonById(lessonId);
    }
  }, []);

  const createFallbackSlides = (lesson: any) => {
    return {
      version: "2.0",
      theme: "mist-blue",
      slides: [
        {
          id: "slide-1",
          type: "warmup",
          prompt: `Welcome to ${lesson.title}`,
          instructions: "Lesson overview and objectives",
          accessibility: {
            screenReaderText: `Welcome slide for ${lesson.title}`,
            highContrast: false,
            largeText: false
          }
        }
      ],
      durationMin: lesson.estimated_duration || 45,
      metadata: {
        CEFR: lesson.level_info?.cefr_level || 'A1',
        module: 1,
        lesson: 1,
        targets: lesson.lesson_objectives || [],
        weights: { accuracy: 60, fluency: 40 }
      },
      generated_at: new Date().toISOString(),
      generated_by: 'fallback-template'
    };
  };

  const loadLessonById = async (lessonId: string) => {
    try {
      const { curriculumService } = await import('@/services/curriculumService');
      
      console.log('🔄 Loading lesson:', lessonId);
      
      // Fetch lesson from database
      const lesson = await curriculumService.getSystematicLessonById(lessonId);
      if (!lesson) {
        console.error('Lesson not found:', lessonId);
        return;
      }

      console.log('📚 Lesson data:', lesson);

      // Clear any existing lesson content first
      setEmbeddedContent(prev => prev.filter(content => content.originalType !== 'systematic_lesson'));

      // Check if lesson needs slides generation or upgrade
      const needsGeneration = !lesson.slides_content || 
                             !lesson.slides_content?.slides || 
                             lesson.slides_content.slides.length === 0;

      const needsUpgrade = lesson.slides_content?.slides && 
                          (lesson.slides_content.slides.length < 20 || 
                           lesson.slides_content.version !== '2.0');
      
      if (needsGeneration || needsUpgrade) {
        console.log('🎨 Generating/upgrading lesson slides:', lesson.title);
        setIsGeneratingSlides(true);
        
        // Show generating toast
        toast({
          title: "Generating Slides",
          description: "Creating interactive lesson slides with OpenAI...",
        });
        
        try {
          const { data, error } = await supabase.functions.invoke('ai-slide-generator', {
            body: { 
              content_id: lessonId, 
              content_type: 'systematic_lesson',
              generate_20_slides: true
            }
          });

          if (error) {
            throw error;
          }
          
          if (data?.success) {
            toast({
              title: "Slides Generated! 🎉",
              description: `Created ${data.slides?.total_slides || 22} interactive slides.`,
            });
            
            // Update lesson with new slides
            lesson.slides_content = data.slides;
          } else {
            throw new Error(data?.error || 'Failed to generate slides');
          }
        } catch (error) {
          console.error('Failed to generate/upgrade slides:', error);
          toast({
            title: "Generation Failed",
            description: "Using fallback template. You can retry slide generation later.",
            variant: "destructive"
          });
          
          // Create minimal fallback template
          lesson.slides_content = createFallbackSlides(lesson);
        } finally {
          setIsGeneratingSlides(false);
        }
      }

      // Set the lesson slides for React component
      setCurrentLessonSlides(lesson.slides_content);
      setCurrentLessonTitle(lesson.title);
      setActiveTab('lesson-viewer');
      
    } catch (error) {
      console.error('Error loading lesson:', error);
      setIsGeneratingSlides(false);
    }
  };

  const regenerateSlides = async (lessonId?: string) => {
    if (!lessonId && !currentLessonSlides) return;
    
    setIsGeneratingSlides(true);
    toast({
      title: "Regenerating Slides",
      description: "Creating new interactive slides with OpenAI...",
    });

    try {
      const { data, error } = await supabase.functions.invoke('ai-slide-generator', {
        body: { 
          content_id: lessonId, 
          content_type: 'systematic_lesson',
          generate_20_slides: true
        }
      });

      if (error) throw error;
      
      if (data?.success) {
        setCurrentLessonSlides(data.slides);
        toast({
          title: "Slides Regenerated! 🎉",
          description: `Created ${data.slides?.total_slides || 22} new interactive slides.`,
        });
      }
    } catch (error) {
      console.error('Failed to regenerate slides:', error);
      toast({
        title: "Regeneration Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsGeneratingSlides(false);
    }
  };

  const generateLessonSlidesHTML = (lesson: any) => {
    if (lesson.slides_content?.slides) {
      // Create self-contained HTML with embedded slide viewer
      const slidesData = lesson.slides_content;
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${lesson.title} - Interactive Slides</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .slides-viewer {
              width: 95vw;
              max-width: 1400px;
              height: 90vh;
              background: white;
              border-radius: 20px;
              box-shadow: 0 25px 50px rgba(0,0,0,0.2);
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }
            .slide-header {
              background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
              color: white;
              padding: 20px 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .slide-title {
              font-size: 1.8em;
              font-weight: 700;
            }
            .slide-nav {
              display: flex;
              gap: 15px;
              align-items: center;
            }
            .nav-button {
              background: rgba(255,255,255,0.2);
              border: none;
              color: white;
              padding: 10px 20px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 500;
              transition: all 0.3s ease;
            }
            .nav-button:hover {
              background: rgba(255,255,255,0.3);
              transform: translateY(-2px);
            }
            .nav-button:disabled {
              opacity: 0.5;
              cursor: not-allowed;
              transform: none;
            }
            .slide-content {
              flex: 1;
              padding: 40px;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            .current-slide {
              text-align: center;
              animation: slideIn 0.5s ease-out;
            }
            @keyframes slideIn {
              from { opacity: 0; transform: translateX(20px); }
              to { opacity: 1; transform: translateX(0); }
            }
            .slide-number {
              font-size: 1.5em;
              font-weight: 600;
              color: #2563eb;
              margin-bottom: 20px;
            }
            .slide-activity-type {
              background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
              color: white;
              padding: 8px 20px;
              border-radius: 20px;
              font-size: 0.9em;
              font-weight: 500;
              display: inline-block;
              margin-bottom: 25px;
              text-transform: capitalize;
            }
            .slide-text {
              font-size: 1.3em;
              line-height: 1.6;
              color: #1e293b;
              margin-bottom: 30px;
              max-width: 800px;
              margin-left: auto;
              margin-right: auto;
            }
            .interactive-elements {
              display: flex;
              flex-wrap: wrap;
              gap: 15px;
              justify-content: center;
              margin: 20px 0;
            }
            .interactive-element {
              background: #f1f5f9;
              border: 2px solid #e2e8f0;
              padding: 15px 25px;
              border-radius: 12px;
              font-weight: 500;
              color: #475569;
              transition: all 0.3s ease;
              cursor: pointer;
            }
            .interactive-element:hover {
              background: #e2e8f0;
              border-color: #2563eb;
              color: #2563eb;
              transform: translateY(-2px);
            }
            .teacher-notes {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 20px;
              margin-top: 30px;
              border-radius: 8px;
              font-style: italic;
              color: #92400e;
            }
            .progress-bar {
              background: #e2e8f0;
              height: 6px;
              border-radius: 3px;
              overflow: hidden;
              margin-top: 10px;
            }
            .progress-fill {
              height: 100%;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              transition: width 0.5s ease;
            }
            .gamification-info {
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
              border: 1px solid #0ea5e9;
              padding: 20px;
              border-radius: 12px;
              margin-top: 20px;
              text-align: left;
            }
            .points-badge {
              background: #dc2626;
              color: white;
              padding: 5px 12px;
              border-radius: 15px;
              font-size: 0.8em;
              font-weight: 600;
              margin-right: 10px;
            }
            .badges {
              display: flex;
              gap: 10px;
              margin-top: 10px;
              flex-wrap: wrap;
            }
            .badge {
              background: #fbbf24;
              color: #92400e;
              padding: 5px 12px;
              border-radius: 15px;
              font-size: 0.8em;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="slides-viewer">
            <div class="slide-header">
              <h1 class="slide-title">${lesson.title}</h1>
              <div class="slide-nav">
                <span id="slide-counter">1 / ${slidesData.slides.length}</span>
                <button class="nav-button" onclick="previousSlide()" id="prev-btn">Previous</button>
                <button class="nav-button" onclick="nextSlide()" id="next-btn">Next</button>
              </div>
            </div>
            <div class="slide-content">
              <div id="current-slide" class="current-slide"></div>
              <div class="progress-bar">
                <div class="progress-fill" id="progress-fill" style="width: ${100/slidesData.slides.length}%"></div>
              </div>
            </div>
          </div>

          <script>
            const slidesData = ${JSON.stringify(slidesData)};
            let currentSlideIndex = 0;

            function updateSlide() {
              const slide = slidesData.slides[currentSlideIndex];
              if (!slide) return;

              const slideHtml = \`
                <div class="slide-number">Slide \${currentSlideIndex + 1} of \${slidesData.slides.length}</div>
                <div class="slide-activity-type">\${slide.type.replace('_', ' ')}</div>
                <h2 style="font-size: 2.2em; margin-bottom: 20px; color: #1e293b;">\${slide.prompt || 'Lesson Content'}</h2>
                <div class="slide-text">\${slide.instructions || slide.prompt || 'Interactive learning content'}</div>
                
                \${slide.options && slide.options.length > 0 ? \`
                  <div class="interactive-elements">
                    \${slide.options.map(option => \`<div class="interactive-element">\${option.text}</div>\`).join('')}
                  </div>
                \` : ''}
              \`;

              document.getElementById('current-slide').innerHTML = slideHtml;
              document.getElementById('slide-counter').textContent = \`\${currentSlideIndex + 1} / \${slidesData.slides.length}\`;
              document.getElementById('progress-fill').style.width = \`\${((currentSlideIndex + 1) / slidesData.slides.length) * 100}%\`;
              
              // Update navigation buttons
              document.getElementById('prev-btn').disabled = currentSlideIndex === 0;
              document.getElementById('next-btn').disabled = currentSlideIndex === slidesData.slides.length - 1;
            }

            function nextSlide() {
              if (currentSlideIndex < slidesData.slides.length - 1) {
                currentSlideIndex++;
                updateSlide();
              }
            }

            function previousSlide() {
              if (currentSlideIndex > 0) {
                currentSlideIndex--;
                updateSlide();
              }
            }

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
              if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                nextSlide();
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                previousSlide();
              }
            });

            // Initialize first slide
            updateSlide();
          </script>
        </body>
        </html>
      `;
    }
    
    // Fallback to HTML content
    return generateLessonHTML(lesson);
  };

  const generateLessonHTML = (lesson: any) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${lesson.title}</title>
        <style>
          body { font-family: Inter, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .lesson-container { max-width: 900px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }
          .lesson-header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; }
          .lesson-title { font-size: 2.5em; font-weight: 700; margin: 0; }
          .lesson-content { padding: 40px; }
          .section { margin-bottom: 30px; background: #fafbfc; padding: 20px; border-radius: 15px; }
          .section-title { font-size: 1.5em; font-weight: 600; color: #1e293b; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="lesson-container">
          <div class="lesson-header">
            <h1 class="lesson-title">${lesson.title}</h1>
            <p>Interactive English Lesson • CEFR Level ${lesson.level_info?.cefr_level || 'B1'}</p>
          </div>
          <div class="lesson-content">
            <div class="section">
              <h2 class="section-title">📋 Lesson Overview</h2>
              <p><strong>Topic:</strong> ${lesson.topic}</p>
              <p><strong>Grammar Focus:</strong> ${lesson.grammar_focus}</p>
              <p><strong>Duration:</strong> ${lesson.estimated_duration} minutes</p>
            </div>
            <div class="section">
              <h2 class="section-title">🎯 Learning Objectives</h2>
              <ul>
                ${(lesson.lesson_objectives || []).map((obj: string) => `<li>${obj}</li>`).join('')}
              </ul>
            </div>
            <div class="section">
              <h2 class="section-title">💬 Communication Outcome</h2>
              <p>${lesson.communication_outcome}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  const initialContent: any[] = [];
  
  const {
    contentItems,
    selectedContent,
    setSelectedContent,
    isUploadDialogOpen,
    openUploadDialog,
    closeUploadDialog,
    handleEnhancedUpload,
    previewFile,
    openPreview,
    closePreview,
    handleFileDelete,
    handleFileDownload
  } = useEnhancedContentManager(initialContent, studentName, isTeacher);

  const handleAddToWhiteboard = async (content: ContentItem) => {
    if (content.type === "lesson" || content.type === "curriculum") {
      // Auto-generate slides if needed
      await loadLessonById(content.id);
      return;
    }

    // Handle file-based content
    const blob = new Blob([content.content || ''], { type: getContentType(content.fileType) });
    const url = URL.createObjectURL(blob);
    
    const newEmbeddedContent: EmbeddedContent = {
      id: content.id,
      title: content.title,
      url,
      x: Math.random() * 200,
      y: Math.random() * 200,
      width: 400,
      height: 300,
      fileType: content.fileType,
      originalType: content.type
    };

    setEmbeddedContent(prev => [...prev, newEmbeddedContent]);
    setActiveTab("whiteboard");
  };

  const getContentType = (fileType: string | undefined): string => {
    if (!fileType) return 'text/plain';
    
    const typeMap: { [key: string]: string } = {
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'html': 'text/html',
      'txt': 'text/plain',
      'json': 'application/json'
    };

    return typeMap[fileType.toLowerCase()] || 'application/octet-stream';
  };

  const handleUpdateEmbeddedContent = (id: string, updates: Partial<EmbeddedContent>) => {
    setEmbeddedContent(prev => 
      prev.map(content => 
        content.id === id ? { ...content, ...updates } : content
      )
    );
  };

  const handleRemoveEmbeddedContent = (id: string) => {
    setEmbeddedContent(prev => prev.filter(content => content.id !== id));
  };

  const addContentToWhiteboard = (content: any) => {
    console.log('🎯 Adding content to whiteboard:', content);
    handleAddToWhiteboard(content);
  };

  return (
    <div className="h-full bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="whiteboard" className="flex items-center gap-2">
            <PenTool size={16} />
            Whiteboard
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Upload size={16} />
            Content Library
          </TabsTrigger>
          <TabsTrigger value="lesson-viewer" className="flex items-center gap-2">
            <BookOpen size={16} />
            Lesson
            {isGeneratingSlides && <Loader2 className="h-4 w-4 animate-spin ml-1" />}
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Gamepad2 size={16} />
            Assignments
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="whiteboard" className="h-full m-0">
            <div className="h-full relative">
              <EnhancedWhiteboardToolbar
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                color={color}
                setColor={setColor}
                strokeWidth={strokeWidth}
                setStrokeWidth={setStrokeWidth}
                activeShape={activeShape}
                setActiveShape={setActiveShape}
              />
              <div className="h-full pt-16">
                <EnhancedWhiteboardCanvas
                  activeTool={activeTool}
                  color={color}
                  strokeWidth={strokeWidth}
                  embeddedContent={embeddedContent}
                  onRemoveEmbeddedContent={handleRemoveEmbeddedContent}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="h-full m-0">
            <div className="h-full">
              <EnhancedContentLibrary
                contentItems={contentItems}
                selectedContent={selectedContent}
                onSelectContent={setSelectedContent}
                onAddToWhiteboard={addContentToWhiteboard}
                currentUser={currentUser || { id: 'default', role: isTeacher ? 'teacher' : 'student', name: studentName }}
              />
            </div>
          </TabsContent>

          <TabsContent value="lesson-viewer" className="h-full m-0">
            <div className="h-full">
              {currentLessonSlides ? (
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{currentLessonTitle}</h2>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => regenerateSlides()}
                        disabled={isGeneratingSlides}
                      >
                        {isGeneratingSlides ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Regenerate Slides
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <LessonSlideViewer 
                      slides={currentLessonSlides} 
                      title={currentLessonTitle}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Lesson Selected</h3>
                    <p className="text-muted-foreground mb-4">
                      Select a lesson from the Content Library to view interactive slides
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="h-full m-0">
            <div className="h-full">
              {isTeacher ? (
                <TeacherAssignmentPanel />
              ) : (
                <StudentAssignmentPanel studentName={studentName} />
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <EnhancedUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={closeUploadDialog}
        onUpload={handleEnhancedUpload}
      />

      <SoundButton>
        🔊
      </SoundButton>
    </div>
  );
}