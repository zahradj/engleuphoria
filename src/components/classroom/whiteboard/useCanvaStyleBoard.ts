import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { type Slide as SlidesPanelSlide } from './SlidesPanel';

interface BoardElement {
  id: string;
  type: 'pen' | 'highlighter' | 'text' | 'rectangle' | 'circle' | 'image' | 'embed';
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: Array<{ x: number; y: number }>;
  text?: string;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  fillColor?: string;
  strokeColor?: string;
  fontSize?: number;
  fontFamily?: string;
  src?: string;
  locked?: boolean;
  layerIndex: number;
  createdBy: string;
  createdAt: Date;
}

interface BoardSlide {
  id: string;
  title: string;
  elements: BoardElement[];
  createdAt: Date;
}

interface Cursor {
  id: string;
  user: {
    id: string;
    name: string;
    color: string;
    role: 'teacher' | 'student';
  };
  x: number;
  y: number;
  isActive: boolean;
  tool?: string;
}

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    role: 'teacher' | 'student';
  };
  x: number;
  y: number;
  content: string;
  timestamp: Date;
  reactions: Array<{
    type: string;
    userId: string;
    userName: string;
  }>;
  isResolved?: boolean;
}

export function useCanvaStyleBoard(currentUser: { id: string; name: string; role: 'teacher' | 'student' }) {
  const [elements, setElements] = useState<BoardElement[]>([]);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<string>('select');
  const [color, setColor] = useState<string>('#000000');
  const [zoom, setZoom] = useState<number>(1);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  
  const [boardSlides, setBoardSlides] = useState<BoardSlide[]>([
    {
      id: 'slide-1',
      title: 'Slide 1',
      elements: [],
      createdAt: new Date()
    }
  ]);
  
  const [slidesPanel, setSlidesPanel] = useState<SlidesPanelSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cursors, setCursors] = useState<Record<string, Cursor>>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [history, setHistory] = useState<BoardElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Generate user color
  const userColor = `hsl(${Math.abs(currentUser.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 360}, 70%, 50%)`;

  // Real-time collaboration simulation
  useEffect(() => {
    // In a real implementation, this would connect to WebSocket/Supabase Realtime
    const interval = setInterval(() => {
      // Simulate other users' cursors
      const mockCursors: Record<string, Cursor> = {};
      
      // Add current user cursor
      mockCursors[currentUser.id] = {
        id: currentUser.id,
        user: {
          ...currentUser,
          color: userColor
        },
        x: 0,
        y: 0,
        isActive: true
      };

      setCursors(mockCursors);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser, userColor]);

  // Add element to board
  const addElement = useCallback((elementData: Partial<BoardElement>) => {
    const newElement: BoardElement = {
      id: `element-${Date.now()}-${Math.random()}`,
      type: 'pen',
      x: 0,
      y: 0,
      layerIndex: elements.length,
      createdBy: currentUser.id,
      createdAt: new Date(),
      ...elementData
    };

    setElements(prev => {
      const updated = [...prev, newElement];
      
      // Update current board slide
      setBoardSlides(slides => slides.map((slide, index) => 
        index === currentSlide 
          ? { ...slide, elements: updated }
          : slide
      ));
      
      // Add to history
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(updated);
        return newHistory;
      });
      setHistoryIndex(prev => prev + 1);
      
      return updated;
    });

    return newElement.id;
  }, [elements.length, currentUser.id, currentSlide, historyIndex]);

  // Select element
  const selectElement = useCallback((elementId: string, multiSelect = false) => {
    setSelectedElements(prev => {
      if (multiSelect) {
        return prev.includes(elementId)
          ? prev.filter(id => id !== elementId)
          : [...prev, elementId];
      } else {
        return [elementId];
      }
    });
  }, []);

  // Delete selected elements
  const deleteElement = useCallback((elementId?: string) => {
    const idsToDelete = elementId ? [elementId] : selectedElements;
    
    setElements(prev => {
      const updated = prev.filter(el => !idsToDelete.includes(el.id));
      
      // Update current slide
      setBoardSlides(slides => slides.map((slide, index) => 
        index === currentSlide 
          ? { ...slide, elements: updated }
          : slide
      ));
      
      // Add to history
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(updated);
        return newHistory;
      });
      setHistoryIndex(prev => prev + 1);
      
      return updated;
    });
    
    setSelectedElements([]);
    toast.success('Elements deleted');
  }, [selectedElements, currentSlide, historyIndex]);

  // Duplicate selected elements
  const duplicateElement = useCallback((elementId?: string) => {
    const idsToDuplicate = elementId ? [elementId] : selectedElements;
    const elementsToDuplicate = elements.filter(el => idsToDuplicate.includes(el.id));
    
    const duplicated = elementsToDuplicate.map(el => ({
      ...el,
      id: `element-${Date.now()}-${Math.random()}`,
      x: el.x + 20,
      y: el.y + 20,
      createdAt: new Date()
    }));
    
    setElements(prev => {
      const updated = [...prev, ...duplicated];
      
      // Update current slide
      setBoardSlides(slides => slides.map((slide, index) => 
        index === currentSlide 
          ? { ...slide, elements: updated }
          : slide
      ));
      
      return updated;
    });
    
    setSelectedElements(duplicated.map(el => el.id));
    toast.success('Elements duplicated');
  }, [selectedElements, elements, currentSlide]);

  // Move element
  const moveElement = useCallback((elementId: string, deltaX: number, deltaY: number) => {
    setElements(prev => prev.map(el => 
      el.id === elementId 
        ? { ...el, x: el.x + deltaX, y: el.y + deltaY }
        : el
    ));
  }, []);

  // Slide management
  const addSlide = useCallback((title = 'New Slide') => {
    const newSlide: BoardSlide = {
      id: `slide-${Date.now()}`,
      title,
      elements: [],
      createdAt: new Date()
    };
    
    setBoardSlides(prev => [...prev, newSlide]);
    setCurrentSlide(boardSlides.length);
    toast.success('New slide added');
  }, [boardSlides.length]);

  const setCurrentSlideHandler = useCallback((slideIndex: number) => {
    if (slideIndex >= 0 && slideIndex < boardSlides.length) {
      setCurrentSlide(slideIndex);
      setElements(boardSlides[slideIndex].elements);
    }
  }, [boardSlides]);

  // Comments
  const addComment = useCallback((x: number, y: number, content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user: currentUser,
      x,
      y,
      content,
      timestamp: new Date(),
      reactions: []
    };
    
    setComments(prev => [...prev, newComment]);
    toast.success('Comment added');
  }, [currentUser]);

  const addReaction = useCallback((commentId: string, type: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId
        ? {
            ...comment,
            reactions: [
              ...comment.reactions.filter(r => !(r.type === type && r.userId === currentUser.id)),
              { type, userId: currentUser.id, userName: currentUser.name }
            ]
          }
        : comment
    ));
  }, [currentUser]);

  // History
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
      toast.success('Undone');
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
      toast.success('Redone');
    }
  }, [historyIndex, history]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Export
  const exportBoard = useCallback(async () => {
    // In a real implementation, this would render the canvas to PNG/SVG/PDF
    const boardData = {
      boardSlides: boardSlides.map((slide, index) => ({
        ...slide,
        elements: index === currentSlide ? elements : slide.elements
      })),
      exportedAt: new Date(),
      exportedBy: currentUser.id
    };
    
    const blob = new Blob([JSON.stringify(boardData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whiteboard-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Board exported');
  }, [boardSlides, currentSlide, elements, currentUser.id]);

  // Import
  const importContent = useCallback((data: any) => {
    // Handle imported content
    if (data.boardSlides) {
      setBoardSlides(data.boardSlides);
      setCurrentSlide(0);
      setElements(data.boardSlides[0]?.elements || []);
    }
    
    toast.success('Content imported');
  }, []);

  return {
    // Board state
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
    
    // Slides
    boardSlides,
    slidesPanel,
    setSlidesPanel,
    currentSlide,
    
    // Collaboration
    cursors,
    comments,
    addElement,
    selectElement,
    deleteElement,
    duplicateElement,
    moveElement,
    addSlide,
    setCurrentSlide: setCurrentSlideHandler,
    addComment,
    addReaction,
    undo,
    redo,
    canUndo,
    canRedo,
    exportBoard,
    importContent
  };
}