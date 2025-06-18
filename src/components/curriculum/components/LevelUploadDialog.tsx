
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Image, Video, Music, X, Plus } from "lucide-react";
import { CurriculumLevel, enhancedESLCurriculumService } from "@/services/enhancedESLCurriculumService";

interface LevelUploadDialogProps {
  level: CurriculumLevel;
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

type MaterialType = 'worksheet' | 'activity' | 'lesson_plan' | 'assessment' | 'game' | 'video' | 'audio' | 'reading' | 'song' | 'story' | 'exam_prep';

interface FormData {
  title: string;
  description: string;
  type: MaterialType;
  theme: string;
  duration: number;
  difficultyRating: number;
  skillFocus: string[];
  tags: string[];
  newTag: string;
}

export function LevelUploadDialog({ level, isOpen, onClose, onUploadComplete }: LevelUploadDialogProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    type: "worksheet",
    theme: "",
    duration: 30,
    difficultyRating: 1,
    skillFocus: [],
    tags: [],
    newTag: ""
  });

  const materialTypes = [
    { value: 'worksheet', label: 'Worksheet', icon: FileText },
    { value: 'activity', label: 'Activity', icon: FileText },
    { value: 'lesson_plan', label: 'Lesson Plan', icon: FileText },
    { value: 'assessment', label: 'Assessment', icon: FileText },
    { value: 'game', label: 'Game', icon: FileText },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'audio', label: 'Audio', icon: Music },
    { value: 'reading', label: 'Reading', icon: FileText },
    { value: 'song', label: 'Song', icon: Music },
    { value: 'story', label: 'Story', icon: FileText },
    { value: 'exam_prep', label: 'Exam Prep', icon: FileText }
  ] as const;

  const skillCategories = [
    'vocabulary', 'grammar', 'speaking', 'listening', 
    'reading', 'writing', 'pronunciation', 'songs', 'games'
  ];

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image size={20} className="text-green-600" />;
    if (file.type.startsWith('video/')) return <Video size={20} className="text-blue-600" />;
    if (file.type.startsWith('audio/')) return <Music size={20} className="text-purple-600" />;
    return <FileText size={20} className="text-gray-600" />;
  };

  const calculateXPReward = () => {
    const baseXP = {
      'worksheet': 20, 'activity': 30, 'lesson_plan': 50, 'assessment': 25,
      'game': 35, 'video': 40, 'audio': 30, 'reading': 25, 'song': 35,
      'story': 30, 'exam_prep': 45
    };
    
    const levelMultiplier = {
      'Pre-A1': 1.0, 'A1': 1.1, 'A1+': 1.2, 'A2': 1.3, 'A2+': 1.4,
      'B1': 1.5, 'B1+': 1.6, 'B2': 1.7, 'B2+': 1.8, 'C1': 1.9, 'C1+': 2.0, 'C2': 2.2
    };
    
    const base = baseXP[formData.type] || 20;
    const multiplier = levelMultiplier[level.cefrLevel as keyof typeof levelMultiplier] || 1.0;
    return Math.round(base * multiplier * formData.difficultyRating);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Auto-detect type based on file
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'pdf') {
        setFormData(prev => ({ ...prev, type: 'worksheet' as MaterialType }));
      } else if (['mp4', 'mov', 'avi'].includes(extension || '')) {
        setFormData(prev => ({ ...prev, type: 'video' as MaterialType }));
      } else if (['mp3', 'wav', 'm4a'].includes(extension || '')) {
        setFormData(prev => ({ ...prev, type: 'audio' as MaterialType }));
      }
    }
  };

  const addSkill = (skill: string) => {
    if (!formData.skillFocus.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skillFocus: [...prev.skillFocus, skill]
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillFocus: prev.skillFocus.filter(s => s !== skill)
    }));
  };

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ""
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleUpload = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for the material.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const materialData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        levelId: level.id,
        cefrLevel: level.cefrLevel,
        skillFocus: formData.skillFocus,
        theme: formData.theme,
        duration: formData.duration,
        xpReward: calculateXPReward(),
        difficultyRating: formData.difficultyRating,
        isAgeAppropriate: true,
        downloads: 0,
        views: 0,
        tags: formData.tags,
        isPublic: true
      };

      const result = await enhancedESLCurriculumService.uploadMaterial(materialData, selectedFile || undefined);
      
      if (result) {
        toast({
          title: "Material uploaded successfully!",
          description: `"${formData.title}" has been added to ${level.name}.`
        });
        
        onUploadComplete();
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          type: "worksheet",
          theme: "",
          duration: 30,
          difficultyRating: 1,
          skillFocus: [],
          tags: [],
          newTag: ""
        });
        setSelectedFile(null);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload material. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Upload Material to {level.name} ({level.cefrLevel})
          </DialogTitle>
          <p className="text-sm text-gray-600">{level.ageGroup}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload */}
          <Card 
            className="border-2 border-dashed p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                {getFileIcon(selectedFile)}
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PDF, DOC, MP4, MP3, images up to 50MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.mp4,.mp3,.wav,.jpg,.png,.gif"
            />
          </Card>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter material title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Material Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: MaterialType) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the material and how to use it"
              rows={3}
            />
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Input
                id="theme"
                value={formData.theme}
                onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                placeholder="e.g., Animals, Family"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                min="5"
                max="180"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty (1-5)</Label>
              <Select 
                value={formData.difficultyRating.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, difficultyRating: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} - {['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'][rating - 1]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Skills Focus */}
          <div className="space-y-2">
            <Label>Skills Focus</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skillFocus.map((skill) => (
                <Badge
                  key={skill}
                  variant="default"
                  className="cursor-pointer"
                  onClick={() => removeSkill(skill)}
                >
                  {skill} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {skillCategories.filter(skill => !formData.skillFocus.includes(skill)).map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => addSkill(skill)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={formData.newTag}
                onChange={(e) => setFormData(prev => ({ ...prev, newTag: e.target.value }))}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus size={16} />
              </Button>
            </div>
          </div>

          {/* XP Preview */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estimated XP Reward:</span>
              <Badge variant="default" className="text-lg px-3 py-1">
                {calculateXPReward()} XP
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Based on material type, level, and difficulty
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={isUploading || !formData.title}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-pulse" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Material
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
