import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SlidesPanel, type Slide } from './SlidesPanel';
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
  const [panelVisible, setPanelVisible] = useState({ slides: true, activities: false });
  const [panelSide, setPanelSide] = useState<'left' | 'right'>('right');
  const [showComments, setShowComments] = useState(false);

  const {
    elements,
    selectedElements,
    activeTool,
    setActiveTool,
    color,
    setColor,
    zoom,
    setZoom,
    showGrid,
    setShowGrid,
    boardSlides,
    slidesPanel,
    setSlidesPanel,
    currentSlide,
    cursors,
    comments,
    addElement,
    selectElement,
    deleteElement,
    duplicateElement,
    moveElement,
    addSlide,
    setCurrentSlide,
    addComment,
    addReaction,
    undo,
    redo,
    canUndo,
    canRedo,
    exportBoard,
    importContent
  } = useCanvaStyleBoard(currentUser);

  // Canvas drawing logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'select' || activeTool === 'move') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    if (activeTool === 'pen' || activeTool === 'highlighter') {
      addElement({
        type: activeTool as any,
        points: [{ x, y }],
        color: selectedColor,
        strokeWidth: activeTool === 'highlighter' ? strokeWidth * 2 : strokeWidth,
        opacity: activeTool === 'highlighter' ? 0.5 : 1
      });
    } else if (activeTool === 'text') {
      addElement({
        type: 'text',
        x,
        y,
        text: 'Click to edit',
        color: selectedColor,
        fontSize: 16,
        fontFamily: 'Inter'
      });
    } else if (activeTool === 'rectangle' || activeTool === 'circle') {
      addElement({
        type: activeTool as any,
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
    <div className="flex h-full bg-background">
      {/* Left Panel */}
      {panelSide === 'left' && panelVisible.slides && (
        <div className="w-80 border-r bg-card">
          <SlidesPanel
            slides={slidesPanel}
            currentSlide={currentSlide}
            onSlideSelect={setCurrentSlide}
            onAddSlide={(slide) => {
              setSlidesPanel(prev => [...prev, { ...slide, id: `slide-${Date.now()}` }]);
            }}
            onAddToBoard={onAddContent}
            isTeacher={isTeacher}
          />
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <CanvaStyleToolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          zoom={zoom}
          setZoom={setZoom}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onExport={exportBoard}
          onImport={() => {}}
          selectedElements={selectedElements}
          onLockElements={() => {}}
          onUnlockElements={() => {}}
          onDuplicateElements={() => duplicateElement()}
          onDeleteElements={() => deleteElement()}
        />

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
                  'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)' : 'none',
                backgroundSize: showGrid ? '20px 20px' : 'auto'
              }}
              onMouseDown={startDrawing}
            />
            
            {/* Embedded Content Layer */}
            {embeddedContent.map((content) => (
              <div
                key={content.id}
                className="absolute border-2 border-primary rounded-lg overflow-hidden"
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
                  className="bg-background/90 backdrop-blur-sm"
                  onClick={() => setShowComments(!showComments)}
                  title={reaction.label}
                >
                  <reaction.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            {/* Comments Panel */}
            {showComments && (
              <div className="absolute top-4 right-4 w-80 max-h-96 bg-card border rounded-lg shadow-lg p-4 overflow-y-auto">
                <h3 className="font-semibold mb-3">Comments</h3>
                {comments.map((comment) => (
                  <div key={comment.id} className="mb-3 p-2 bg-muted rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{comment.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {comment.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{comment.content}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addReaction(comment.id, '👍')}
                        className="p-1 hover:bg-muted rounded"
                      >
                        👍 {comment.reactions.filter(r => r.type === '👍').length}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Right Panel */}
      {panelSide === 'right' && panelVisible.slides && (
        <div className="w-80 border-l bg-card">
          <SlidesPanel
            slides={slidesPanel}
            currentSlide={currentSlide}
            onSlideSelect={setCurrentSlide}
            onAddSlide={(slide) => {
              setSlidesPanel(prev => [...prev, { ...slide, id: `slide-${Date.now()}` }]);
            }}
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