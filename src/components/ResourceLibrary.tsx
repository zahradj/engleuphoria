
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, Video, Headphones, Download, Search, BookOpen } from "lucide-react";

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "video" | "audio" | "interactive";
  level: "beginner" | "intermediate" | "advanced";
  url: string;
  thumbnail?: string;
}

interface ResourceLibraryProps {
  resources: Resource[];
  className?: string;
}

export function ResourceLibrary({
  resources,
  className = "",
}: ResourceLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const { languageText } = useLanguage();
  
  // Filter resources based on search query and filters
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === "" || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = selectedType === null || resource.type === selectedType;
    const matchesLevel = selectedLevel === null || resource.level === selectedLevel;
    
    return matchesSearch && matchesType && matchesLevel;
  });
  
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
    <Card className={className}>
      <CardHeader>
        <CardTitle>{languageText.resourceLibrary}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={languageText.searchResources}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div>
              <h4 className="text-sm font-medium mb-1">{languageText.type}</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={selectedType === null ? "default" : "outline"}
                  onClick={() => setSelectedType(null)}
                >
                  {languageText.all}
                </Button>
                <Button
                  size="sm"
                  variant={selectedType === "pdf" ? "default" : "outline"}
                  onClick={() => setSelectedType("pdf")}
                >
                  PDF
                </Button>
                <Button
                  size="sm"
                  variant={selectedType === "video" ? "default" : "outline"}
                  onClick={() => setSelectedType("video")}
                >
                  {languageText.video}
                </Button>
                <Button
                  size="sm"
                  variant={selectedType === "audio" ? "default" : "outline"}
                  onClick={() => setSelectedType("audio")}
                >
                  {languageText.audio}
                </Button>
                <Button
                  size="sm"
                  variant={selectedType === "interactive" ? "default" : "outline"}
                  onClick={() => setSelectedType("interactive")}
                >
                  {languageText.interactive}
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">{languageText.level}</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={selectedLevel === null ? "default" : "outline"}
                  onClick={() => setSelectedLevel(null)}
                >
                  {languageText.all}
                </Button>
                <Button
                  size="sm"
                  variant={selectedLevel === "beginner" ? "default" : "outline"}
                  onClick={() => setSelectedLevel("beginner")}
                >
                  {languageText.beginner}
                </Button>
                <Button
                  size="sm"
                  variant={selectedLevel === "intermediate" ? "default" : "outline"}
                  onClick={() => setSelectedLevel("intermediate")}
                >
                  {languageText.intermediate}
                </Button>
                <Button
                  size="sm"
                  variant={selectedLevel === "advanced" ? "default" : "outline"}
                  onClick={() => setSelectedLevel("advanced")}
                >
                  {languageText.advanced}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <Card key={resource.id} className="overflow-hidden">
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
            ))
          ) : (
            <div className="col-span-2 py-12 text-center text-muted-foreground">
              {languageText.noResourcesFound}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
