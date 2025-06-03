
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock,
  Mic,
  Image,
  Send,
  BookOpen
} from "lucide-react";

export function OneOnOneHomework() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [textResponse, setTextResponse] = useState("");
  const { toast } = useToast();

  const tasks = [
    {
      id: "vocab-practice",
      title: "Vocabulary Practice",
      description: "Write sentences using 5 new words from today's lesson",
      type: "writing",
      status: "pending",
      dueDate: "Tomorrow",
      points: 20
    },
    {
      id: "pronunciation",
      title: "Pronunciation Exercise", 
      description: "Record yourself saying the alphabet",
      type: "audio",
      status: "completed",
      dueDate: "Today",
      points: 15
    },
    {
      id: "reading-comprehension",
      title: "Reading Comprehension",
      description: "Read the short story and answer questions",
      type: "reading",
      status: "pending",
      dueDate: "In 2 days",
      points: 30
    }
  ];

  const materials = [
    {
      id: "story-pdf",
      title: "The Little Red Hen - Story",
      type: "PDF",
      url: "#"
    },
    {
      id: "vocab-list",
      title: "Vocabulary List - Animals",
      type: "PDF", 
      url: "#"
    },
    {
      id: "pronunciation-guide",
      title: "Pronunciation Guide",
      type: "Audio",
      url: "#"
    }
  ];

  const handleFileUpload = () => {
    // Simulate file upload
    const newFile = {
      id: Date.now(),
      name: "homework_submission.pdf",
      type: "PDF",
      uploadedAt: new Date().toISOString()
    };
    
    setUploadedFiles([...uploadedFiles, newFile]);
    toast({
      title: "File Uploaded",
      description: "Your homework has been submitted successfully!",
    });
  };

  const handleSubmitResponse = () => {
    if (!textResponse.trim()) return;
    
    toast({
      title: "Response Submitted",
      description: "Your written response has been submitted for review.",
    });
    setTextResponse("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "writing":
        return FileText;
      case "audio":
        return Mic;
      case "reading":
        return BookOpen;
      default:
        return FileText;
    }
  };

  if (selectedTask) {
    const task = tasks.find(t => t.id === selectedTask);
    if (!task) return null;

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => setSelectedTask(null)}>
            ← Back to Tasks
          </Button>
          <Badge className={getStatusColor(task.status)}>
            {task.status}
          </Badge>
        </div>

        <Card className="flex-1 p-4">
          <h3 className="font-semibold mb-2">{task.title}</h3>
          <p className="text-sm text-gray-600 mb-4">{task.description}</p>
          
          <div className="space-y-4">
            {/* Text Response */}
            <div>
              <label className="text-sm font-medium mb-2 block">Your Response:</label>
              <Textarea
                placeholder="Type your answer here..."
                value={textResponse}
                onChange={(e) => setTextResponse(e.target.value)}
                rows={4}
              />
              <Button 
                size="sm" 
                className="mt-2"
                onClick={handleSubmitResponse}
                disabled={!textResponse.trim()}
              >
                <Send size={14} className="mr-1" />
                Submit Response
              </Button>
            </div>

            {/* File Upload */}
            <div>
              <label className="text-sm font-medium mb-2 block">Upload Files:</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">Drop files here or click to upload</p>
                <Button size="sm" variant="outline" onClick={handleFileUpload}>
                  Choose Files
                </Button>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <FileText size={16} className="text-blue-600" />
                      <span className="text-sm">{file.name}</span>
                      <CheckCircle size={16} className="text-green-600 ml-auto" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Audio Recording */}
            {task.type === "audio" && (
              <div>
                <label className="text-sm font-medium mb-2 block">Voice Recording:</label>
                <Button variant="outline" className="w-full">
                  <Mic size={16} className="mr-2" />
                  Start Recording
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Active Tasks */}
      <div className="mb-4">
        <h4 className="font-medium mb-3 text-gray-700">Current Tasks</h4>
        <div className="space-y-2">
          {tasks.map((task) => {
            const IconComponent = getTypeIcon(task.type);
            return (
              <Card 
                key={task.id}
                className="p-3 cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => setSelectedTask(task.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded">
                      <IconComponent size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{task.title}</h5>
                      <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <Clock size={10} className="mr-1" />
                          {task.dueDate}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {task.points} XP
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(task.status)} text-xs`}>
                    {task.status}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Learning Materials */}
      <div className="flex-1">
        <h4 className="font-medium mb-3 text-gray-700">Learning Materials</h4>
        <div className="space-y-2">
          {materials.map((material) => (
            <Card key={material.id} className="p-3">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded">
                  {material.type === "Audio" ? (
                    <Mic size={16} className="text-purple-600" />
                  ) : (
                    <FileText size={16} className="text-purple-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-sm">{material.title}</h5>
                  <Badge variant="outline" className="text-xs mt-1">
                    {material.type}
                  </Badge>
                </div>
                <Button size="sm" variant="outline">
                  Open
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
