import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { toast } from "sonner";

interface EmbedLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEmbed: (data: { url: string; title: string; x: number; y: number }) => void;
  clickPosition?: { x: number; y: number };
}

// Input validation schema with security checks
const embedSchema = z.object({
  url: z
    .string()
    .trim()
    .nonempty({ message: "URL cannot be empty" })
    .url({ message: "Please enter a valid URL" })
    .max(2048, { message: "URL must be less than 2048 characters" })
    .refine((url) => {
      // Security check: only allow https URLs and common educational domains
      return url.startsWith('https://') || 
             url.includes('youtube.com') || 
             url.includes('vimeo.com') ||
             url.includes('khan-academy.org') ||
             url.includes('quizlet.com') ||
             url.includes('kahoot.com');
    }, { message: "For security, only HTTPS URLs and educational sites are allowed" }),
  title: z
    .string()
    .trim()
    .nonempty({ message: "Title cannot be empty" })
    .max(100, { message: "Title must be less than 100 characters" })
    .regex(/^[a-zA-Z0-9\s\-_.,!?()]+$/, { message: "Title contains invalid characters" })
});

export function EmbedLinkDialog({ isOpen, onClose, onEmbed, clickPosition }: EmbedLinkDialogProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input with security checks
      const validatedData = embedSchema.parse({ url, title });
      
      // Generate position (center of whiteboard if no click position)
      const position = clickPosition || { x: 300, y: 200 };
      
      // Call the embed function
      onEmbed({
        url: validatedData.url,
        title: validatedData.title,
        x: position.x,
        y: position.y
      });

      // Reset form and close
      setUrl("");
      setTitle("");
      onClose();
      
      toast.success("Link embedded successfully!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Show validation errors
        const firstError = error.errors[0];
        toast.error(firstError.message);
      } else {
        toast.error("Failed to embed link. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUrl("");
    setTitle("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Embed Link</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for the link..."
              maxLength={100}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              maxLength={2048}
              required
            />
            <p className="text-xs text-muted-foreground">
              For security, only HTTPS URLs and educational sites are allowed
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Embedding..." : "Embed Link"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}