
import { SimpleWhiteboardToolbar } from "./whiteboard/SimpleWhiteboardToolbar";
import { SimpleWhiteboardCanvas } from "./whiteboard/SimpleWhiteboardCanvas";
import { useSimpleWhiteboard } from "./whiteboard/useSimpleWhiteboard";

interface WhiteboardProps {
  className?: string;
}

export function Whiteboard({ className = "" }: WhiteboardProps) {
  const {
    isDrawing,
    setIsDrawing,
    tool,
    setTool,
    color,
    setColor,
    canvasRef,
    clearCanvas,
    downloadCanvas
  } = useSimpleWhiteboard();
  
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
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
      />
    </div>
  );
}
