
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CurriculumLevel, CurriculumMaterial, enhancedESLCurriculumService } from "@/services/enhancedESLCurriculumService";
import { Search, Filter, Download, Eye, Clock, Trophy } from "lucide-react";

interface CurriculumBrowserProps {
  levels: CurriculumLevel[];
  refreshTrigger: number;
}

export function CurriculumBrowser({ levels, refreshTrigger }: CurriculumBrowserProps) {
  const [allMaterials, setAllMaterials] = useState<CurriculumMaterial[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<CurriculumMaterial[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllMaterials();
  }, [levels, refreshTrigger]);

  useEffect(() => {
    filterMaterials();
  }, [allMaterials, searchTerm, selectedLevel, selectedType]);

  const loadAllMaterials = async () => {
    setLoading(true);
    try {
      const materials: CurriculumMaterial[] = [];
      for (const level of levels) {
        const levelMaterials = await enhancedESLCurriculumService.getMaterialsByLevel(level.id);
        materials.push(...levelMaterials);
      }
      setAllMaterials(materials);
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = () => {
    let filtered = allMaterials;

    if (searchTerm) {
      filtered = filtered.filter(material => 
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter(material => material.cefrLevel === selectedLevel);
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(material => material.type === selectedType);
    }

    setFilteredMaterials(filtered);
  };

  const handlePreview = async (material: CurriculumMaterial) => {
    await enhancedESLCurriculumService.incrementViews(material.id);
    if (material.fileUrl) {
      window.open(material.fileUrl, '_blank');
    }
  };

  const handleDownload = async (material: CurriculumMaterial) => {
    await enhancedESLCurriculumService.incrementDownloads(material.id);
    if (material.fileUrl) {
      const link = document.createElement('a');
      link.href = material.fileUrl;
      link.download = material.fileName || material.title;
      link.click();
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading curriculum materials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Browse All Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level.id} value={level.cefrLevel}>
                    {level.cefrLevel} - {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="worksheet">Worksheets</SelectItem>
                <SelectItem value="activity">Activities</SelectItem>
                <SelectItem value="lesson_plan">Lesson Plans</SelectItem>
                <SelectItem value="assessment">Assessments</SelectItem>
                <SelectItem value="game">Games</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="song">Songs</SelectItem>
                <SelectItem value="story">Stories</SelectItem>
                <SelectItem value="exam_prep">Exam Prep</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredMaterials.length} of {allMaterials.length} materials
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredMaterials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or upload new materials.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredMaterials.map((material) => (
            <Card key={material.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{material.title}</h3>
                      <Badge className={getTypeColor(material.type)}>
                        {material.type.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {material.cefrLevel}
                      </Badge>
                    </div>
                    
                    {material.description && (
                      <p className="text-gray-600 mb-3">{material.description}</p>
                    )}
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {material.duration} minutes
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        {material.xpReward} XP
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {material.views} views
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {material.downloads} downloads
                      </div>
                    </div>

                    {material.skillFocus.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {material.skillFocus.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {material.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {material.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-6">
                    <Button
                      variant="outline"
                      onClick={() => handlePreview(material)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    {material.fileUrl && (
                      <Button
                        variant="default"
                        onClick={() => handleDownload(material)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
