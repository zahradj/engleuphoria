import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  MessageSquare, 
  BookOpen, 
  Users, 
  Settings,
  Maximize2,
  Minimize2,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Hand,
  Star
} from 'lucide-react';

interface CleanClassroomLayoutProps {
  children: React.ReactNode;
  currentUser: {
    id: string;
    role: 'teacher' | 'student';
    name: string;
  };
  enhancedClassroom?: any;
  onAwardPoints?: (points: number, reason: string) => void;
}

export function CleanClassroomLayout({
  children,
  currentUser,
  enhancedClassroom,
  onAwardPoints
}: CleanClassroomLayoutProps) {
  const [activeTab, setActiveTab] = useState('lesson');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const VideoControls = () => (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant={enhancedClassroom?.isMuted ? "destructive" : "outline"}
        onClick={() => enhancedClassroom?.toggleMicrophone()}
        className="hover-lift smooth-transition"
      >
        {enhancedClassroom?.isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      
      <Button
        size="sm"
        variant={enhancedClassroom?.isCameraOff ? "destructive" : "outline"}
        onClick={() => enhancedClassroom?.toggleCamera()}
        className="hover-lift smooth-transition"
      >
        {enhancedClassroom?.isCameraOff ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
      </Button>

      {currentUser.role === 'student' && (
        <Button
          size="sm"
          variant="outline"
          className="hover-lift smooth-transition"
        >
          <Hand className="h-4 w-4" />
        </Button>
      )}

      <Button
        size="sm"
        variant="outline"
        onClick={toggleFullscreen}
        className="hover-lift smooth-transition"
      >
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </Button>
    </div>
  );

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Top Control Bar */}
      <div className="h-16 bg-card border-b clean-border flex items-center justify-between px-6 professional-shadow">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {enhancedClassroom?.isConnected ? 'Connected' : 'Connecting...'}
          </Badge>
          
          {currentUser.role === 'teacher' && onAwardPoints && (
            <Button
              size="sm"
              onClick={() => onAwardPoints(10, 'Great participation!')}
              className="hover-lift smooth-transition"
            >
              <Star className="h-4 w-4 mr-2" />
              Award Points
            </Button>
          )}
        </div>

        <VideoControls />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Video Panel */}
        <div className="w-80 bg-card border-r clean-border p-4 space-y-4">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <Video className="h-12 w-12 text-muted-foreground" />
          </div>
          
          {enhancedClassroom?.participants?.length > 1 && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Participants</h3>
              <div className="space-y-1">
                {enhancedClassroom.participants.map((participant: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-3 w-3" />
                    </div>
                    <span className="text-sm">{participant.displayName || 'User'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b clean-border px-6 py-2">
              <TabsList className="h-10">
                <TabsTrigger value="lesson" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Lesson
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="tools" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Tools
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="lesson" className="flex-1 p-6">
              <Card className="h-full professional-shadow">
                <CardContent className="p-6 h-full">
                  {children}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="flex-1 p-6">
              <Card className="h-full professional-shadow">
                <CardContent className="p-6 h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Chat feature coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tools" className="flex-1 p-6">
              <Card className="h-full professional-shadow">
                <CardContent className="p-6 h-full flex items-center justify-center">
                  <div className="text-center">
                    <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Additional tools coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}