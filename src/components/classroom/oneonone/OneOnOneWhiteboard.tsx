import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Pencil, 
  Eraser, 
  Type, 
  Square, 
  Circle, 
  Trash2, 
  Download,
  Upload,
  Highlighter,
  Gamepad2,
  X,
  AlertTriangle
} from "lucide-react";

interface EmbeddedGame {
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
  const [embeddedGames, setEmbeddedGames] = useState<Record<string, EmbeddedGame[]>>({});
  const [gameUrl, setGameUrl] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [isGameDialogOpen, setIsGameDialogOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const colors = ["#2563eb", "#16a34a", "#dc2626", "#ca8a04", "#7c3aed", "#000000"];

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const isValidGameUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      // Allow common educational game domains
      const allowedDomains = [
        'scratch.mit.edu',
        'kahoot.it',
        'kahoot.com',
        'wordwall.net',
        'nearpod.com',
        'padlet.com',
        'jamboard.google.com',
        'youtube.com',
        'vimeo.com',
        'education.com',
        'abcya.com',
        'coolmathgames.com',
        'funbrain.com'
      ];
      
      return allowedDomains.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
      ) || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
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

    if (!isValidGameUrl(gameUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please use a valid HTTPS URL from a supported domain",
        variant: "destructive"
      });
      return;
    }
    
    const newGame: EmbeddedGame = {
      id: Date.now().toString(),
      title: gameTitle,
      url: gameUrl.startsWith('http') ? gameUrl : `https://${gameUrl}`,
      x: 50,
      y: 50,
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
      title: "Game Added",
      description: `${gameTitle} has been embedded in the whiteboard`,
    });
  };

  const handleIframeError = (gameId: string) => {
    setEmbeddedGames(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).map(game => 
        game.id === gameId ? { ...game, isBlocked: true } : game
      )
    }));
  };

  const removeGame = (gameId: string) => {
    setEmbeddedGames(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).filter(game => game.id !== gameId)
    }));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === "game") {
      setIsGameDialogOpen(true);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === "game") return;
    
    const canvas = e.currentTarget;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Set drawing styles
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    switch (activeTool) {
      case "pencil":
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        break;
      case "eraser":
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 20;
        break;
      case "highlighter":
        ctx.strokeStyle = `${color}80`;
        ctx.lineWidth = 15;
        break;
    }

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
  };

  const draw = (e: MouseEvent) => {
    const canvas = e.target as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: MouseEvent) => {
    const canvas = e.target as HTMLCanvasElement;
    canvas.removeEventListener('mousemove', draw);
    canvas.removeEventListener('mouseup', stopDrawing);
  };

  const currentPageGames = embeddedGames[activeTab] || [];

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Button
              variant={activeTool === "pencil" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("pencil")}
            >
              <Pencil size={16} />
            </Button>
            
            <Button
              variant={activeTool === "highlighter" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("highlighter")}
            >
              <Highlighter size={16} />
            </Button>
            
            <Button
              variant={activeTool === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("text")}
            >
              <Type size={16} />
            </Button>
            
            <Button
              variant={activeTool === "shape" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("shape")}
            >
              {activeShape === "rectangle" ? <Square size={16} /> : <Circle size={16} />}
            </Button>
            
            <Dialog open={isGameDialogOpen} onOpenChange={setIsGameDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant={activeTool === "game" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTool("game")}
                >
                  <Gamepad2 size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Embed Educational Content</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Content Title</label>
                    <Input
                      value={gameTitle}
                      onChange={(e) => setGameTitle(e.target.value)}
                      placeholder="Enter content title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Content URL</label>
                    <Input
                      value={gameUrl}
                      onChange={(e) => setGameUrl(e.target.value)}
                      placeholder="https://scratch.mit.edu/projects/..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported: Scratch, Kahoot, Wordwall, YouTube, and other educational platforms
                    </p>
                  </div>
                  <Button onClick={addGame} className="w-full">
                    Add Content
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              variant={activeTool === "eraser" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("eraser")}
            >
              <Eraser size={16} />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearCanvas}>
              <Trash2 size={16} />
            </Button>
            <Button variant="outline" size="sm">
              <Upload size={16} />
            </Button>
            <Button variant="outline" size="sm">
              <Download size={16} />
            </Button>
          </div>
        </div>
        
        {/* Color Palette */}
        <div className="flex items-center gap-2">
          {colors.map((c) => (
            <div
              key={c}
              className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                color === c ? "border-gray-400" : "border-gray-200"
              }`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      {/* Canvas Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="mb-2">
          <TabsTrigger value="page1">Page 1</TabsTrigger>
          <TabsTrigger value="page2">Page 2</TabsTrigger>
          <TabsTrigger value="page3">Page 3</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="flex-1 m-0">
          <div className="bg-white rounded-lg border h-full relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
              width={800}
              height={600}
              onMouseDown={startDrawing}
              onClick={handleCanvasClick}
            />
            
            {/* Embedded Games */}
            {currentPageGames.map((game) => (
              <div
                key={game.id}
                className="absolute border-2 border-blue-500 rounded bg-white shadow-lg resize overflow-hidden"
                style={{
                  left: `${game.x}px`,
                  top: `${game.y}px`,
                  width: `${game.width}px`,
                  height: `${game.height}px`,
                  minWidth: '200px',
                  minHeight: '150px'
                }}
              >
                <div className="flex items-center justify-between p-2 bg-blue-500 text-white text-sm">
                  <span className="font-medium truncate">{game.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-white hover:bg-blue-600"
                    onClick={() => removeGame(game.id)}
                  >
                    <X size={12} />
                  </Button>
                </div>
                
                {game.isBlocked ? (
                  <div className="w-full h-[calc(100%-2.5rem)] flex flex-col items-center justify-center bg-gray-100 text-gray-600">
                    <AlertTriangle size={32} className="mb-2" />
                    <p className="text-sm text-center px-4">
                      Content blocked by security policy.<br/>
                      Try using a different URL or platform.
                    </p>
                  </div>
                ) : (
                  <iframe
                    src={game.url}
                    className="w-full h-[calc(100%-2.5rem)] border-0"
                    title={game.title}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    onError={() => handleIframeError(game.id)}
                    onLoad={(e) => {
                      // Check if iframe loaded successfully
                      const iframe = e.target as HTMLIFrameElement;
                      try {
                        // This will throw an error if blocked by CORS
                        iframe.contentWindow?.document;
                      } catch {
                        handleIframeError(game.id);
                      }
                    }}
                  />
                )}
              </div>
            ))}
            
            <div className="absolute bottom-2 right-2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
              Collaborative Mode
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
