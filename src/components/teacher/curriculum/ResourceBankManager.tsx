
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Resource } from "@/types/curriculum";
import { resourceBankService } from "@/services/resourceBankService";
import { Plus, Edit, Trash, Search, FileText, Video, Headphones, Gamepad2 } from "lucide-react";

export function ResourceBankManager() {
  const [resources, setResources] = useState<Resource[]>(resourceBankService.getAllResources());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "worksheet" as const,
    cefrLevel: "A1",
    skillFocus: "",
    theme: "",
    duration: 15,
    description: "",
    tags: "",
    url: ""
  });

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === "all" || resource.cefrLevel === filterLevel;
    const matchesType = filterType === "all" || resource.type === filterType;
    
    return matchesSearch && matchesLevel && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newResource: Resource = {
      id: `resource_${Date.now()}`,
      title: formData.title,
      type: formData.type,
      cefrLevel: formData.cefrLevel,
      skillFocus: formData.skillFocus.split(",").map(s => s.trim()),
      theme: formData.theme,
      duration: formData.duration,
      description: formData.description,
      tags: formData.tags.split(",").map(s => s.trim()),
      url: formData.url || undefined
    };

    resourceBankService.addResource(newResource);
    setResources(resourceBankService.getAllResources());
    setIsEditing(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "worksheet",
      cefrLevel: "A1",
      skillFocus: "",
      theme: "",
      duration: 15,
      description: "",
      tags: "",
      url: ""
    });
  };

  const deleteResource = (id: string) => {
    resourceBankService.deleteResource(id);
    setResources(resourceBankService.getAllResources());
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "worksheet": return <FileText size={16} />;
      case "video": return <Video size={16} />;
      case "audio": return <Headphones size={16} />;
      case "game": 
      case "interactive": return <Gamepad2 size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "worksheet": return "bg-blue-100 text-blue-700";
      case "video": return "bg-red-100 text-red-700";
      case "audio": return "bg-green-100 text-green-700";
      case "game":
      case "interactive": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Resource Bank</h3>
        <Button onClick={() => setIsEditing(true)}>
          <Plus size={16} className="mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="search"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="level-filter">Level</Label>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger>
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="A1">A1 - Beginner</SelectItem>
                <SelectItem value="A2">A2 - Elementary</SelectItem>
                <SelectItem value="B1">B1 - Intermediate</SelectItem>
                <SelectItem value="B2">B2 - Upper-Intermediate</SelectItem>
                <SelectItem value="C1">C1 - Advanced</SelectItem>
                <SelectItem value="C2">C2 - Proficient</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="type-filter">Type</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="worksheet">Worksheet</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="game">Game</SelectItem>
                <SelectItem value="interactive">Interactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setFilterLevel("all");
              setFilterType("all");
            }}>
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Resource List */}
      <div className="grid gap-4">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-3 flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(resource.type)}`}>
                  {getTypeIcon(resource.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{resource.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{resource.cefrLevel}</Badge>
                    <Badge variant="secondary">{resource.type}</Badge>
                    <Badge variant="outline">{resource.duration}min</Badge>
                    <Badge variant="outline">{resource.theme}</Badge>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {resource.skillFocus.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit size={14} />
                </Button>
                <Button size="sm" variant="outline" onClick={() => deleteResource(resource.id)}>
                  <Trash size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No resources found matching your criteria.</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {isEditing && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">Add New Resource</h4>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="worksheet">Worksheet</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="game">Game</SelectItem>
                    <SelectItem value="interactive">Interactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="level">CEFR Level</Label>
                <Select value={formData.cefrLevel} onValueChange={(value) => setFormData({...formData, cefrLevel: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A1">A1 - Beginner</SelectItem>
                    <SelectItem value="A2">A2 - Elementary</SelectItem>
                    <SelectItem value="B1">B1 - Intermediate</SelectItem>
                    <SelectItem value="B2">B2 - Upper-Intermediate</SelectItem>
                    <SelectItem value="C1">C1 - Advanced</SelectItem>
                    <SelectItem value="C2">C2 - Proficient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Input
                  id="theme"
                  value={formData.theme}
                  onChange={(e) => setFormData({...formData, theme: e.target.value})}
                  placeholder="e.g., Animals, Family"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="5"
                  max="60"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="skills">Skill Focus (comma-separated)</Label>
              <Input
                id="skills"
                value={formData.skillFocus}
                onChange={(e) => setFormData({...formData, skillFocus: e.target.value})}
                placeholder="vocabulary, grammar, speaking"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="beginner, animals, present tense"
              />
            </div>

            <div>
              <Label htmlFor="url">URL (optional)</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">Add Resource</Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
