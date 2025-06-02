
import React from "react";
import { SimpleWhiteboardCanvas } from "@/components/whiteboard/SimpleWhiteboardCanvas";
import { SimpleWhiteboardToolbar } from "@/components/whiteboard/SimpleWhiteboardToolbar";
import { useSimpleWhiteboard } from "@/components/whiteboard/useSimpleWhiteboard";
// Removed broken StudentHeader import

const WhiteboardPage = () => {
  const {
    tool,
    color,
    strokeWidth,
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    setTool,
    setColor,
    setStrokeWidth,
  } = useSimpleWhiteboard();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Interactive Whiteboard</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <SimpleWhiteboardToolbar
            tool={tool}
            color={color}
            strokeWidth={strokeWidth}
            onToolChange={setTool}
            onColorChange={setColor}
            onStrokeWidthChange={setStrokeWidth}
            onClear={clearCanvas}
          />
          
          <SimpleWhiteboardCanvas
            canvasRef={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
};

export default WhiteboardPage;
