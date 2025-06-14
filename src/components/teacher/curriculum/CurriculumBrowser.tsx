
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List, Eye, Download, Edit, Trash, FileText, Image, Video, Headphones } from "lucide-react";
import { curriculumLibraryService, CurriculumContent } from "@/services/curriculumLibraryService";
import { useToast } from "@/hooks/use-toast";

interface CurriculumBrowserProps {
  refreshTrigger: number;
}

export function CurriculumBrowser({ refreshTrigger }: CurriculumBrowserProps) {
  const [content, setContent] = useState<CurriculumContent[]>([]);
  const [filteredContent, setFilteredContent] = useState<CurriculumContent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    type: "all",
    level: "all",
    framework: "all",
    theme: "all"
  });
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, [refreshTrigger]);

  useEffect(() => {
    applyFilters();
  }, [content, searchTerm, filters]);

  const loadContent = () => {
    const allContent = curriculumLibraryService.getAllContent();
    setContent(allContent);
  };

  const applyFilters = () => {
    let filtered = content.filter(item => {
      const matchesSearch = searchTerm === "" || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = filters.type === "all" || item.type === filters.type;
      const matchesLevel = filters.level === "all" || item.cefrLevel === filters.level;
      const matchesFramework = filters.framework === "all" || item.framework === filters.framework;
      const matchesTheme = filters.theme === "all" || item.theme.toLowerCase().includes(filters.theme.toLowerCase());

      return matchesSearch && matchesType && matchesLevel && matchesFramework && matchesTheme;
    });

    setFilteredContent(filtered);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      curriculumLibraryService.deleteContent(id);
      loadContent();
      toast({
        title: "Content deleted",
        description: "The curriculum content has been removed from your library.",
      });
    }
  };

  const handlePreview = (item: CurriculumContent) => {
    toast({
      title: "Preview",
      description: `Opening preview for: ${item.title}`,
    });
  };

  const handleDownload = (item: CurriculumContent) => {
    toast({
      title: "Download",
      description: `Downloading: ${item.title}`,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "worksheet": return <FileText size={16} />;
      case "video": return <Video size={16} />;
      case "audio": return <Headphones size={16} />;
      case "image": return <Image size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "worksheet": return "bg-blue-100 text-blue-700";
      case "video": return "bg-red-100 text-red-700";
      case "audio": return "bg-green-100 text-green-700";
      case "image": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      level: "all",
      framework: "all",
      theme: "all"
    });
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Search size={20} />
              Browse Curriculum Library
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? <List size={16} /> : <Grid size={16} />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="type-filter">Type</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="worksheet">Worksheet</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="game">Game</SelectItem>
                  <SelectItem value="interactive">Interactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="level-filter">Level</Label>
              <Select value={filters.level} onValueChange={(value) => setFilters({...filters, level: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="C1">C1</SelectItem>
                  <SelectItem value="C2">C2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="framework-filter">Framework</Label>
              <Select value={filters.framework} onValueChange={(value) => setFilters({...filters, framework: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frameworks</SelectItem>
                  <SelectItem value="Traditional">Traditional</SelectItem>
                  <SelectItem value="NLEFP">NLEFP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="theme-filter">Theme</Label>
              <Input
                id="theme-filter"
                placeholder="Filter by theme..."
                value={filters.theme === "all" ? "" : filters.theme}
                onChange={(e) => setFilters({...filters, theme: e.target.value || "all"})}
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredContent.length} of {content.length} items
          </div>
        </CardContent>
      </Card>

      {/* Content Grid/List */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {filteredContent.map((item) => (
          <Card key={item.id} className={viewMode === "list" ? "flex" : ""}>
            <CardHeader className={viewMode === "list" ? "flex-1" : ""}>
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge variant="outline">{item.cefrLevel}</Badge>
                      <Badge variant="secondary">{item.type}</Badge>
                      <Badge variant="outline">{item.framework}</Badge>
                      {item.theme && <Badge variant="outline">{item.theme}</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className={viewMode === "list" ? "flex items-center" : ""}>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handlePreview(item)}>
                  <Eye size={14} />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDownload(item)}>
                  <Download size={14} />
                </Button>
                <Button size="sm" variant="outline">
                  <Edit size={14} />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                  <Trash size={14} />
                </Button>
              </div>
              {viewMode === "grid" && (
                <div className="mt-3 text-xs text-gray-500">
                  <div>Duration: {item.duration} min</div>
                  <div>Uploaded: {item.uploadDate.toLocaleDateString()}</div>
                  <div>By: {item.uploadedBy}</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No content found</h3>
          <p className="text-gray-500">
            {content.length === 0 
              ? "Upload some curriculum content to get started." 
              : "Try adjusting your search terms or filters."}
          </p>
        </div>
      )}
    </div>
  );
}
