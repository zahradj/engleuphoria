
import React, { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { WhiteboardToolbar } from "./whiteboard/WhiteboardToolbar";
import { EmbeddedGameDialog } from "./whiteboard/EmbeddedGameDialog";
import { EmbeddedGame } from "./whiteboard/EmbeddedGame";
import { WhiteboardCanvas } from "./whiteboard/WhiteboardCanvas";
import { setupDrawingContext, createDrawEventHandlers } from "./whiteboard/drawingUtils";
import { validateAndProcessUrl } from "./whiteboard/SafeUrlValidator";

interface EmbeddedGameData {
  id: string;
  title: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isBlocked?: boolean;
}

export function OneOnOneWhiteboard() {
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser" | "text" | "highlighter" | "shape" | "game">("pencil");
  const [color, setColor] = useState("#2563eb");
  const [activeShape, setActiveShape] = useState<"rectangle" | "circle">("rectangle");
  const [activeTab, setActiveTab] = useState("page1");
  const [embeddedGames, setEmbeddedGames] = useState<Record<string, EmbeddedGameData[]>>({});
  const [gameUrl, setGameUrl] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [isGameDialogOpen, setIsGameDialogOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const addGame = () => {
    if (!gameUrl || !gameTitle) {
      toast({
        title: "Missing Information",
        description: "Please provide both game title and URL",
        variant: "destructive"
      });
      return;
    }

    const validation = validateAndProcessUrl(gameUrl);
    
    if (!validation.isValid) {
      toast({
        title: "Invalid URL",
        description: validation.warning || "Please provide a valid HTTPS URL",
        variant: "destructive"
      });
      return;
    }

    if (validation.warning && !validation.isTrusted) {
      toast({
        title: "Security Warning",
        description: validation.warning,
      });
    }
    
    const newGame: EmbeddedGameData = {
      id: Date.now().toString(),
      title: gameTitle,
      url: validation.processedUrl,
      x: Math.random() * 200 + 50,
      y: Math.random() * 200 + 50,
      width: 400,
      height: 300,
      isBlocked: false
    };

    setEmbeddedGames(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newGame]
    }));
    
    setGameUrl("");
    setGameTitle("");
    setIsGameDialogOpen(false);
    
    toast({
      title: "Content Added",
      description: `${gameTitle} has been embedded. If it doesn't load, try opening it in a new tab.`,
    });
  };

  const handleIframeError = (gameId: string) => {
    console.log("Marking game as blocked:", gameId);
    setEmbeddedGames(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).map(game => 
        game.id === gameId ? { ...game, isBlocked: true } : game
      )
    }));
    
    toast({
      title: "Content Blocked",
      description: "This content cannot be embedded due to security restrictions. You can still open it in a new tab.",
      variant: "destructive"
    });
  };

  const removeGame = (gameId: string) => {
    setEmbeddedGames(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).filter(game => game.id !== gameId)
    }));
    
    toast({
      title: "Content Removed",
      description: "The embedded content has been removed from the whiteboard.",
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === "game") {
      setIsGameDialogOpen(true);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === "game") return;
    
    const canvas = e.currentTarget;
    const ctx = setupDrawingContext(canvas, activeTool, color);
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);

    const { draw, stopDrawing } = createDrawEventHandlers(canvas);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
  };

  const currentPageGames = embeddedGames[activeTab] || [];

  return (
    <div className="h-full flex flex-col relative">
      <WhiteboardToolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        activeShape={activeShape}
        color={color}
        setColor={setColor}
        clearCanvas={clearCanvas}
        isGameDialogOpen={isGameDialogOpen}
        setIsGameDialogOpen={setIsGameDialogOpen}
      >
        <Dialog open={isGameDialogOpen} onOpenChange={setIsGameDialogOpen}>
          <EmbeddedGameDialog
            gameTitle={gameTitle}
            setGameTitle={setGameTitle}
            gameUrl={gameUrl}
            setGameUrl={setGameUrl}
            onAddGame={addGame}
          />
        </Dialog>
      </WhiteboardToolbar>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="mb-2">
          <TabsTrigger value="page1">Page 1</TabsTrigger>
          <TabsTrigger value="page2">Page 2</TabsTrigger>
          <TabsTrigger value="page3">Page 3</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="flex-1 m-0 relative">
          <WhiteboardCanvas
            activeTool={activeTool}
            color={color}
            onCanvasClick={handleCanvasClick}
            onStartDrawing={startDrawing}
          >
            {currentPageGames.map((game) => (
              <EmbeddedGame
                key={game.id}
                game={game}
                onRemove={removeGame}
                onError={handleIframeError}
              />
            ))}
          </WhiteboardCanvas>
        </TabsContent>
      </Tabs>
    </div>
  );
}
