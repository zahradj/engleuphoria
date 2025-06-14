
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MaterialCard } from "./library/MaterialCard";
import { AIGeneratorDialog } from "./library/AIGeneratorDialog";
import { materialLibraryService } from "@/services/materialLibraryService";
import { Material, MaterialFilter } from "@/types/materialLibrary";
import { Search, Filter, Plus, Sparkles, Download, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MaterialLibraryTab = () => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>(materialLibraryService.getAllMaterials());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  const filteredMaterials = materialLibraryService.getFilteredMaterials({
    search: searchTerm,
    type: selectedType === "all" ? undefined : selectedType,
    level: selectedLevel === "all" ? undefined : selectedLevel,
    subject: selectedSubject === "all" ? undefined : selectedSubject
  });

  const handleAIMaterialGenerated = (material: Material) => {
    setMaterials(materialLibraryService.getAllMaterials());
    setShowAIGenerator(false);
    toast({
      title: "🤖 AI Material Generated!",
      description: `"${material.title}" has been created and added to your library.`,
    });
  };

  const handleDownload = (materialId: string) => {
    toast({
      title: "Downloaded",
      description: "Material has been downloaded to your device.",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedLevel("all");
    setSelectedSubject("all");
  };

  const types = ["worksheet", "activity", "reading", "audio", "video", "game"];
  const levels = ["beginner", "intermediate", "advanced"];
  const subjects = ["Vocabulary", "Grammar", "Speaking", "Reading", "Writing", "Listening"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <h1 className="text-2xl font-bold text-gray-800">Material Library</h1>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAIGenerator(true)}
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate AI Material
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search materials..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{materials.length}</div>
            <div className="text-sm text-gray-600">Total Materials</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {materials.filter(m => m.isAIGenerated).length}
            </div>
            <div className="text-sm text-gray-600">AI Generated</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {materials.filter(m => m.createdBy === 'teacher').length}
            </div>
            <div className="text-sm text-gray-600">Teacher Created</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {materials.reduce((sum, m) => sum + m.downloads, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Downloads</div>
          </CardContent>
        </Card>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((material) => (
          <MaterialCard
            key={material.id}
            material={material}
            onDownload={handleDownload}
          />
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No materials found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or generate new AI materials.</p>
            <Button onClick={() => setShowAIGenerator(true)} className="bg-purple-500 hover:bg-purple-600">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Material
            </Button>
          </CardContent>
        </Card>
      )}

      <AIGeneratorDialog 
        open={showAIGenerator}
        onOpenChange={setShowAIGenerator}
        onMaterialGenerated={handleAIMaterialGenerated}
      />
    </div>
  );
};
