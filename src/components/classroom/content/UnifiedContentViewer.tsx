
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedWhiteboardCanvas } from "@/components/classroom/whiteboard/EnhancedWhiteboardCanvas";
import { EnhancedWhiteboardToolbar } from "@/components/classroom/whiteboard/EnhancedWhiteboardToolbar";
import { EnhancedContentLibrary } from "./EnhancedContentLibrary";
import { EnhancedUploadDialog } from "./EnhancedUploadDialog";
import { FilePreviewModal } from "./FilePreviewModal";
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
      // Load lesson from database and add to whiteboard
      loadLessonById(lessonId);
    }
  }, []);

  const loadLessonById = async (lessonId: string) => {
    // For now, skip auto-loading until we have the proper method
    console.log('⏭️ Skipping auto-load for lesson:', lessonId);
    return;
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

  const handleAddContentToWhiteboard = (item: ContentItem) => {
    console.log('🎯 Adding content to whiteboard:', item);
    
    // Prefer existing URL (from library) then source
    const anyItem: any = item as any;
    let contentUrl: string | undefined = anyItem.source || anyItem.url;
    
    // Determine content type broadly
    const contentType: string = (anyItem.contentType || item.type || '').toString();
    // Handle curriculum/lesson content by generating HTML when needed
    const isCurriculumContent = ['curriculum','lesson','bulk-curriculum','systematic_lesson'].includes(contentType) || contentType === 'html';
    
    if (isCurriculumContent) {
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
          <TabsList className="grid w-full grid-cols-3 mb-1 bg-white/80 backdrop-blur-sm h-8">
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
            <div className="flex-1 min-h-0" style={{ minHeight: '600px' }}>
              <EnhancedWhiteboardCanvas
                activeTool={activeTool}
                color={color}
                strokeWidth={strokeWidth}
                embeddedContent={embeddedContent}
                onRemoveEmbeddedContent={handleRemoveEmbeddedContent}
              />
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
