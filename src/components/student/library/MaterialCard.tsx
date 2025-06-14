
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Material } from "@/types/materialLibrary";
import { FileText, Video, Headphones, Gamepad2, Download, Eye, Star, Sparkles } from "lucide-react";

interface MaterialCardProps {
  material: Material;
  onDownload: (materialId: string) => void;
}

export function MaterialCard({ material, onDownload }: MaterialCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'worksheet': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Headphones className="h-4 w-4" />;
      case 'game': 
      case 'activity': return <Gamepad2 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'worksheet': return "bg-blue-100 text-blue-700";
      case 'video': return "bg-red-100 text-red-700";
      case 'audio': return "bg-green-100 text-green-700";
      case 'game':
      case 'activity': return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return "bg-green-100 text-green-800";
      case 'intermediate': return "bg-yellow-100 text-yellow-800";
      case 'advanced': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(material.type)}`}>
                {getTypeIcon(material.type)}
              </div>
              {material.isAIGenerated && (
                <div className="flex items-center gap-1 text-purple-600">
                  <Sparkles className="h-3 w-3" />
                  <span className="text-xs font-medium">AI</span>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-sm mb-1 line-clamp-2">{material.title}</h3>
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">{material.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-2">
              <Badge variant="outline" className={`text-xs ${getLevelColor(material.level)}`}>
                {material.level}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {material.subject}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {material.duration}min
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{material.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            <span>{material.downloads}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button 
            size="sm" 
            onClick={() => onDownload(material.id)}
            className="flex-1 text-xs bg-green-500 hover:bg-green-600"
          >
            <Download className="h-3 w-3 mr-1" />
            Use
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {material.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {material.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{material.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
