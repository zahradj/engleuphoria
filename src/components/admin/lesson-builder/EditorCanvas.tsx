import React from 'react';
import { CanvasEditor } from './canvas/CanvasEditor';
import { Slide } from './types';

interface EditorCanvasProps {
  slide: Slide | null;
  onUpdateSlide: (updates: Partial<Slide>) => void;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({ slide, onUpdateSlide }) => {
  return <CanvasEditor slide={slide} onUpdateSlide={onUpdateSlide} />;
};
