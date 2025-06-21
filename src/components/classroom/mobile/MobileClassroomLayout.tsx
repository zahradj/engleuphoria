
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  MessageSquare, 
  Users, 
  BookOpen, 
  Settings,
  Mic,
  MicOff,
  VideoOff,
  Phone,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface MobileClassroomLayoutProps {
  currentUser: {
    id: string;
    name: string;
    role: 'teacher' | 'student';
  };
  videoContent: React.ReactNode;
  chatContent: React.ReactNode;
  whiteboardContent: React.ReactNode;
  studentsContent: React.ReactNode;
  classTime: number;
}

export function MobileClassroomLayout({
  currentUser,
  videoContent,
  chatContent,
  whiteboardContent,
  studentsContent,
  classTime
}: MobileClassroomLayoutProps) {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("whiteboard");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-100/90 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-white/20 p-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentUser.role === 'teacher' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                : 'bg-gradient-to-r from-green-500 to-teal-600'
            }`}>
              <span className="text-white text-sm font-bold">
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="font-semibold text-sm text-gray-800">Classroom</h1>
              <p className="text-xs text-gray-600">{currentUser.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {formatTime(classTime)}
            </Badge>
            <Badge 
              className={`text-xs ${
                currentUser.role === 'teacher' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {currentUser.role === 'teacher' ? 'Teacher' : 'Student'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Collapsible Video Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <button
          onClick={() => setIsVideoExpanded(!isVideoExpanded)}
          className="w-full p-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-800">Video Call</span>
            <Badge className="bg-green-500 text-white text-xs animate-pulse">
              ● Live
            </Badge>
          </div>
          {isVideoExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        {isVideoExpanded && (
          <div className="p-3 pt-0">
            <div className="h-48 rounded-lg overflow-hidden">
              {videoContent}
            </div>
            
            {/* Quick Video Controls */}
            <div className="flex justify-center gap-2 mt-3">
              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                <Mic className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                <Video className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Tabs */}
      <div className="flex-1 p-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4 h-10 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="whiteboard" className="text-xs">
              <BookOpen className="h-3 w-3 mr-1" />
              Board
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="students" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Students
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <Settings className="h-3 w-3 mr-1" />
              More
            </TabsTrigger>
          </TabsList>

          <div className="mt-3 h-[calc(100vh-200px)]">
            <TabsContent value="whiteboard" className="h-full m-0">
              <Card className="h-full p-0 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden">
                {whiteboardContent}
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="h-full m-0">
              <Card className="h-full p-0 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden">
                {chatContent}
              </Card>
            </TabsContent>

            <TabsContent value="students" className="h-full m-0">
              <Card className="h-full p-0 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden">
                {studentsContent}
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="h-full m-0">
              <Card className="h-full p-4 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Classroom Settings</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Audio Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      Video Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Teaching Tools
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
