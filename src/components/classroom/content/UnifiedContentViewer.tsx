
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedWhiteboardCanvas } from "@/components/classroom/whiteboard/EnhancedWhiteboardCanvas";
import { EnhancedWhiteboardToolbar } from "@/components/classroom/whiteboard/EnhancedWhiteboardToolbar";
import { EnhancedContentLibrary } from "./EnhancedContentLibrary";
import { EnhancedUploadDialog } from "./EnhancedUploadDialog";
import { FilePreviewModal } from "./FilePreviewModal";
import { LessonSlideViewer } from "./LessonSlideViewer";
import { useEnhancedContentManager } from "./useEnhancedContentManager";
import { ContentItem } from "./types";
import { SoundButton } from "@/components/ui/sound-button";
import { TeacherAssignmentPanel } from "../assignment/TeacherAssignmentPanel";
import { StudentAssignmentPanel } from "../assignment/StudentAssignmentPanel";
import { Upload, Plus, BookOpen, PenTool, Gamepad2 } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("whiteboard");
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser" | "text" | "highlighter" | "shape" | "move">("pencil");
  const [color, setColor] = useState("#9B87F5");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [activeShape, setActiveShape] = useState<"rectangle" | "circle">("rectangle");
  const [embeddedContent, setEmbeddedContent] = useState<EmbeddedContent[]>([]);
  const [currentLessonSlides, setCurrentLessonSlides] = useState<any>(null);
  const [currentLessonTitle, setCurrentLessonTitle] = useState("");
  
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

  const loadLessonById = async (lessonId: string) => {
    try {
      const { curriculumService } = await import('@/services/curriculumService');
      const { supabase } = await import('@/integrations/supabase/client');
      
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
                          lesson.slides_content.slides.length < 12 &&
                          lesson.slides_content.version !== '2.0';
      
      if (needsGeneration || needsUpgrade) {
        console.log('🎨 Generating/upgrading lesson slides:', lesson.title);
        
        try {
          const { data, error } = await supabase.functions.invoke('ai-slide-generator', {
            body: { 
              content_id: lessonId, 
              content_type: 'lesson',
              generate_20_slides: true
            }
          });

          if (error) throw error;
          
          // Reload lesson with new slides
          const updatedLesson = await curriculumService.getSystematicLessonById(lessonId);
          if (updatedLesson?.slides_content) {
            lesson.slides_content = updatedLesson.slides_content;
          }
        } catch (error) {
          console.error('Failed to generate/upgrade slides:', error);
        }
      }

      // Set the lesson slides for React component
      setCurrentLessonSlides(lesson.slides_content);
      setCurrentLessonTitle(lesson.title);
      setActiveTab('lesson-viewer');
      
    } catch (error) {
      console.error('Error loading lesson:', error);
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
                <div class="slide-number">Slide \${slide.slide_number} of \${slidesData.slides.length}</div>
                <div class="slide-activity-type">\${slide.activity_type.replace('_', ' ')}</div>
                <h2 style="font-size: 2.2em; margin-bottom: 20px; color: #1e293b;">\${slide.title}</h2>
                <div class="slide-text">\${slide.content}</div>
                
                \${slide.interactive_elements && slide.interactive_elements.length > 0 ? \`
                  <div class="interactive-elements">
                    \${slide.interactive_elements.map(el => \`<div class="interactive-element">\${el}</div>\`).join('')}
                  </div>
                \` : ''}
                
                \${slide.gamification ? \`
                  <div class="gamification-info">
                    <div style="font-weight: 600; margin-bottom: 10px; color: #0f172a;">
                      <span class="points-badge">\${slide.gamification.points_possible} Points</span>
                      Activity Rewards
                    </div>
                    \${slide.gamification.badges && slide.gamification.badges.length > 0 ? \`
                      <div class="badges">
                        \${slide.gamification.badges.map(badge => \`<span class="badge">\${badge}</span>\`).join('')}
                      </div>
                    \` : ''}
                  </div>
                \` : ''}
                
                \${slide.teacher_notes ? \`
                  <div class="teacher-notes">
                    <strong>Teacher Notes:</strong> \${slide.teacher_notes}
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
    handleEnhancedUpload: originalHandleEnhancedUpload,
    previewFile,
    openPreview,
    closePreview,
    handleFileDelete,
    handleFileDownload
  } = useEnhancedContentManager(initialContent, studentName, isTeacher);

  // Simple upload handler that only adds to content library
  const handleEnhancedUpload = (uploadFiles: any[]) => {
    console.log('🔄 UnifiedContentViewer: handleEnhancedUpload called with files:', uploadFiles);
    
    // Only handle the original upload logic to add files to content library
    originalHandleEnhancedUpload(uploadFiles);
  };

  const handleAddEmbeddedContent = (content: Omit<EmbeddedContent, 'id'>) => {
    const newContent: EmbeddedContent = {
      ...content,
      id: Date.now().toString(),
      width: Math.max(content.width, 1000),
      height: Math.max(content.height, 700),
      x: content.x || 100,
      y: content.y || 100
    };
    setEmbeddedContent(prev => [...prev, newContent]);
  };

  const handleRemoveEmbeddedContent = (id: string) => {
    setEmbeddedContent(prev => prev.filter(content => content.id !== id));
  };

  const handleAddContentToWhiteboard = async (item: ContentItem) => {
    console.log('🎯 Adding content to whiteboard:', item);
    
    // Prefer existing URL (from library) then source
    const anyItem: any = item as any;
    let contentUrl: string | undefined = anyItem.source || anyItem.url;
    
    // Determine content type broadly
    const contentType: string = (anyItem.contentType || item.type || '').toString();
    // Handle curriculum/lesson content by generating HTML when needed
    const isCurriculumContent = ['curriculum','lesson','bulk-curriculum','systematic_lesson'].includes(contentType) || contentType === 'html';
    
    if (isCurriculumContent) {
      // Check if systematic lesson with slides_content or slides array
      if (anyItem.slides_content?.slides && anyItem.slides_content.slides.length > 0) {
        console.log('🎨 Using systematic lesson slides_content with', anyItem.slides_content.slides.length, 'slides');
        // Use React component instead of iframe
        setCurrentLessonSlides(anyItem.slides_content);
        setCurrentLessonTitle(item.title);
        setActiveTab('lesson-viewer');
        return;
      } else if (anyItem.slides && anyItem.slides.length > 0) {
        console.log('🎨 Using lesson slides array with', anyItem.slides.length, 'slides');
        setCurrentLessonSlides(anyItem.slides);
        setCurrentLessonTitle(item.title);
        setActiveTab('lesson-viewer');
        return;
      } else if (anyItem.id && contentType === 'systematic_lesson') {
        console.log('🔄 Systematic lesson needs slides generation, id:', anyItem.id);
        try {
          // Fetch full lesson data first
          const { curriculumService } = await import('@/services/curriculumService');
          const fullLesson = await curriculumService.getSystematicLessonById(anyItem.id);
          
          if (fullLesson?.slides_content?.slides && fullLesson.slides_content.slides.length > 0) {
            console.log('🎨 Found existing slides_content, using React component');
            setCurrentLessonSlides(fullLesson.slides_content);
            setCurrentLessonTitle(item.title);
            setActiveTab('lesson-viewer');
            return;
          } else {
            console.log('🎨 Generating slides for systematic lesson');
            const { supabase } = await import('@/integrations/supabase/client');
            const { data, error } = await supabase.functions.invoke('ai-slide-generator', {
              body: { 
                content_id: anyItem.id,
                content_type: 'systematic_lesson',
                generate_20_slides: true
              }
            });
            
            if (error) throw error;
            
            // Reload and embed
            const updatedLesson = await curriculumService.getSystematicLessonById(anyItem.id);
            if (updatedLesson?.slides_content?.slides) {
              const lessonContent = {
                id: `lesson-${Date.now()}`,
                title: item.title,
                url: `data:text/html;charset=utf-8,${encodeURIComponent(generateLessonSlidesHTML(updatedLesson))}`,
                x: 100,
                y: 100,
                width: 1200,
                height: 800,
                fileType: 'lesson-slides',
                originalType: 'systematic_lesson'
              };
              setEmbeddedContent(prev => [...prev, lessonContent]);
              setActiveTab('whiteboard');
              return;
            }
          }
        } catch (error) {
          console.error('❌ Failed to load/generate systematic lesson slides:', error);
        }
      } else {
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${item.title}</title>
            <style>
                body {
                    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #333;
                    line-height: 1.6;
                }
                .lesson-container {
                    max-width: 900px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .lesson-header {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    position: relative;
                }
                .lesson-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1.5" fill="white" opacity="0.1"/><circle cx="40" cy="70" r="1" fill="white" opacity="0.1"/></svg>');
                }
                .lesson-title {
                    font-size: 2.5em;
                    font-weight: 700;
                    margin: 0 0 10px 0;
                    position: relative;
                    z-index: 1;
                }
                .lesson-subtitle {
                    font-size: 1.2em;
                    opacity: 0.9;
                    margin: 0;
                    position: relative;
                    z-index: 1;
                }
                .lesson-content {
                    padding: 40px;
                }
                .lesson-overview {
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 30px;
                    border-left: 5px solid #2563eb;
                }
                .overview-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 15px;
                }
                .overview-item {
                    background: white;
                    padding: 15px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    border: 1px solid #e2e8f0;
                }
                .overview-label {
                    font-weight: 600;
                    color: #475569;
                    margin-bottom: 5px;
                    font-size: 0.9em;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .overview-value {
                    font-size: 1.1em;
                    color: #1e293b;
                }
                .section {
                    margin-bottom: 40px;
                    background: #fafbfc;
                    padding: 30px;
                    border-radius: 15px;
                    border: 1px solid #e2e8f0;
                }
                .section-title {
                    font-size: 1.8em;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .section-icon {
                    width: 30px;
                    height: 30px;
                    background: #2563eb;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                }
                .objectives-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .objectives-list li {
                    background: white;
                    margin: 10px 0;
                    padding: 15px 20px;
                    border-radius: 10px;
                    border-left: 4px solid #10b981;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    position: relative;
                }
                .objectives-list li::before {
                    content: '✓';
                    position: absolute;
                    left: -2px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #10b981;
                    color: white;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                }
                .slide {
                    background: white;
                    margin: 20px 0;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                    border: 1px solid #e2e8f0;
                }
                .slide-header {
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                    color: white;
                    padding: 15px 25px;
                    margin: -30px -30px 25px -30px;
                    border-radius: 15px 15px 0 0;
                    font-weight: 600;
                    font-size: 1.2em;
                }
                .slide-content {
                    line-height: 1.8;
                }
                .activity {
                    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                    padding: 25px;
                    margin: 15px 0;
                    border-radius: 12px;
                    border-left: 4px solid #f59e0b;
                    position: relative;
                }
                .activity-title {
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 15px;
                    font-size: 1.2em;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .activity-icon {
                    background: #f59e0b;
                    color: white;
                    width: 25px;
                    height: 25px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                }
                .duration-badge {
                    background: #dc2626;
                    color: white;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 0.8em;
                    font-weight: 500;
                    position: absolute;
                    top: 15px;
                    right: 15px;
                }
                .interactive-element {
                    background: #eff6ff;
                    border: 2px dashed #3b82f6;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 15px 0;
                    text-align: center;
                    color: #1e40af;
                    font-weight: 500;
                }
                .vocabulary-box {
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                    padding: 20px;
                    border-radius: 10px;
                    margin: 15px 0;
                    border: 1px solid #f59e0b;
                }
                .vocabulary-title {
                    font-weight: 600;
                    color: #92400e;
                    margin-bottom: 10px;
                }
                .homework-section {
                    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                    padding: 25px;
                    border-radius: 15px;
                    margin-top: 30px;
                    border: 1px solid #0ea5e9;
                }
            </style>
        </head>
        <body>
            <div class="lesson-container">
                <div class="lesson-header">
                    <h1 class="lesson-title">${item.title}</h1>
                    <p class="lesson-subtitle">Interactive English Lesson • CEFR Level ${item.level || 'B1'}</p>
                </div>
                
                <div class="lesson-content">
                    <div class="lesson-overview">
                        <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 1.5em;">📋 Lesson Overview</h2>
                        <div class="overview-grid">
                            <div class="overview-item">
                                <div class="overview-label">CEFR Level</div>
                                <div class="overview-value">${item.level || 'B1'}</div>
                            </div>
                            <div class="overview-item">
                                <div class="overview-label">Duration</div>
                                <div class="overview-value">${item.duration || item.metadata?.estimated_duration || 45} minutes</div>
                            </div>
                            <div class="overview-item">
                                <div class="overview-label">Theme</div>
                                <div class="overview-value">${item.topic || item.theme || 'General English'}</div>
                            </div>
                            <div class="overview-item">
                                <div class="overview-label">Difficulty</div>
                                <div class="overview-value">${item.difficulty || item.metadata?.difficulty_level || 'Intermediate'}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <h2 class="section-title">
                            <span class="section-icon">🎯</span>
                            Learning Objectives
                        </h2>
                        <ul class="objectives-list">
                            ${(item.metadata?.learning_objectives || [
                                'Students will learn and practice key vocabulary related to the topic',
                                'Students will improve their speaking and listening skills through interactive activities',
                                'Students will demonstrate understanding through practical exercises',
                                'Students will gain confidence in using English in real-life situations'
                            ]).map((obj: string) => `<li>${obj}</li>`).join('')}
                        </ul>
                    </div>

                    <!-- Lesson Slides -->
                    <div class="section">
                        <h2 class="section-title">
                            <span class="section-icon">📖</span>
                            Lesson Content
                        </h2>

                        <!-- Slide 1: Warm-up -->
                        <div class="slide">
                            <div class="slide-header">🌟 Warm-up Activity (5 minutes)</div>
                            <div class="slide-content">
                                <div class="interactive-element">
                                    <strong>Discussion Questions:</strong><br>
                                    • What do you already know about ${item.topic || 'this topic'}?<br>
                                    • Can you share an experience related to ${item.topic || 'this topic'}?<br>
                                    • What would you like to learn today?
                                </div>
                                <p><strong>Teacher Instructions:</strong> Encourage students to share their thoughts. Create a mind map on the board with their ideas.</p>
                            </div>
                        </div>

                        <!-- Slide 2: Presentation -->
                        <div class="slide">
                            <div class="slide-header">📚 Presentation Phase (15 minutes)</div>
                            <div class="slide-content">
                                <div class="vocabulary-box">
                                    <div class="vocabulary-title">🔤 Key Vocabulary</div>
                                    <p>Introduce 8-10 new words related to ${item.topic || 'the lesson topic'}. Use visual aids, real objects, or demonstrations.</p>
                                </div>
                                <p><strong>Grammar Focus:</strong> Present the main grammar structure with clear examples and explanations.</p>
                                <div class="interactive-element">
                                    Use concept checking questions (CCQs) to ensure understanding
                                </div>
                            </div>
                        </div>

                        <!-- Slide 3: Practice -->
                        <div class="slide">
                            <div class="slide-header">💪 Practice Activities (15 minutes)</div>
                            <div class="slide-content">
                                <div class="activity">
                                    <div class="activity-title">
                                        <span class="activity-icon">1</span>
                                        Controlled Practice
                                    </div>
                                    <div class="duration-badge">5 min</div>
                                    <p>Gap-fill exercises and multiple choice questions to practice the new language in a controlled way.</p>
                                </div>
                                <div class="activity">
                                    <div class="activity-title">
                                        <span class="activity-icon">2</span>
                                        Semi-Controlled Practice
                                    </div>
                                    <div class="duration-badge">10 min</div>
                                    <p>Pair work activities where students practice using the new language with some guidance.</p>
                                    <div class="interactive-element">
                                        💬 Pair Discussion: Students ask and answer questions using the new vocabulary and grammar
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Slide 4: Production -->
                        <div class="slide">
                            <div class="slide-header">🎭 Production Phase (8 minutes)</div>
                            <div class="slide-content">
                                <div class="activity">
                                    <div class="activity-title">
                                        <span class="activity-icon">🎯</span>
                                        Free Practice
                                    </div>
                                    <div class="duration-badge">8 min</div>
                                    <p><strong>Role-play or Discussion Activity:</strong> Students use the new language freely in a realistic context.</p>
                                    <div class="interactive-element">
                                        Students create their own dialogues or presentations using today's language
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Slide 5: Wrap-up -->
                        <div class="slide">
                            <div class="slide-header">🎯 Assessment & Wrap-up (2 minutes)</div>
                            <div class="slide-content">
                                <p><strong>Quick Assessment:</strong></p>
                                <ul>
                                    <li>✅ Can students use the new vocabulary correctly?</li>
                                    <li>✅ Do they understand the grammar structure?</li>
                                    <li>✅ Are they confident in speaking activities?</li>
                                </ul>
                                <div class="interactive-element">
                                    Exit Ticket: Each student says one new thing they learned today
                                </div>
                            </div>
                        </div>
                    </div>

                    ${(item.metadata?.activities && item.metadata.activities.length > 0) ? `
                        <div class="section">
                            <h2 class="section-title">
                                <span class="section-icon">🎮</span>
                                Additional Activities
                            </h2>
                            ${item.metadata.activities.map((activity: any, index: number) => `
                                <div class="activity">
                                    <div class="activity-title">
                                        <span class="activity-icon">${index + 1}</span>
                                        ${activity.title || 'Practice Exercise'}
                                    </div>
                                    ${activity.duration ? `<div class="duration-badge">${activity.duration} min</div>` : ''}
                                    <p>${activity.description || activity.content || 'Interactive learning activity'}</p>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    <div class="homework-section">
                        <h3 style="margin: 0 0 15px 0; color: #0c4a6e;">📚 Homework Assignment</h3>
                        <p>Practice the new vocabulary and grammar by:</p>
                        <ul>
                            <li>Writing 5 sentences using today's vocabulary</li>
                            <li>Recording yourself speaking for 2 minutes about ${item.topic || 'the lesson topic'}</li>
                            <li>Finding 3 examples of today's grammar in English media</li>
                        </ul>
                    </div>

                    ${item.content ? `
                        <div class="section">
                            <h2 class="section-title">
                                <span class="section-icon">📄</span>
                                Additional Content
                            </h2>
                            <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
                                ${item.content}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </body>
        </html>
      `;
      
      const blob = new Blob([html], { type: 'text/html' });
      contentUrl = URL.createObjectURL(blob);
    }
    }
    
    const newContent: EmbeddedContent = {
      id: Date.now().toString(),
      title: item.title,
      url: contentUrl,
      x: 100,
      y: 100,
      width: 800,
      height: 600,
      fileType: isCurriculumContent ? 'text/html' : item.fileType,
      originalType: item.type
    };
    
    console.log('✅ Created embedded content:', newContent);
    setEmbeddedContent(prev => [...prev, newContent]);
    
    // Switch to whiteboard tab
    setActiveTab('whiteboard');
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex items-center justify-between p-2 bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <PenTool size={14} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Interactive Learning Space</h2>
              <p className="text-xs text-gray-600">Enhanced whiteboard with assignment system</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <SoundButton
            variant="outline"
            size="sm"
            onClick={openUploadDialog}
            className="flex items-center gap-1 bg-white hover:bg-blue-50 h-7 px-2 text-xs"
          >
            <Upload size={12} />
            Upload
          </SoundButton>
          
          {isTeacher && (
            <SoundButton
              variant="outline"
              size="sm"
              onClick={() => console.log("Add interactive content")}
              className="flex items-center gap-1 bg-white hover:bg-green-50 h-7 px-2 text-xs"
            >
              <Plus size={12} />
              Add
            </SoundButton>
          )}
        </div>
      </div>

      <div className="flex-1 p-1 min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mb-1 bg-white/80 backdrop-blur-sm h-8">
            <TabsTrigger value="lesson-viewer" className="flex items-center gap-1 text-xs">
              <BookOpen size={12} />
              Lesson
            </TabsTrigger>
            <TabsTrigger value="whiteboard" className="flex items-center gap-1 text-xs">
              <PenTool size={12} />
              Whiteboard
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-1 text-xs">
              <Gamepad2 size={12} />
              {isTeacher ? "Create Assignments" : "My Assignments"}
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-1 text-xs">
              <BookOpen size={12} />
              Content Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lesson-viewer" className="flex-1 min-h-0">
            {currentLessonSlides ? (
              <LessonSlideViewer
                slides={currentLessonSlides}
                title={currentLessonTitle}
                className="h-full"
                studentId={currentUser?.id}
                isTeacher={isTeacher}
              />
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground">No lesson loaded</h3>
                  <p className="text-muted-foreground">Select a lesson from the content library to begin</p>
                </div>
              </div>
            )}
          </TabsContent>


          <TabsContent value="whiteboard" className="flex-1 flex flex-col space-y-1 min-h-0">
            <div className="flex-shrink-0">
              <EnhancedWhiteboardToolbar
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                activeShape={activeShape}
                setActiveShape={setActiveShape}
                color={color}
                setColor={setColor}
                strokeWidth={strokeWidth}
                setStrokeWidth={setStrokeWidth}
                onAddEmbeddedContent={handleAddEmbeddedContent}
              />
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <div className="h-full overflow-y-auto" style={{ minHeight: '800px' }}>
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

          <TabsContent value="assignments" className="flex-1 min-h-0">
            <div className="h-full bg-white rounded-lg border shadow-sm">
              {isTeacher ? (
                <TeacherAssignmentPanel />
              ) : (
                <StudentAssignmentPanel studentName={studentName} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="library" className="flex-1 min-h-0">
            <div className="h-full bg-white rounded-lg border shadow-sm">
              <EnhancedContentLibrary 
                contentItems={contentItems} 
                selectedContent={selectedContent} 
                onSelectContent={setSelectedContent}
                onPreviewFile={openPreview}
                onDeleteFile={isTeacher ? handleFileDelete : undefined}
                onAddToWhiteboard={handleAddContentToWhiteboard}
                currentUser={currentUser || {
                  id: 'default',
                  role: isTeacher ? 'teacher' : 'student',
                  name: studentName
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <EnhancedUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={closeUploadDialog}
        onUpload={handleEnhancedUpload}
        maxFiles={10}
        maxSizeMB={100}
      />

      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={closePreview}
        file={previewFile}
        onDelete={isTeacher ? handleFileDelete : undefined}
        onDownload={handleFileDownload}
      />
    </div>
  );
}
