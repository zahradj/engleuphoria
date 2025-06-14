
import { useState, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

export function useGamePosition(initialPosition: Position, initialSize: Size) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);

  // Ensure content fits within whiteboard bounds
  const adjustToWhiteboardBounds = () => {
    const whiteboardElement = document.querySelector('.whiteboard-container');
    if (!whiteboardElement) return;

    const whiteboardRect = whiteboardElement.getBoundingClientRect();
    const maxWidth = whiteboardRect.width - 40; // Leave some padding
    const maxHeight = whiteboardRect.height - 100; // Account for toolbar

    // Adjust size to fit within whiteboard
    const adjustedWidth = Math.min(size.width, maxWidth);
    const adjustedHeight = Math.min(size.height, maxHeight);

    // Adjust position to stay within bounds
    const adjustedX = Math.max(20, Math.min(position.x, maxWidth - adjustedWidth));
    const adjustedY = Math.max(20, Math.min(position.y, maxHeight - adjustedHeight));

    setSize({ width: adjustedWidth, height: adjustedHeight });
    setPosition({ x: adjustedX, y: adjustedY });
  };

  useEffect(() => {
    adjustToWhiteboardBounds();
    window.addEventListener('resize', adjustToWhiteboardBounds);
    return () => window.removeEventListener('resize', adjustToWhiteboardBounds);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Constrain to whiteboard bounds
      const whiteboardElement = document.querySelector('.whiteboard-container');
      if (whiteboardElement) {
        const whiteboardRect = whiteboardElement.getBoundingClientRect();
        const maxX = whiteboardRect.width - size.width - 20;
        const maxY = whiteboardRect.height - size.height - 80;
        
        setPosition({
          x: Math.max(20, Math.min(newX, maxX)),
          y: Math.max(20, Math.min(newY, maxY))
        });
      } else {
        setPosition({ x: newX, y: newY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, size]);

  return {
    position,
    size,
    handleMouseDown
  };
}
