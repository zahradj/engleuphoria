
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";

// Import our custom components
import { VideoConferencePanel } from "@/components/classroom/VideoConferencePanel";
import { ESLWhiteboard } from "@/components/classroom/ESLWhiteboard";
import { ClassroomChat } from "@/components/classroom/ClassroomChat";
import { TeachingMaterial } from "@/components/classroom/TeachingMaterial";
import { ToolsPanel } from "@/components/classroom/ToolsPanel";

const ESLClassroom = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { languageText } = useLanguage();
  
  // User states
  const [studentName, setStudentName] = useState<string>("Student");
  const [teacherName, setTeacherName] = useState<string>("Teacher");
  const [points, setPoints] = useState<number>(0);
  
  // Media states
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  
  // Layout states
  const [currentLayout, setCurrentLayout] = useState<"default" | "material" | "video" | "whiteboard">("default");
  const [showWhiteboard, setShowWhiteboard] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(true);
  
  // Lesson material states
  const [materialPage, setMaterialPage] = useState<number>(1);
  const [materialType, setMaterialType] = useState<"pdf" | "image" | "video" | "interactive">("pdf");
  const [materialSource, setMaterialSource] = useState<string>("sample-lesson.pdf");
  
  // Mock video feeds for the example
  const videoFeeds = [
    {
      id: "teacher1",
      name: teacherName,
      isTeacher: true,
      isMuted: false,
      isCameraOff: false,
    },
    {
      id: "student1",
      name: studentName,
      isTeacher: false,
      isMuted,
      isCameraOff: isVideoOff,
      isHandRaised,
    }
  ];
  
  useEffect(() => {
    // In a real app, we'd fetch this from an API
    const storedName = localStorage.getItem("studentName");
    
    if (!storedName) {
      // For demo, set a default
      setStudentName("Emma");
      localStorage.setItem("studentName", "Emma");
    } else {
      setStudentName(storedName);
    }
    
    // Mock teacher name
    setTeacherName("Ms. Smith");
    
    // Connect to video/audio streams
    // This would use WebRTC or a similar technology in a real app
    console.log("Connecting to classroom streams...");
    
    // Show welcome toast
    toast({
      title: languageText.welcome,
      description: `${languageText.yourTeacherIs} ${teacherName}`,
    });
  }, [navigate, toast, languageText]);
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    toast({
      title: isMuted ? languageText.microphoneEnabled : languageText.microphoneDisabled,
      description: isMuted ? languageText.youCanNowSpeak : languageText.youAreMuted,
    });
  };
  
  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    
    toast({
      title: isVideoOff ? languageText.cameraEnabled : languageText.cameraDisabled,
      description: isVideoOff ? languageText.youAreNowVisible : languageText.youAreNowHidden,
    });
  };
  
  const toggleHand = () => {
    setIsHandRaised(!isHandRaised);
    
    toast({
      title: isHandRaised ? languageText.handLowered : languageText.handRaised,
      description: isHandRaised ? languageText.handLoweredDesc : languageText.teacherNotified,
    });
  };
  
  const handleLayoutChange = (layout: string) => {
    setCurrentLayout(layout as any);
    
    // Adjust components visibility based on layout
    if (layout === 'material') {
      setShowWhiteboard(false);
    } else if (layout === 'whiteboard') {
      setShowWhiteboard(true);
    }
  };

  const handleFeedToggleMute = (id: string) => {
    if (id === "student1") toggleMute();
  };

  const handleFeedToggleVideo = (id: string) => {
    if (id === "student1") toggleVideo();
  };

  const handleFeedToggleHand = (id: string) => {
    if (id === "student1") toggleHand();
  };

  const showGames = () => {
    toast({
      title: languageText.games,
      description: "Opening educational games...",
    });
  };

  const showRewards = () => {
    toast({
      title: languageText.rewards,
      description: "Opening rewards dashboard...",
    });
  };

  const startTimer = () => {
    toast({
      title: languageText.timer,
      description: "Starting 5-minute activity timer...",
    });
  };

  const uploadMaterial = () => {
    toast({
      title: languageText.upload,
      description: "Opening file upload dialog...",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="bg-white border-b shadow-sm py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-lg">ESL Classroom</h1>
            <Badge variant="outline" className="bg-purple/10 text-purple border-purple/20">
              {teacherName}'s Class
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium">
              {studentName} • <span className="text-muted-foreground">{points} {languageText.points}</span>
            </div>
            
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              {languageText.leaveClass}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-4 px-4">
        {/* Classroom tools panel */}
        <ToolsPanel
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          isHandRaised={isHandRaised}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideo}
          onToggleHand={toggleHand}
          onShowGames={showGames}
          onLayoutChange={handleLayoutChange}
          onShowRewards={showRewards}
          onStartTimer={startTimer}
          onUploadMaterial={uploadMaterial}
        />
        
        {/* Alert for first-time users */}
        <Alert className="my-4 bg-blue-50 border-blue-200">
          <AlertTitle>Welcome to ESL Classroom!</AlertTitle>
          <AlertDescription>
            This is a 1-on-1 lesson environment. Your teacher can see and hear you when your camera and microphone are enabled.
            Use the whiteboard together, chat, or work on activities. If you need help, raise your hand.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
          {/* Main content area - adapts based on layout */}
          <div className={`${currentLayout === "default" ? "lg:col-span-3" : "lg:col-span-4"} space-y-4`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Video panel - full width in video focus mode */}
              <div className={`${currentLayout === "video" ? "md:col-span-2" : currentLayout === "material" ? "md:col-span-2 hidden" : ""}`}>
                <VideoConferencePanel
                  feeds={videoFeeds}
                  onToggleMute={handleFeedToggleMute}
                  onToggleCamera={handleFeedToggleVideo}
                  onRaiseHand={handleFeedToggleHand}
                  currentUserId="student1"
                />
              </div>
              
              {/* Teaching material - full width in material focus mode */}
              <div className={`${currentLayout === "material" ? "md:col-span-2" : currentLayout === "video" ? "hidden" : ""}`}>
                <TeachingMaterial
                  materialType={materialType}
                  source={materialSource}
                  currentPage={materialPage}
                  totalPages={5}
                  onPageChange={setMaterialPage}
                  allowAnnotation={true}
                />
              </div>
            </div>
            
            {/* Whiteboard - full height in whiteboard mode */}
            <div className={currentLayout === "whiteboard" ? "" : ""}>
              <ESLWhiteboard />
            </div>
          </div>
          
          {/* Sidebar - hidden in non-default layouts */}
          {currentLayout === "default" && (
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <ClassroomChat
                  teacherName={teacherName}
                  studentName={studentName}
                />
                
                {/* Floating video when in material focus mode */}
                {currentLayout === "material" && (
                  <VideoConferencePanel
                    feeds={videoFeeds.filter(feed => feed.id === "student1")}
                    onToggleMute={handleFeedToggleMute}
                    onToggleCamera={handleFeedToggleVideo}
                    onRaiseHand={handleFeedToggleHand}
                    currentUserId="student1"
                    compact={true}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ESLClassroom;

// Add Badge component since we're using it
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
