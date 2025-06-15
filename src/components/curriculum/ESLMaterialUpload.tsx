
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { eslCurriculumService } from "@/services/eslCurriculumService";
import { Upload, FileText, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ESLMaterialUploadProps {
  onUploadComplete: () => void;
}

export function ESLMaterialUpload({ onUploadComplete }: ESLMaterialUploadProps) {
  const { toast } = useToast();
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    type: '',
    cefrLevel: '',
    skillFocus: [] as string[],
    duration: 30,
    xpReward: 50,
    difficultyRating: 1
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const levels = eslCurriculumService.getAllLevels();
  const skillCategories = ['vocabulary', 'grammar', 'speaking', 'listening', 'reading', 'writing', 'pronunciation'];
  const materialTypes = ['worksheet', 'activity', 'lesson_plan', 'assessment', 'game', 'video', 'audio', 'reading'];

  const handleSkillToggle = (skill: string) => {
    setUploadData(prev => ({
      ...prev,
      skillFocus: prev.skillFocus.includes(skill)
        ? prev.skillFocus.filter(s => s !== skill)
        : [...prev.skillFocus, skill]
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-detect type based on file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'pdf') {
        setUploadData(prev => ({ ...prev, type: 'worksheet' }));
      } else if (['mp4', 'mov', 'avi'].includes(extension || '')) {
        setUploadData(prev => ({ ...prev, type: 'video' }));
      } else if (['mp3', 'wav', 'm4a'].includes(extension || '')) {
        setUploadData(prev => ({ ...prev, type: 'audio' }));
      }
    }
  };

  const calculateXPReward = () => {
    const baseXP = {
      'worksheet': 20,
      'activity': 30,
      'lesson_plan': 50,
      'assessment': 25,
      'game': 35,
      'video': 40,
      'audio': 30,
      'reading': 25
    };
    
    const levelMultiplier = {
      'A1': 1.0, 'A2': 1.2, 'B1': 1.5, 'B2': 1.8, 'C1': 2.0, 'C2': 2.2
    };
    
    const base = baseXP[uploadData.type] || 20;
    const multiplier = levelMultiplier[uploadData.cefrLevel] || 1.0;
    return Math.round(base * multiplier * uploadData.difficultyRating);
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadData.title || !uploadData.type || !uploadData.cefrLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const xpReward = calculateXPReward();
      
      toast({
        title: "Material Uploaded Successfully!",
        description: `"${uploadData.title}" has been added to the curriculum with ${xpReward} XP reward.`,
      });
      
      onUploadComplete();
      
      // Reset form
      setUploadData({
        title: '',
        description: '',
        type: '',
        cefrLevel: '',
        skillFocus: [],
        duration: 30,
        xpReward: 50,
        difficultyRating: 1
      });
      setSelectedFile(null);
      
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload material. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload ESL Material
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">Material File *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {selectedFile ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PDF, DOC, MP4, MP3, images up to 50MB</p>
                  <input
                    id="file"
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.mp4,.mp3,.wav,.jpg,.png,.gif"
                  />
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => document.getElementById('file')?.click()}
                  >
                    Select File
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={uploadData.title}
                onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter material title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Material Type *</Label>
              <Select 
                value={uploadData.type} 
                onValueChange={(value) => setUploadData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
              value={uploadData.description}
              onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this material covers and how to use it"
              rows={3}
            />
          </div>

          {/* Level and Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">CEFR Level *</Label>
              <Select 
                value={uploadData.cefrLevel} 
                onValueChange={(value) => setUploadData(prev => ({ ...prev, cefrLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select CEFR level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.cefrLevel}>
                      {level.cefrLevel} - {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={uploadData.duration}
                onChange={(e) => setUploadData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                min="5"
                max="180"
              />
            </div>
          </div>

          {/* Skills Focus */}
          <div className="space-y-2">
            <Label>Skills Focus</Label>
            <div className="flex flex-wrap gap-2">
              {skillCategories.map((skill) => (
                <Badge
                  key={skill}
                  variant={uploadData.skillFocus.includes(skill) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleSkillToggle(skill)}
                >
                  {uploadData.skillFocus.includes(skill) && <Plus className="h-3 w-3 mr-1" />}
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Gamification Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Rating (1-5)</Label>
              <Select 
                value={uploadData.difficultyRating.toString()} 
                onValueChange={(value) => setUploadData(prev => ({ ...prev, difficultyRating: parseInt(value) }))}
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

            <div className="space-y-2">
              <Label>Estimated XP Reward</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={calculateXPReward()}
                  readOnly
                  className="bg-gray-50"
                />
                <Badge variant="secondary">Auto-calculated</Badge>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={isUploading || !selectedFile}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-pulse" />
                Uploading Material...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload to Curriculum Library
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
