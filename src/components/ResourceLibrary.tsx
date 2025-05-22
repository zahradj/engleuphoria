
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ResourceSearch } from "./resources/ResourceSearch";
import { ResourceFilters } from "./resources/ResourceFilters";
import { ResourceGrid } from "./resources/ResourceGrid";
import { Resource } from "./resources/types";

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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{languageText.resourceLibrary}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          {/* Search */}
          <ResourceSearch 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
          
          {/* Filters */}
          <ResourceFilters 
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
          />
        </div>
        
        {/* Resources Grid */}
        <ResourceGrid resources={filteredResources} />
      </CardContent>
    </Card>
  );
}
