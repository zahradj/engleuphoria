import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Move, 
  PenTool, 
  Type, 
  Square, 
  Circle, 
  Image, 
  Sticker, 
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Grid,
  Download,
  Upload,
  Layers,
  Lock,
  Unlock,
  Copy,
  Trash2
} from 'lucide-react';

export interface CanvaStyleToolbarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onImport: () => void;
  selectedElements: any[];
  onLockElements: () => void;
  onUnlockElements: () => void;
  onDuplicateElements: () => void;
  onDeleteElements: () => void;
}

export function CanvaStyleToolbar({
  activeTool,
  setActiveTool,
  zoom,
  setZoom,
  showGrid,
  setShowGrid,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onExport,
  onImport,
  selectedElements,
  onLockElements,
  onUnlockElements,
  onDuplicateElements,
  onDeleteElements
}: CanvaStyleToolbarProps) {
  const tools = [
    { id: 'select', icon: Move, label: 'Select' },
    { id: 'pen', icon: PenTool, label: 'Pen' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'image', icon: Image, label: 'Image' },
    { id: 'sticker', icon: Sticker, label: 'Sticker' }
  ];

  return (
    <div className="flex items-center gap-2 p-3 bg-background border-b">
      {/* Main Tools */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTool(tool.id)}
              title={tool.label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* History Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Badge variant="secondary" className="min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoom(Math.min(3, zoom + 0.1))}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* View Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant={showGrid ? "default" : "ghost"}
          size="sm"
          onClick={() => setShowGrid(!showGrid)}
          title="Toggle Grid"
        >
          <Grid className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Selection Actions */}
      {selectedElements.length > 0 && (
        <>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLockElements}
              title="Lock Selected"
            >
              <Lock className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onUnlockElements}
              title="Unlock Selected"
            >
              <Unlock className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDuplicateElements}
              title="Duplicate Selected"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDeleteElements}
              title="Delete Selected"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-6" />
        </>
      )}

      {/* File Operations */}
      <div className="flex items-center gap-1 ml-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={onImport}
          title="Import"
        >
          <Upload className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          title="Export"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}