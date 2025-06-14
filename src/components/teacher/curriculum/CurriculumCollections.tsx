
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Plus, Edit, Trash, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Collection {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  theme: string;
  level: string;
  createdDate: Date;
}

interface CurriculumCollectionsProps {
  refreshTrigger: number;
}

export function CurriculumCollections({ refreshTrigger }: CurriculumCollectionsProps) {
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: "1",
      name: "Animal Kingdom Lessons",
      description: "Complete curriculum for teaching animal vocabulary and habitats",
      itemCount: 12,
      theme: "Animals",
      level: "A1-A2",
      createdDate: new Date("2024-01-15")
    },
    {
      id: "2", 
      name: "Family & Relationships",
      description: "Comprehensive materials covering family vocabulary and relationships",
      itemCount: 8,
      theme: "Family",
      level: "A1",
      createdDate: new Date("2024-02-01")
    },
    {
      id: "3",
      name: "Weather & Seasons",
      description: "Interactive content for weather vocabulary and seasonal activities",
      itemCount: 15,
      theme: "Weather",
      level: "A2-B1",
      createdDate: new Date("2024-02-10")
    }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    theme: "",
    level: "A1"
  });
  const { toast } = useToast();

  const handleCreateCollection = () => {
    if (!newCollection.name.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your collection.",
        variant: "destructive",
      });
      return;
    }

    const collection: Collection = {
      id: Date.now().toString(),
      name: newCollection.name,
      description: newCollection.description,
      theme: newCollection.theme,
      level: newCollection.level,
      itemCount: 0,
      createdDate: new Date()
    };

    setCollections(prev => [...prev, collection]);
    setNewCollection({ name: "", description: "", theme: "", level: "A1" });
    setIsCreating(false);

    toast({
      title: "Collection created",
      description: `"${collection.name}" has been added to your library.`,
    });
  };

  const handleDeleteCollection = (id: string) => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      setCollections(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Collection deleted",
        description: "The collection has been removed from your library.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Curriculum Collections</h3>
          <p className="text-sm text-gray-600">Organize your content into themed collections</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus size={16} className="mr-2" />
          Create Collection
        </Button>
      </div>

      {/* Create Collection Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Collection Name</label>
                <Input
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({...newCollection, name: e.target.value})}
                  placeholder="e.g., Animal Kingdom Lessons"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({...newCollection, description: e.target.value})}
                  placeholder="Describe what this collection contains..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Theme</label>
                  <Input
                    value={newCollection.theme}
                    onChange={(e) => setNewCollection({...newCollection, theme: e.target.value})}
                    placeholder="e.g., Animals, Family"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Level</label>
                  <Input
                    value={newCollection.level}
                    onChange={(e) => setNewCollection({...newCollection, level: e.target.value})}
                    placeholder="e.g., A1-A2"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateCollection}>Create Collection</Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Card key={collection.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FolderOpen size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{collection.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{collection.description}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleDeleteCollection(collection.id)}
                  >
                    <Trash size={12} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Badge variant="outline">{collection.level}</Badge>
                  <Badge variant="secondary">{collection.theme}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FileText size={14} />
                    {collection.itemCount} items
                  </span>
                  <span>{collection.createdDate.toLocaleDateString()}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Collection
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {collections.length === 0 && !isCreating && (
        <div className="text-center py-12">
          <FolderOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No collections yet</h3>
          <p className="text-gray-500 mb-4">
            Create collections to organize your curriculum content by theme or level.
          </p>
          <Button onClick={() => setIsCreating(true)}>
            <Plus size={16} className="mr-2" />
            Create Your First Collection
          </Button>
        </div>
      )}
    </div>
  );
}
