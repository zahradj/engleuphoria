
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, ExternalLink } from "lucide-react";

interface EmbeddedGameDialogProps {
  gameTitle: string;
  setGameTitle: (title: string) => void;
  gameUrl: string;
  setGameUrl: (url: string) => void;
  onAddGame: () => void;
}

export function EmbeddedGameDialog({
  gameTitle,
  setGameTitle,
  gameUrl,
  setGameUrl,
  onAddGame
}: EmbeddedGameDialogProps) {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Embed Educational Content</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Some content may be blocked by browser security policies. If embedding fails, 
            you can still access the content via a direct link.
          </AlertDescription>
        </Alert>
        
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
            Trusted domains: Scratch, Kahoot, Wordwall, YouTube, Khan Academy, PBS Kids, and other educational platforms
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onAddGame} className="flex-1">
            Add Content
          </Button>
          {gameUrl && (
            <Button 
              variant="outline" 
              onClick={() => window.open(gameUrl.startsWith('http') ? gameUrl : `https://${gameUrl}`, '_blank')}
              className="flex items-center gap-1"
            >
              <ExternalLink size={14} />
              Preview
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  );
}
