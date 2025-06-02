
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SimpleWhiteboardToolbar } from "@/components/whiteboard/SimpleWhiteboardToolbar";
import { SimpleWhiteboardCanvas } from "@/components/whiteboard/SimpleWhiteboardCanvas";
import { useSimpleWhiteboard } from "@/components/whiteboard/useSimpleWhiteboard";

const WhiteboardPage = () => {
  const navigate = useNavigate();
  const {
    isDrawing,
    setIsDrawing,
    tool,
    setTool,
    color,
    setColor,
    canvasRef,
    clearCanvas,
    downloadCanvas,
    handleCanvasClick,
    isAddingText,
    textPosition,
    textContent,
    setTextContent,
    textInputRef,
    addTextToCanvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useSimpleWhiteboard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Interactive Whiteboard</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <SimpleWhiteboardToolbar
            tool={tool}
            setTool={setTool}
            color={color}
            setColor={setColor}
            clearCanvas={clearCanvas}
            downloadCanvas={downloadCanvas}
          />
          
          <SimpleWhiteboardCanvas
            canvasRef={canvasRef}
            isDrawing={isDrawing}
            setIsDrawing={setIsDrawing}
            tool={tool}
            color={color}
            handleCanvasClick={handleCanvasClick}
            isAddingText={isAddingText}
            textPosition={textPosition}
            textContent={textContent}
            setTextContent={setTextContent}
            textInputRef={textInputRef}
            addTextToCanvas={addTextToCanvas}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
          />
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Activity: Draw and Learn</h3>
            <p className="text-blue-700 mb-3">Use the whiteboard to complete this fun activity:</p>
            <ul className="text-blue-600 space-y-1">
              <li>• Draw an animal you learned about today</li>
              <li>• Write the animal's name in English</li>
              <li>• Draw what this animal eats</li>
            </ul>
            <Button className="mt-4 bg-blue-500 hover:bg-blue-600">
              Submit Activity
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardPage;
