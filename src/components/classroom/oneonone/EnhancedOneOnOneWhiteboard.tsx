import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WhiteboardCanvas } from "./whiteboard/WhiteboardCanvas";
import { WhiteboardToolbar } from "./whiteboard/WhiteboardToolbar";
import { WhiteboardTabsSection } from "./whiteboard/WhiteboardTabsSection";
import { EmbeddedGame } from "./whiteboard/EmbeddedGame";
import { EmbedLinkDialog } from "./whiteboard/EmbedLinkDialog";
import { EmbeddedGameDialog } from "./whiteboard/EmbeddedGameDialog";
import { useWhiteboardState } from "./whiteboard/useWhiteboardState";
import { useEmbeddedGameState } from "./whiteboard/useEmbeddedGameState";
import { useGamePosition } from "./whiteboard/useGamePosition";
import { Palette, Users, Sparkles, Link } from "lucide-react";

interface EnhancedOneOnOneWhiteboardProps {
  currentUser?: {
    role: 'teacher' | 'student';
    name: string;
  };
}

export function EnhancedOneOnOneWhiteboard({ 
  currentUser = { role: 'teacher', name: 'Teacher' }
}: EnhancedOneOnOneWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);
  const [showGameDialog, setShowGameDialog] = useState(false);
  
  const {
    tool,
    color,
    strokeWidth,
    setTool,
    setColor,
    setStrokeWidth,
    clearCanvas,
    undo,
    redo,
    canUndo,
    canRedo
  } = useWhiteboardState(canvasRef);

  const {
    embeddedGame,
    showGame,
    addEmbeddedGame,
    removeEmbeddedGame,
    isGameFullscreen,
    toggleGameFullscreen
  } = useEmbeddedGameState();

  const { position, size, handleMouseDown } = useGamePosition(
    { x: 100, y: 100 },
    { width: 600, height: 400 }
  );

  const isTeacher = currentUser.role === 'teacher';

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm overflow-hidden whiteboard-container">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Palette size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Interactive Whiteboard</h2>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <Users size={12} className="mr-1" />
            Live
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {isTeacher ? 'Teaching Mode' : 'Learning Mode'}
          </Badge>
          {isTeacher && (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowEmbedDialog(true)}
                className="text-xs"
              >
                <Link size={12} className="mr-1" />
                Link
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowGameDialog(true)}
                className="text-xs"
              >
                <Sparkles size={12} className="mr-1" />
                Game
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <WhiteboardToolbar 
        tool={tool}
        color={color}
        strokeWidth={strokeWidth}
        onToolChange={setTool}
        onColorChange={setColor}
        onStrokeWidthChange={setStrokeWidth}
        onClear={clearCanvas}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        currentUser={currentUser}
      />

      <Separator />

      {/* Main Content */}
      <div className="flex-1 relative bg-white overflow-hidden">
        <WhiteboardCanvas 
          ref={canvasRef}
          tool={tool}
          color={color}
          strokeWidth={strokeWidth}
          isDrawing={isDrawing}
          setIsDrawing={setIsDrawing}
        />
        
        {/* Embedded Game Overlay */}
        {embeddedGame && showGame && (
          <EmbeddedGame
            game={embeddedGame}
            position={position}
            size={size}
            onMouseDown={handleMouseDown}
            onRemove={removeEmbeddedGame}
            isFullscreen={isGameFullscreen}
            onToggleFullscreen={toggleGameFullscreen}
            currentUser={currentUser}
          />
        )}
      </div>

      {/* Tabs Section */}
      <WhiteboardTabsSection currentUser={currentUser} />

      {/* Dialogs */}
      <EmbedLinkDialog 
        open={showEmbedDialog}
        onOpenChange={setShowEmbedDialog}
      />
      
      <EmbeddedGameDialog
        open={showGameDialog}
        onOpenChange={setShowGameDialog}
        onAddGame={addEmbeddedGame}
      />
    </div>
  );
}
