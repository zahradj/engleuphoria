
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
        <Button onClick={onAddGame} className="w-full">
          Add Content
        </Button>
      </div>
    </DialogContent>
  );
}
