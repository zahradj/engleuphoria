import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SlidesPanel } from './SlidesPanel';
import { CanvaStyleToolbar } from './CanvaStyleToolbar';
import { EmbedLinksManager } from './EmbedLinksManager';
import { ActivitiesLibrary } from './ActivitiesLibrary';
import { CollaborationLayer } from './CollaborationLayer';
import { useCanvaStyleBoard } from './useCanvaStyleBoard';
import { 
  Move, 
  PenTool, 
  Type, 
  Square, 
  Circle, 
  Image, 
  Sticker, 
  Link2,
  Layers,
  Lock,
  Unlock,
  Copy,
  Trash2,
  ZoomIn,
  ZoomOut,
  Grid,
  Settings,
  Users,
  MessageCircle,
  Heart,
  Star,
  ThumbsUp,
  Download,
  Upload,
  Undo,
  Redo
} from 'lucide-react';

interface CanvaStyleWhiteboardProps {
  isTeacher: boolean;
  roomId: string;
  currentUser: {
    id: string;
    name: string;
    role: 'teacher' | 'student';
  };
  embeddedContent?: any[];
  onAddContent?: (content: any) => void;
}

export function CanvaStyleWhiteboard({
  isTeacher,
  roomId,
  currentUser,
  embeddedContent = [],
  onAddContent
}: CanvaStyleWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [selectedColor, setSelectedColor] = useState('#2563eb');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [zoom, setZoom] = useState(1);
  const [panelVisible, setPanelVisible] = useState({ slides: true, activities: false });
  const [panelSide, setPanelSide] = useState<'left' | 'right'>('right');
  const [showGrid, setShowGrid] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  const {
    elements,
    selectedElements,
    currentSlide,
    slides,
    cursors,
    comments,
    addElement,
    selectElement,
    deleteElement,
    duplicateElement,
    moveElement,
    addSlide,
    setCurrentSlide: updateCurrentSlide,
    addComment,
    addReaction,
    undo,
    redo,
    canUndo,
    canRedo,
    exportBoard,
    importContent
  } = useCanvaStyleBoard(roomId, currentUser);

  // Canvas drawing logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool === 'select' || selectedTool === 'move' || isLocked) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    if (selectedTool === 'pen' || selectedTool === 'highlighter') {
      addElement({
        type: selectedTool,
        points: [{ x, y }],
        color: selectedColor,
        strokeWidth: selectedTool === 'highlighter' ? strokeWidth * 2 : strokeWidth,
        opacity: selectedTool === 'highlighter' ? 0.5 : 1
      });
    } else if (selectedTool === 'text') {
      addElement({
        type: 'text',
        x,
        y,
        text: 'Click to edit',
        color: selectedColor,
        fontSize: 16,
        fontFamily: 'Inter'
      });
    } else if (selectedTool === 'shape') {
      addElement({
        type: 'rectangle',
        x,
        y,
        width: 100,
        height: 80,
        fillColor: selectedColor,
        strokeColor: '#000000',
        strokeWidth: 2
      });
    }
  };

  // Tool configurations
  const tools = [
    { id: 'select', icon: Move, label: 'Select', shortcut: 'V' },
    { id: 'pen', icon: PenTool, label: 'Pen', shortcut: 'P' },
    { id: 'text', icon: Type, label: 'Text', shortcut: 'T' },
    { id: 'rectangle', icon: Square, label: 'Rectangle', shortcut: 'R' },
    { id: 'circle', icon: Circle, label: 'Circle', shortcut: 'O' },
    { id: 'image', icon: Image, label: 'Image', shortcut: 'I' },
    { id: 'sticker', icon: Sticker, label: 'Stickers', shortcut: 'S' },
    { id: 'link', icon: Link2, label: 'Link', shortcut: 'L' }
  ];

  const colors = [
    '#2563eb', '#dc2626', '#16a34a', '#ca8a04', 
    '#9333ea', '#c2410c', '#0891b2', '#be123c',
    '#000000', '#6b7280', '#ffffff', '#f3f4f6'
  ];

  const reactions = [
    { icon: ThumbsUp, label: 'Like' },
    { icon: Heart, label: 'Love' },
    { icon: Star, label: 'Star' },
    { icon: MessageCircle, label: 'Comment' }
  ];

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Panel */}
      {panelSide === 'left' && panelVisible.slides && (
        <div className="w-80 border-r bg-white">
          <SlidesPanel
            slides={slides}
            currentSlide={currentSlide}
            onSlideSelect={updateCurrentSlide}
            onAddSlide={addSlide}
            onAddToBoard={onAddContent}
            isTeacher={isTeacher}
          />
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <Card className="m-4 mb-2">
          <div className="p-4">
            <div className="flex items-center justify-between">
              {/* Left Toolbar */}
              <div className="flex items-center gap-2">
                {/* Main Tools */}
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  {tools.slice(0, 4).map((tool) => (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedTool(tool.id)}
                      title={`${tool.label} (${tool.shortcut})`}
                    >
                      <tool.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>

                <Separator orientation="vertical" className="h-8" />

                {/* Shape Tools */}
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  {tools.slice(4, 6).map((tool) => (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedTool(tool.id)}
                      title={`${tool.label} (${tool.shortcut})`}
                    >
                      <tool.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>

                <Separator orientation="vertical" className="h-8" />

                {/* Media Tools */}
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  {tools.slice(6).map((tool) => (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedTool(tool.id)}
                      title={`${tool.label} (${tool.shortcut})`}
                    >
                      <tool.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>

                <Separator orientation="vertical" className="h-8" />

                {/* Color Picker */}
                <div className="flex items-center gap-1">
                  <div className="grid grid-cols-6 gap-1 border rounded-lg p-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded border-2 ${
                          selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Center - Slide Navigation */}
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  Slide {currentSlide + 1} of {slides.length}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateCurrentSlide(Math.max(0, currentSlide - 1))}
                  disabled={currentSlide === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                  disabled={currentSlide === slides.length - 1}
                >
                  Next
                </Button>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                {/* History */}
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={undo}
                    disabled={!canUndo}
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={redo}
                    disabled={!canRedo}
                    title="Redo (Ctrl+Y)"
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                </div>

                <Separator orientation="vertical" className="h-8" />

                {/* View Controls */}
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                    title="Zoom In"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <span className="px-2 text-sm font-medium">{Math.round(zoom * 100)}%</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant={showGrid ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowGrid(!showGrid)}
                  title="Toggle Grid"
                >
                  <Grid className="h-4 w-4" />
                </Button>

                {/* Teacher Controls */}
                {isTeacher && (
                  <>
                    <Separator orientation="vertical" className="h-8" />
                    <Button
                      variant={isLocked ? "destructive" : "ghost"}
                      size="sm"
                      onClick={() => setIsLocked(!isLocked)}
                      title={isLocked ? "Unlock Board" : "Lock Board"}
                    >
                      {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Export Board"
                      onClick={exportBoard}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Collaboration */}
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" title="Show Collaborators">
                    <Users className="h-4 w-4" />
                    <span className="ml-1 text-xs">{Object.keys(cursors).length + 1}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Embed Links Manager */}
        <Card className="mx-4 mb-2">
          <EmbedLinksManager onAddEmbed={onAddContent} />
        </Card>

        {/* Main Canvas */}
        <div className="flex-1 mx-4 mb-4 relative">
          <Card className="h-full relative overflow-hidden">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-crosshair"
              style={{ 
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                backgroundImage: showGrid ? 
                  'radial-gradient(circle, #d1d5db 1px, transparent 1px)' : 'none',
                backgroundSize: showGrid ? '20px 20px' : 'auto'
              }}
              onMouseDown={startDrawing}
            />
            
            {/* Embedded Content Layer */}
            {embeddedContent.map((content) => (
              <div
                key={content.id}
                className="absolute border-2 border-blue-400 rounded-lg overflow-hidden"
                style={{
                  left: content.x * zoom,
                  top: content.y * zoom,
                  width: content.width * zoom,
                  height: content.height * zoom,
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left'
                }}
              >
                {content.url && (
                  <iframe
                    src={content.url}
                    className="w-full h-full border-none"
                    title={content.title}
                  />
                )}
              </div>
            ))}

            {/* Collaboration Layer */}
            <CollaborationLayer 
              cursors={cursors}
              comments={comments}
              zoom={zoom}
              onAddComment={addComment}
            />

            {/* Reactions */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              {reactions.map((reaction) => (
                <Button
                  key={reaction.label}
                  variant="outline"
                  size="sm"
                  className="bg-white/90 backdrop-blur-sm"
                  onClick={() => addReaction(reaction.label)}
                  title={reaction.label}
                >
                  <reaction.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Right Panel */}
      {panelSide === 'right' && panelVisible.slides && (
        <div className="w-80 border-l bg-white">
          <SlidesPanel
            slides={slides}
            currentSlide={currentSlide}
            onSlideSelect={updateCurrentSlide}
            onAddSlide={addSlide}
            onAddToBoard={onAddContent}
            isTeacher={isTeacher}
          />
        </div>
      )}

      {/* Activities Panel (overlay) */}
      {panelVisible.activities && (
        <ActivitiesLibrary
          isVisible={panelVisible.activities}
          onClose={() => setPanelVisible(prev => ({ ...prev, activities: false }))}
          onAddActivity={onAddContent}
          isTeacher={isTeacher}
        />
      )}
    </div>
  );
}