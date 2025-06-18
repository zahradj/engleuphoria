
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CurriculumLevel, CurriculumMaterial, enhancedESLCurriculumService } from "@/services/enhancedESLCurriculumService";
import { X, Download, Eye, Clock, Trophy, FileText, Video, Music, Users } from "lucide-react";

interface LevelDetailsPanelProps {
  level: CurriculumLevel;
  materialCount: number;
  onClose: () => void;
}

export function LevelDetailsPanel({ level, materialCount, onClose }: LevelDetailsPanelProps) {
  const [materials, setMaterials] = useState<CurriculumMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaterials();
  }, [level.id]);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const materialsData = await enhancedESLCurriculumService.getMaterialsByLevel(level.id);
      setMaterials(materialsData);
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4 text-blue-600" />;
      case 'audio': 
      case 'song': return <Music className="h-4 w-4 text-purple-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'worksheet': 'bg-blue-100 text-blue-800',
      'activity': 'bg-green-100 text-green-800',
      'lesson_plan': 'bg-purple-100 text-purple-800',
      'assessment': 'bg-red-100 text-red-800',
      'game': 'bg-orange-100 text-orange-800',
      'video': 'bg-blue-100 text-blue-800',
      'audio': 'bg-purple-100 text-purple-800',
      'reading': 'bg-emerald-100 text-emerald-800',
      'song': 'bg-pink-100 text-pink-800',
      'story': 'bg-indigo-100 text-indigo-800',
      'exam_prep': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handlePreview = async (material: CurriculumMaterial) => {
    await enhancedESLCurriculumService.incrementViews(material.id);
    // Open preview logic here
    if (material.fileUrl) {
      window.open(material.fileUrl, '_blank');
    }
  };

  const handleDownload = async (material: CurriculumMaterial) => {
    await enhancedESLCurriculumService.incrementDownloads(material.id);
    // Download logic here
    if (material.fileUrl) {
      const link = document.createElement('a');
      link.href = material.fileUrl;
      link.download = material.fileName || material.title;
      link.click();
    }
  };

  const getTotalDuration = () => {
    return materials.reduce((sum, material) => sum + material.duration, 0);
  };

  const getTotalXP = () => {
    return materials.reduce((sum, material) => sum + material.xpReward, 0);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-2">{level.name} Details</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                {level.cefrLevel}
              </Badge>
              <Badge variant="outline">{level.ageGroup}</Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-gray-600">{level.description}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Level Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{materialCount}</div>
            <div className="text-sm text-gray-600">Materials</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{getTotalDuration()}m</div>
            <div className="text-sm text-gray-600">Total Duration</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{getTotalXP()}</div>
            <div className="text-sm text-gray-600">Total XP</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{level.estimatedHours}h</div>
            <div className="text-sm text-gray-600">Target Hours</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Level Completion</span>
            <span>{Math.round((getTotalDuration() / (level.estimatedHours * 60)) * 100)}%</span>
          </div>
          <Progress value={(getTotalDuration() / (level.estimatedHours * 60)) * 100} className="h-2" />
        </div>

        {/* Materials List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Materials</h3>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading materials...
            </div>
          ) : materials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No materials uploaded yet.</p>
              <p className="text-sm">Use the upload button on the level card to add materials.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {materials.map((material) => (
                <Card key={material.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(material.type)}
                        <h4 className="font-medium">{material.title}</h4>
                        <Badge variant="outline" className={getTypeColor(material.type)}>
                          {material.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      {material.description && (
                        <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {material.duration}m
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          {material.xpReward} XP
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {material.views} views
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {material.downloads} downloads
                        </div>
                      </div>

                      {material.skillFocus.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {material.skillFocus.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(material)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {material.fileUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(material)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
