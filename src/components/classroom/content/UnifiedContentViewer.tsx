
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw,
  Scissors,
  Download,
  FileText,
  Image,
  Video,
  Headphones,
  BookOpen,
  PenTool,
  Eraser,
  Type,
  Highlighter,
  Square,
  Circle,
  Palette,
  Trash2,
  Save,
  Upload,
  ZoomIn,
  ZoomOut,
  Move,
  MousePointer2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { WhiteboardCanvas } from "@/components/classroom/whiteboard/WhiteboardCanvas";

interface ContentProps {
  title: string;
  description: string;
  type: "video" | "audio" | "document" | "whiteboard";
  url?: string;
  pages?: number;
}

interface UnifiedContentViewerProps {
  content?: ContentProps;
  isAnnotationMode?: boolean;
  onAnnotationToggle?: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isTeacher?: boolean;
  studentName?: string;
}

export function UnifiedContentViewer({ 
  content = {
    title: "Interactive Whiteboard",
    description: "Collaborative whiteboard for teaching",
    type: "whiteboard"
  },
  isAnnotationMode = false, 
  onAnnotationToggle = () => {},
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  isTeacher = false,
  studentName = "Student"
}: UnifiedContentViewerProps) {
  const { languageText } = useLanguage();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  
  // Annotation states
  const [annotationTool, setAnnotationTool] = useState<"pencil" | "eraser" | "highlighter">("pencil");
  const [annotationColor, setAnnotationColor] = useState("#9B87F5");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseInt(event.target.value));
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? 100 : 0);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getContentIcon = () => {
    switch (content.type) {
      case "video":
        return <Video className="h-5 w-5 text-blue-500" />;
      case "audio":
        return <Headphones className="h-5 w-5 text-green-500" />;
      case "document":
        return <FileText className="h-5 w-5 text-orange-500" />;
      case "whiteboard":
        return <PenTool className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const renderMediaControls = () => (
    <div className="p-4 border-t bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handlePlayPause}>
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleMuteToggle}>
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            className="w-24"
            onChange={handleVolumeChange}
          />
          <span className="text-sm text-gray-500">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleFullscreenToggle}>
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        className="w-full mt-2"
        onChange={handleTimeUpdate}
      />
    </div>
  );

  const renderMediaViewer = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        {content.type === "video" ? (
          <video
            src={content.url}
            controls={false}
            muted={isMuted}
            className="max-h-full max-w-full"
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          />
        ) : (
          <audio
            src={content.url}
            controls={false}
            muted={isMuted}
            className="max-h-full max-w-full"
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          />
        )}
      </div>
      {renderMediaControls()}
    </div>
  );

  const renderDocumentViewer = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-4 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>Document Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              This is where the document content would be displayed. You can use
              iframes or other components to render PDFs, images, or other
              document formats.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAnnotationToolbar = () => (
    <div className="flex items-center gap-2 p-2 bg-muted/20 border-b flex-wrap">
      <div className="flex items-center gap-2">
        <Button 
          variant={annotationTool === "pencil" ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => setAnnotationTool("pencil")}
          className="h-8 px-2"
        >
          <PenTool size={14} className="mr-1" />
          {languageText.draw || "Draw"}
        </Button>
        <Button 
          variant={annotationTool === "highlighter" ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => setAnnotationTool("highlighter")}
          className="h-8 px-2"
        >
          <Highlighter size={14} className="mr-1" />
          {languageText.highlight || "Highlight"}
        </Button>
        <Button 
          variant={annotationTool === "eraser" ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => setAnnotationTool("eraser")}
          className="h-8 px-2"
        >
          <Eraser size={14} className="mr-1" />
          {languageText.erase || "Erase"}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {/* Handle clear */}}
          className="h-8 px-2"
        >
          <Trash2 size={14} className="mr-1" />
          {languageText.clear || "Clear"}
        </Button>
      </div>
      
      <div className="flex items-center gap-2 ml-auto">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {/* Handle save */}}
          className="h-8 px-2"
        >
          <Save size={14} className="mr-1" />
          {languageText.save || "Save"}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {/* Handle load */}}
          className="h-8 px-2"
        >
          <Upload size={14} className="mr-1" />
          {languageText.upload || "Load"}
        </Button>
      </div>
      
      <div className="flex items-center gap-1 ml-2">
        {["#9B87F5", "#14B8A6", "#F97316", "#FACC15", "#000000"].map((color) => (
          <div
            key={color}
            className={`w-5 h-5 rounded-full cursor-pointer ${
              annotationColor === color ? "ring-2 ring-offset-1 ring-gray-400" : ""
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setAnnotationColor(color)}
          />
        ))}
      </div>
    </div>
  );

  const renderWhiteboardMode = () => (
    <div className="h-full flex flex-col bg-white rounded-lg border overflow-hidden">
      {isAnnotationMode && renderAnnotationToolbar()}
      
      <div className="flex-1 relative">
        <WhiteboardCanvas
          pageId="unified-viewer"
          activeTool={annotationTool}
          color={annotationColor}
          isCollaborative={true}
          canvasRef={(el) => {
            if (el && canvasRef.current !== el) {
              canvasRef.current = el;
            }
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          {getContentIcon()}
          <div>
            <h3 className="font-semibold text-gray-900">{content.title}</h3>
            <p className="text-sm text-gray-600">{content.description}</p>
          </div>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {content.type}
        </Badge>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isAnnotationMode ? "secondary" : "outline"}
            size="sm"
            onClick={onAnnotationToggle}
          >
            <PenTool className="h-4 w-4 mr-2" />
            {isAnnotationMode ? languageText.exitAnnotation : languageText.annotate}
          </Button>
          
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-2">{zoom}%</span>
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 10))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 relative">
        {content.type === "whiteboard" ? (
          renderWhiteboardMode()
        ) : content.type === "video" || content.type === "audio" ? (
          renderMediaViewer()
        ) : (
          renderDocumentViewer()
        )}
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t bg-white flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
