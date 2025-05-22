
import { FileText, Video, Headphones, BookOpen, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Resource } from "./types";

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const { languageText } = useLanguage();
  
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-6 w-6 text-purple" />;
      case 'video': return <Video className="h-6 w-6 text-teal" />;
      case 'audio': return <Headphones className="h-6 w-6 text-orange" />;
      case 'interactive': return <BookOpen className="h-6 w-6 text-yellow-dark" />;
      default: return null;
    }
  };
  
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="flex h-full">
        {resource.thumbnail ? (
          <div className="w-1/3 bg-muted">
            <img 
              src={resource.thumbnail} 
              alt={resource.title} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-1/3 bg-muted flex items-center justify-center">
            {getResourceIcon(resource.type)}
          </div>
        )}
        
        <div className="w-2/3 p-4 flex flex-col">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">{resource.title}</h3>
              <div className={`text-xs px-2 py-1 rounded-full ${getLevelBadgeColor(resource.level)}`}>
                {resource.level}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{resource.description}</p>
          </div>
          
          <div className="mt-auto pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full flex items-center gap-2"
              asChild
            >
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                {resource.type === "pdf" || resource.type === "audio" ? (
                  <>
                    <Download size={14} />
                    {languageText.download}
                  </>
                ) : (
                  <>
                    <BookOpen size={14} />
                    {languageText.viewResource}
                  </>
                )}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
