import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Download, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Upload,
  Eye,
  Clock,
  BookOpen,
  Sparkles,
  Palette,
  Users,
  Link,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PhoneOff,
  MessageSquare,
  Award,
  Zap,
  Star,
  Gift,
  Target,
  Trophy,
  Crown,
  ThumbsUp,
  Smile,
  Heart,
  CheckCircle,
  Activity,
  TrendingUp,
  Calendar,
  MapPin,
  Globe,
  Settings,
  HelpCircle,
  Search,
  Filter,
  SortAsc,
  Grid,
  List,
  Bookmark,
  Share2,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  PenTool,
  Type,
  Square,
  Circle,
  Triangle,
  Eraser,
  Highlighter,
  Move,
  ZoomIn,
  ZoomOut,
  RotateClockwise,
  FlipHorizontal,
  FlipVertical,
  Copy,
  Cut,
  Clipboard,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Lock,
  Unlock,
  Layers,
  MoreVertical
} from "lucide-react";
import { EnhancedContentLibrary } from "./EnhancedContentLibrary";
import { WhiteboardCanvas } from "../whiteboard/WhiteboardCanvas";

interface UnifiedContentViewerProps {
  isTeacher: boolean;
  studentName: string;
}

interface ContentItem {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'audio' | 'image' | 'text' | 'url';
  url?: string;
  content?: string;
  thumbnail?: string;
  duration?: number;
  size?: number;
  uploadedAt: string;
  tags?: string[];
  level?: string;
}

interface EmbeddedGame {
  id: string;
  title: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isBlocked?: boolean;
}

interface ToolSettings {
  strokeWidth: number;
  opacity: number;
  fontSize: number;
  fontFamily: string;
}

interface MediaPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
}

interface StudentProgress {
  xp: number;
  level: number;
  badges: string[];
  streak: number;
  completedActivities: number;
  totalTimeSpent: number;
}

export function UnifiedContentViewer({ isTeacher, studentName }: UnifiedContentViewerProps) {
  const [activeTab, setActiveTab] = useState("whiteboard");
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newContentTitle, setNewContentTitle] = useState("");
  const [newContentType, setNewContentType] = useState<ContentItem['type']>('text');
  const [newContentUrl, setNewContentUrl] = useState("");
  const [newContentText, setNewContentText] = useState("");
  const [newContentLevel, setNewContentLevel] = useState("");
  const [newContentTags, setNewContentTags] = useState("");
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser" | "text" | "highlighter" | "shape" | "select" | "move">("pencil");
  const [color, setColor] = useState("#000000");
  const [toolSettings, setToolSettings] = useState<ToolSettings>({
    strokeWidth: 2,
    opacity: 1,
    fontSize: 16,
    fontFamily: 'Arial'
  });
  const [activeShape, setActiveShape] = useState<"rectangle" | "circle" | "triangle">("rectangle");
  const [embeddedGames, setEmbeddedGames] = useState<Record<string, EmbeddedGame[]>>({});
  const [activeWhiteboardTab, setActiveWhiteboardTab] = useState("page1");
  
  const [mediaPlayerState, setMediaPlayerState] = useState<MediaPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isFullscreen: false
  });

  const [studentProgress, setStudentProgress] = useState<StudentProgress>({
    xp: 450,
    level: 3,
    badges: ['First Steps', 'Quick Learner'],
    streak: 7,
    completedActivities: 12,
    totalTimeSpent: 180
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);

  const handleSelectContent = (content: ContentItem) => {
    setSelectedContent(content);
    if (content.type === 'video' || content.type === 'audio') {
      setMediaPlayerState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    }
  };

  const handleAddContent = () => {
    if (!newContentTitle) return;

    const newContent: ContentItem = {
      id: Date.now().toString(),
      title: newContentTitle,
      type: newContentType,
      url: newContentUrl || undefined,
      content: newContentText || undefined,
      uploadedAt: new Date().toISOString(),
      level: newContentLevel || undefined,
      tags: newContentTags ? newContentTags.split(',').map(tag => tag.trim()) : undefined
    };

    setContentItems(prev => [newContent, ...prev]);
    setNewContentTitle("");
    setNewContentUrl("");
    setNewContentText("");
    setNewContentLevel("");
    setNewContentTags("");
    setIsUploadDialogOpen(false);
    
    toast.success("Content added successfully!");
  };

  const handleDeleteContent = (content: ContentItem) => {
    setContentItems(prev => prev.filter(item => item.id !== content.id));
    if (selectedContent?.id === content.id) {
      setSelectedContent(null);
    }
    toast.success("Content removed");
  };

  const handlePreviewContent = (content: ContentItem) => {
    setSelectedContent(content);
    setActiveTab("content");
  };

  const handleAddToWhiteboard = (content: ContentItem) => {
    // Logic to add content to whiteboard
    toast.success(`${content.title} added to whiteboard`);
  };

  const handleLoadLesson = (lessonId: string) => {
    // Logic to load a specific lesson
    console.log("Loading lesson:", lessonId);
    setActiveTab("content");
  };

  const awardPoints = (points: number, reason?: string) => {
    setStudentProgress(prev => ({
      ...prev,
      xp: prev.xp + points
    }));
    
    toast.success(`+${points} XP${reason ? ` - ${reason}` : ''}!`);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const downloadCanvas = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'whiteboard.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const toggleMediaPlayback = () => {
    if (mediaRef.current) {
      if (mediaPlayerState.isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setMediaPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    }
  };

  const handleMediaTimeUpdate = () => {
    if (mediaRef.current) {
      setMediaPlayerState(prev => ({
        ...prev,
        currentTime: mediaRef.current!.currentTime,
        duration: mediaRef.current!.duration || 0
      }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentUser = {
    id: isTeacher ? 'teacher-1' : 'student-1',
    role: isTeacher ? 'teacher' as const : 'student' as const,
    name: isTeacher ? 'Teacher' : studentName
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <div className="flex items-center justify-between">
          {/* Student Progress (visible to both teacher and student) */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                {studentProgress.level}
              </div>
              <div>
                <p className="text-sm font-medium">{studentName}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{studentProgress.xp} XP</span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>{studentProgress.streak} day streak</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3 text-xs">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Trophy size={10} className="mr-1" />
                {studentProgress.badges.length} badges
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Target size={10} className="mr-1" />
                {studentProgress.completedActivities} activities
              </Badge>
            </div>
          </div>

          {/* Teacher Controls */}
          {isTeacher && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => awardPoints(10, 'Good work')}
                className="text-xs"
              >
                <Award size={12} className="mr-1" />
                Award +10 XP
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsUploadDialogOpen(true)}
                className="text-xs"
              >
                <Plus size={12} className="mr-1" />
                Add Content
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="whiteboard" className="flex items-center gap-2">
              <Palette size={16} />
              Whiteboard
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <BookOpen size={16} />
              Content
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Sparkles size={16} />
              Library
            </TabsTrigger>
          </TabsList>

          {/* Whiteboard Tab */}
          <TabsContent value="whiteboard" className="flex-1 min-h-0 mt-4">
            <div className="h-full px-4 pb-4">
              <Card className="h-full">
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Whiteboard Toolbar */}
                  <div className="flex items-center justify-between p-3 border-b bg-muted/20">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-background rounded-md p-1">
                        <Button
                          size="sm"
                          variant={activeTool === "pencil" ? "default" : "ghost"}
                          onClick={() => setActiveTool("pencil")}
                          className="h-8 w-8 p-0"
                        >
                          <PenTool size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant={activeTool === "eraser" ? "default" : "ghost"}
                          onClick={() => setActiveTool("eraser")}
                          className="h-8 w-8 p-0"
                        >
                          <Eraser size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant={activeTool === "text" ? "default" : "ghost"}
                          onClick={() => setActiveTool("text")}
                          className="h-8 w-8 p-0"
                        >
                          <Type size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant={activeTool === "highlighter" ? "default" : "ghost"}
                          onClick={() => setActiveTool("highlighter")}
                          className="h-8 w-8 p-0"
                        >
                          <Highlighter size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant={activeTool === "shape" ? "default" : "ghost"}
                          onClick={() => setActiveTool("shape")}
                          className="h-8 w-8 p-0"
                        >
                          <Square size={14} />
                        </Button>
                      </div>

                      <Separator orientation="vertical" className="h-6" />

                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-8 h-8 rounded border cursor-pointer"
                      />

                      <Select value={toolSettings.strokeWidth.toString()} onValueChange={(value) => setToolSettings(prev => ({ ...prev, strokeWidth: parseInt(value) }))}>
                        <SelectTrigger className="w-16 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1px</SelectItem>
                          <SelectItem value="2">2px</SelectItem>
                          <SelectItem value="4">4px</SelectItem>
                          <SelectItem value="8">8px</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={clearCanvas}>
                        <Trash2 size={14} className="mr-1" />
                        Clear
                      </Button>
                      <Button size="sm" variant="outline" onClick={downloadCanvas}>
                        <Download size={14} className="mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>

                  {/* Whiteboard Canvas */}
                  <div className="flex-1 relative bg-white">
                    <WhiteboardCanvas 
                      pageId={activeWhiteboardTab}
                      activeTool={activeTool}
                      color={color}
                      isCollaborative={true}
                      canvasRef={canvasRef}
                    />
                    
                    {/* Render embedded games */}
                    {embeddedGames[activeWhiteboardTab]?.map((game) => (
                      <div
                        key={game.id}
                        className="absolute border-2 border-blue-300 rounded-lg overflow-hidden bg-white shadow-lg"
                        style={{
                          left: game.x,
                          top: game.y,
                          width: game.width,
                          height: game.height
                        }}
                      >
                        <div className="flex items-center justify-between p-2 bg-blue-50 border-b text-xs">
                          <span className="font-medium truncate">{game.title}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEmbeddedGames(prev => ({
                                ...prev,
                                [activeWhiteboardTab]: prev[activeWhiteboardTab]?.filter(g => g.id !== game.id) || []
                              }));
                            }}
                            className="h-5 w-5 p-0 hover:bg-red-100"
                          >
                            <X size={10} />
                          </Button>
                        </div>
                        {game.isBlocked ? (
                          <div className="h-full flex items-center justify-center bg-gray-50 text-gray-500 text-sm">
                            Content blocked by browser
                          </div>
                        ) : (
                          <iframe
                            src={game.url}
                            className="w-full h-full border-0"
                            onError={() => {
                              setEmbeddedGames(prev => ({
                                ...prev,
                                [activeWhiteboardTab]: prev[activeWhiteboardTab]?.map(g => 
                                  g.id === game.id ? { ...g, isBlocked: true } : g
                                ) || []
                              }));
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Whiteboard Tabs */}
                  <div className="flex items-center justify-center p-2 border-t bg-muted/20">
                    <div className="flex items-center gap-1">
                      {['page1', 'page2', 'page3'].map((pageId) => (
                        <Button
                          key={pageId}
                          size="sm"
                          variant={activeWhiteboardTab === pageId ? "default" : "ghost"}
                          onClick={() => setActiveWhiteboardTab(pageId)}
                          className="h-8 px-3 text-xs"
                        >
                          Page {pageId.slice(-1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="flex-1 min-h-0 mt-4">
            <div className="h-full px-4 pb-4">
              {selectedContent ? (
                <Card className="h-full">
                  <CardContent className="p-0 h-full flex flex-col">
                    {/* Content Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedContent(null)}
                        >
                          <ArrowLeft size={16} />
                        </Button>
                        <div>
                          <h3 className="font-semibold">{selectedContent.title}</h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {selectedContent.type} • {selectedContent.level}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isTeacher && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteContent(selectedContent)}
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Download size={14} className="mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Content Display */}
                    <div className="flex-1 p-4 overflow-auto">
                      {selectedContent.type === 'video' && selectedContent.url && (
                        <div className="space-y-4">
                          <video
                            ref={mediaRef as React.RefObject<HTMLVideoElement>}
                            src={selectedContent.url}
                            className="w-full rounded-lg"
                            onTimeUpdate={handleMediaTimeUpdate}
                            onLoadedMetadata={handleMediaTimeUpdate}
                          />
                          
                          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={toggleMediaPlayback}
                              className="h-8 w-8 p-0"
                            >
                              {mediaPlayerState.isPlaying ? <Pause size={16} /> : <Play size={16} />}
                            </Button>
                            
                            <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-1">
                                <div 
                                  className="bg-blue-600 h-1 rounded-full transition-all"
                                  style={{ 
                                    width: `${mediaPlayerState.duration > 0 ? (mediaPlayerState.currentTime / mediaPlayerState.duration) * 100 : 0}%` 
                                  }}
                                />
                              </div>
                            </div>
                            
                            <span className="text-xs text-muted-foreground">
                              {formatTime(mediaPlayerState.currentTime)} / {formatTime(mediaPlayerState.duration)}
                            </span>
                          </div>
                        </div>
                      )}

                      {selectedContent.type === 'audio' && selectedContent.url && (
                        <div className="space-y-4">
                          <div className="p-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg text-center">
                            <Music size={48} className="mx-auto mb-4 text-purple-600" />
                            <h4 className="font-medium">{selectedContent.title}</h4>
                          </div>
                          
                          <audio
                            ref={mediaRef as React.RefObject<HTMLAudioElement>}
                            src={selectedContent.url}
                            onTimeUpdate={handleMediaTimeUpdate}
                            onLoadedMetadata={handleMediaTimeUpdate}
                          />
                          
                          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={toggleMediaPlayback}
                              className="h-8 w-8 p-0"
                            >
                              {mediaPlayerState.isPlaying ? <Pause size={16} /> : <Play size={16} />}
                            </Button>
                            
                            <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-1">
                                <div 
                                  className="bg-blue-600 h-1 rounded-full transition-all"
                                  style={{ 
                                    width: `${mediaPlayerState.duration > 0 ? (mediaPlayerState.currentTime / mediaPlayerState.duration) * 100 : 0}%` 
                                  }}
                                />
                              </div>
                            </div>
                            
                            <span className="text-xs text-muted-foreground">
                              {formatTime(mediaPlayerState.currentTime)} / {formatTime(mediaPlayerState.duration)}
                            </span>
                          </div>
                        </div>
                      )}

                      {selectedContent.type === 'image' && selectedContent.url && (
                        <div className="text-center">
                          <img 
                            src={selectedContent.url} 
                            alt={selectedContent.title}
                            className="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
                          />
                        </div>
                      )}

                      {selectedContent.type === 'text' && selectedContent.content && (
                        <div className="prose max-w-none">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {selectedContent.content}
                          </div>
                        </div>
                      )}

                      {selectedContent.type === 'url' && selectedContent.url && (
                        <div className="h-full">
                          <iframe 
                            src={selectedContent.url}
                            className="w-full h-full border-0 rounded-lg"
                            title={selectedContent.title}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No Content Selected</h3>
                    <p className="text-muted-foreground mb-4">
                      Choose content from the library or upload new materials
                    </p>
                    {isTeacher && (
                      <Button onClick={() => setIsUploadDialogOpen(true)}>
                        <Plus size={16} className="mr-2" />
                        Add Content
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library" className="flex-1 min-h-0 mt-4">
            <div className="h-full px-4 pb-4">
              <EnhancedContentLibrary
                contentItems={contentItems}
                selectedContent={selectedContent}
                onSelectContent={handleSelectContent}
                onPreviewFile={handlePreviewContent}
                onDeleteFile={handleDeleteContent}
                onAddToWhiteboard={handleAddToWhiteboard}
                onLoadLesson={handleLoadLesson}
                currentUser={currentUser}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Content</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newContentTitle}
                onChange={(e) => setNewContentTitle(e.target.value)}
                placeholder="Enter content title..."
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={newContentType} onValueChange={(value: ContentItem['type']) => setNewContentType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="url">Website/URL</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newContentType !== 'text' && (
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={newContentUrl}
                  onChange={(e) => setNewContentUrl(e.target.value)}
                  placeholder="Enter URL..."
                />
              </div>
            )}

            {newContentType === 'text' && (
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newContentText}
                  onChange={(e) => setNewContentText(e.target.value)}
                  placeholder="Enter text content..."
                  rows={4}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="level">Level (optional)</Label>
                <Select value={newContentLevel} onValueChange={setNewContentLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A1">A1 - Beginner</SelectItem>
                    <SelectItem value="A2">A2 - Elementary</SelectItem>
                    <SelectItem value="B1">B1 - Intermediate</SelectItem>
                    <SelectItem value="B2">B2 - Upper-Intermediate</SelectItem>
                    <SelectItem value="C1">C1 - Advanced</SelectItem>
                    <SelectItem value="C2">C2 - Proficient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">Tags (optional)</Label>
                <Input
                  id="tags"
                  value={newContentTags}
                  onChange={(e) => setNewContentTags(e.target.value)}
                  placeholder="grammar, vocabulary..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddContent}>
                Add Content
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
