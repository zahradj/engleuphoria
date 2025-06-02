
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Download, Search, FileText, Video, Headphones, Gamepad2 } from "lucide-react";

export const MaterialsLibraryTab = () => {
  const materials = [
    {
      id: 1,
      title: "Past Tense Worksheet",
      type: "worksheet",
      category: "Grammar",
      level: "A2",
      size: "2.3 MB",
      downloads: 45
    },
    {
      id: 2,
      title: "Conversation Practice Video",
      type: "video", 
      category: "Speaking",
      level: "A2",
      size: "15.7 MB",
      downloads: 32
    },
    {
      id: 3,
      title: "Listening Exercise: Daily Routines",
      type: "audio",
      category: "Listening", 
      level: "A2",
      size: "8.2 MB",
      downloads: 28
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'worksheet': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'video': return <Video className="h-5 w-5 text-red-500" />;
      case 'audio': return <Headphones className="h-5 w-5 text-green-500" />;
      case 'game': return <Gamepad2 className="h-5 w-5 text-purple-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Materials Library</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search materials..." className="pl-10 w-64" />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {materials.map((material) => (
          <Card key={material.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getIcon(material.type)}
                  <div>
                    <h3 className="font-semibold text-gray-800">{material.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline">{material.category}</Badge>
                      <Badge variant="secondary">{material.level}</Badge>
                      <span className="text-sm text-gray-500">{material.size}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{material.downloads} downloads</span>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
