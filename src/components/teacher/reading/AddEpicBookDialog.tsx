
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EpicBook } from "@/types/reading";
import { X, Plus } from "lucide-react";

interface AddEpicBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBook: (book: Partial<EpicBook>) => void;
}

export function AddEpicBookDialog({ open, onOpenChange, onAddBook }: AddEpicBookDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    epicUrl: "",
    readingLevel: "",
    ageRange: "",
    estimatedMinutes: 15,
    newGenre: "",
    newTag: ""
  });
  
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const readingLevels = ["Level K", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];
  const ageRanges = ["4-6", "5-7", "6-8", "7-9", "8-10", "9-11", "10-12"];
  const availableGenres = ["Adventure", "Science", "Animals", "Fantasy", "History", "Biography", "Mystery", "Humor"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookData: Partial<EpicBook> = {
      title: formData.title,
      author: formData.author,
      description: formData.description,
      epicUrl: formData.epicUrl,
      readingLevel: formData.readingLevel,
      ageRange: formData.ageRange,
      estimatedMinutes: formData.estimatedMinutes,
      genre: selectedGenres,
      tags: tags,
      thumbnail: "/placeholder.svg" // Default thumbnail
    };
    
    onAddBook(bookData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      description: "",
      epicUrl: "",
      readingLevel: "",
      ageRange: "",
      estimatedMinutes: 15,
      newGenre: "",
      newTag: ""
    });
    setSelectedGenres([]);
    setTags([]);
  };

  const addGenre = (genre: string) => {
    if (genre && !selectedGenres.includes(genre)) {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const removeGenre = (genre: string) => {
    setSelectedGenres(selectedGenres.filter(g => g !== genre));
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setFormData({...formData, newTag: ""});
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Epic Book to Library</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Book Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="epicUrl">Epic Books URL *</Label>
            <Input
              id="epicUrl"
              type="url"
              placeholder="https://www.getepic.com/app/read/..."
              value={formData.epicUrl}
              onChange={(e) => setFormData({...formData, epicUrl: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="readingLevel">Reading Level *</Label>
              <Select 
                value={formData.readingLevel} 
                onValueChange={(value) => setFormData({...formData, readingLevel: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {readingLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="ageRange">Age Range *</Label>
              <Select 
                value={formData.ageRange} 
                onValueChange={(value) => setFormData({...formData, ageRange: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select age" />
                </SelectTrigger>
                <SelectContent>
                  {ageRanges.map(range => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="minutes">Est. Minutes</Label>
              <Input
                id="minutes"
                type="number"
                min="5"
                max="120"
                value={formData.estimatedMinutes}
                onChange={(e) => setFormData({...formData, estimatedMinutes: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <Label>Genres</Label>
            <div className="flex gap-2 mb-2">
              <Select onValueChange={addGenre}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Add genre" />
                </SelectTrigger>
                <SelectContent>
                  {availableGenres.map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedGenres.map(genre => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                  <X 
                    size={12} 
                    className="ml-1 cursor-pointer" 
                    onClick={() => removeGenre(genre)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add a tag"
                value={formData.newTag}
                onChange={(e) => setFormData({...formData, newTag: e.target.value})}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(formData.newTag);
                  }
                }}
              />
              <Button 
                type="button" 
                size="sm" 
                onClick={() => addTag(formData.newTag)}
              >
                <Plus size={14} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                  <X 
                    size={12} 
                    className="ml-1 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Add Book to Library
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
