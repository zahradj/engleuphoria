
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Search, Star, Download, Eye, Filter, Sparkles, Globe } from "lucide-react";
import { FeaturedExternalLessons } from "./features/FeaturedExternalLessons";

export const ResourceLibraryTab = () => {
  const [activeTab, setActiveTab] = useState("library");
  const resources = [
    {
      id: 1,
      title: "Grammar Basics - Present Tense",
      type: "PDF",
      level: "Beginner",
      topic: "Grammar",
      size: "2.3 MB",
      downloads: 45,
      favorite: true,
      uploadDate: "Nov 15, 2024"
    },
    {
      id: 2,
      title: "Travel Vocabulary Flashcards",
      type: "Interactive",
      level: "Intermediate",
      topic: "Vocabulary", 
      size: "1.8 MB",
      downloads: 32,
      favorite: false,
      uploadDate: "Nov 20, 2024"
    },
    {
      id: 3,
      title: "Listening Exercise - Airport Sounds",
      type: "Audio",
      level: "Advanced",
      topic: "Listening",
      size: "5.2 MB",
      downloads: 28,
      favorite: true,
      uploadDate: "Nov 25, 2024"
    },
    {
      id: 4,
      title: "Conversation Starters Worksheet",
      type: "PDF",
      level: "All Levels",
      topic: "Speaking",
      size: "1.5 MB",
      downloads: 67,
      favorite: false,
      uploadDate: "Dec 1, 2024"
    }
  ];

  const categories = [
    { name: "Grammar", count: 15, color: "bg-blue-100 text-blue-800" },
    { name: "Vocabulary", count: 23, color: "bg-green-100 text-green-800" },
    { name: "Listening", count: 12, color: "bg-purple-100 text-purple-800" },
    { name: "Speaking", count: 18, color: "bg-orange-100 text-orange-800" },
    { name: "Reading", count: 14, color: "bg-red-100 text-red-800" },
    { name: "Writing", count: 9, color: "bg-indigo-100 text-indigo-800" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Resource Library
        </h1>
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
          <Upload className="h-4 w-4 mr-2" />
          Upload Material
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            My Library
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Featured Lessons
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-6 mt-6">

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search resources..." 
              className="pl-10"
            />
          </div>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">
          <Star className="h-4 w-4 mr-2" />
          Favorites
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <span className="text-sm font-medium">{category.name}</span>
                  <Badge className={`${category.color} text-xs`}>
                    {category.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base mb-1">{resource.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {resource.type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {resource.level}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost" 
                      size="sm"
                      className={resource.favorite ? "text-yellow-500" : "text-gray-400"}
                    >
                      <Star className={`h-4 w-4 ${resource.favorite ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <p>Topic: {resource.topic}</p>
                      <p>Size: {resource.size}</p>
                      <p>Downloads: {resource.downloads}</p>
                      <p className="text-xs">Uploaded: {resource.uploadDate}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-1" />
                        Use
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
        </TabsContent>

        <TabsContent value="featured" className="mt-6">
          <FeaturedExternalLessons />
        </TabsContent>
      </Tabs>
    </div>
  );
};
