
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Eye, Download, Edit, Trash, Search, Filter, FileText, Video, Music, Image, Gamepad2 } from "lucide-react";
import { CurriculumMaterial, enhancedESLCurriculumService } from "@/services/enhancedESLCurriculumService";

interface LevelMaterialsGridProps {
  materials: CurriculumMaterial[];
  isLoading: boolean;
  onMaterialUpdate: () => void;
}

export function LevelMaterialsGrid({ materials, isLoading, onMaterialUpdate }: LevelMaterialsGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const { toast } = useToast();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={16} className="text-blue-600" />;
      case 'audio': return <Music size={16} className="text-purple-600" />;
      case 'game': return <Gamepad2 size={16} className="text-green-600" />;
      case 'worksheet': return <FileText size={16} className="text-orange-600" />;
      default: return <FileText size={16} className="text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-700';
      case 'audio': return 'bg-purple-100 text-purple-700';
      case 'game': return 'bg-green-100 text-green-700';
      case 'worksheet': return 'bg-orange-100 text-orange-700';
      case 'activity': return 'bg-pink-100 text-pink-700';
      case 'assessment': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleView = async (material: CurriculumMaterial) => {
    await enhancedESLCurriculumService.incrementViews(material.id);
    onMaterialUpdate();
    
    if (material.fileUrl) {
      window.open(material.fileUrl, '_blank');
    } else {
      toast({
        title: "Preview",
        description: `Opening preview for: ${material.title}`,
      });
    }
  };

  const handleDownload = async (material: CurriculumMaterial) => {
    await enhancedESLCurriculumService.incrementDownloads(material.id);
    onMaterialUpdate();

    if (material.fileUrl) {
      const link = document.createElement('a');
      link.href = material.fileUrl;
      link.download = material.fileName || material.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({
      title: "Download started",
      description: `Downloading: ${material.title}`,
    });
  };

  const handleDelete = async (material: CurriculumMaterial) => {
    if (window.confirm(`Delete "${material.title}"? This action cannot be undone.`)) {
      const success = await enhancedESLCurriculumService.deleteMaterial(material.id);
      if (success) {
        toast({
          title: "Material deleted",
          description: "The material has been removed successfully.",
        });
        onMaterialUpdate();
      } else {
        toast({
          title: "Delete failed",
          description: "Failed to delete the material. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const filteredMaterials = materials
    .filter(material => {
      const matchesSearch = searchTerm === "" || 
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = typeFilter === "all" || material.type === typeFilter;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return b.views - a.views;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'xp':
          return b.xpReward - a.xpReward;
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="worksheet">Worksheets</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="game">Games</SelectItem>
                <SelectItem value="activity">Activities</SelectItem>
                <SelectItem value="assessment">Assessments</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="xp">Highest XP</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredMaterials.length} of {materials.length} materials
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No materials found</h3>
            <p className="text-gray-500">
              {materials.length === 0 
                ? "Upload some materials to get started." 
                : "Try adjusting your search terms or filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(material.type)}`}>
                    {getTypeIcon(material.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base line-clamp-2">{material.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {material.description || "No description available"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={getTypeColor(material.type)}>
                      {material.type}
                    </Badge>
                    <Badge variant="outline">{material.duration}min</Badge>
                    <Badge variant="secondary">{material.xpReward} XP</Badge>
                  </div>
                  
                  {material.skillFocus.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {material.skillFocus.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {material.skillFocus.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{material.skillFocus.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{material.views} views</span>
                    <span>{material.downloads} downloads</span>
                    <span>★ {material.difficultyRating}/5</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(material)}
                      className="flex-1"
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(material)}
                    >
                      <Download size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(material)}
                    >
                      <Trash size={14} />
                    </Button>
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
