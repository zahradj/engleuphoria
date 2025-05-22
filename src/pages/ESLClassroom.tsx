
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { ESLWhiteboard } from "@/components/classroom/ESLWhiteboard";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  LucideIcon,
  MessageSquare,
  Pencil,
  Plus,
  Presentation,
} from "lucide-react";
import { VideoConferencePanel } from "@/components/classroom/VideoConferencePanel";
import { ToolsPanel } from "@/components/classroom/ToolsPanel";
import { ClassroomChat } from "@/components/classroom/ClassroomChat";
import { TeachingMaterial } from "@/components/classroom/TeachingMaterial";
import { StudentsTab } from "@/components/classroom/tabs/StudentsTab";
import { LessonTab } from "@/components/classroom/tabs/LessonTab";

// Define types for layout options
type LayoutType = "gallery" | "spotlight" | "sidebar" | "default" | "material" | "video";

// Mock data for participants
const mockVideoFeeds = [
  {
    id: "teacher1",
    name: "Ms. Johnson",
    isTeacher: true,
    isMuted: false,
    isCameraOff: false,
  },
  {
    id: "student1",
    name: "Current Student",
    isTeacher: false,
    isMuted: true,
    isCameraOff: false,
    isHandRaised: false,
  },
  {
    id: "student2",
    name: "Emma",
    isTeacher: false,
    isMuted: true,
    isCameraOff: true,
  },
];

// Mock quiz questions
const mockQuizQuestions = [
  {
    id: "q1",
    question: "What sound does a dog make?",
    options: ["Meow", "Woof", "Moo", "Tweet"],
    correctAnswer: "Woof",
  },
  {
    id: "q2",
    question: "What sound does a cat make?",
    options: ["Meow", "Woof", "Moo", "Tweet"],
    correctAnswer: "Meow",
  },
];

// Mock student data
const mockStudents = [
  {
    id: "student1",
    name: "Current Student",
    avatar: "https://github.com/shadcn.png",
    status: "speaking",
    isCurrentUser: true,
  },
  {
    id: "student2",
    name: "Emma",
    avatar: "https://github.com/sadmann7.png",
    status: "online",
    isCurrentUser: false,
  },
  {
    id: "student3",
    name: "Noah",
    avatar: "https://github.com/emilkowalski.png",
    status: "offline",
    isCurrentUser: false,
  },
];

const ESLClassroom = () => {
  const [studentName, setStudentName] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const [layout, setLayout] = useState<LayoutType>("default");
  const [activeTab, setActiveTab] = useState("video");
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTeacherView, setIsTeacherView] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { languageText } = useLanguage();

  useEffect(() => {
    // In a real app, we'd fetch this from an API
    const storedName = localStorage.getItem("studentName");
    const storedPoints = localStorage.getItem("points");
    const storedIsTeacher = localStorage.getItem("isTeacher");

    if (!storedName) {
      navigate("/");
      return;
    }

    setStudentName(storedName);
    setPoints(storedPoints ? parseInt(storedPoints) : 0);
    setIsTeacherView(storedIsTeacher === "true");
  }, [navigate]);

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
    
    toast({
      title: languageText.layoutChanged,
      description: `${languageText.switchedTo} ${newLayout} ${languageText.view}`,
    });
  };

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

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleQuizComplete = (score: number, total: number) => {
    const newPoints = points + score;
    setPoints(newPoints);
    localStorage.setItem("points", newPoints.toString());
    
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score} out of ${total} and earned ${score} points!`,
    });
  };

  const handleMessageStudent = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    setIsChatOpen(true);
    toast({
      title: `Messaging ${student?.name}`,
      description: "Private chat opened",
    });
  };

  const handleToggleSpotlight = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    setLayout("spotlight");
    toast({
      title: `Spotlighting ${student?.name}`,
      description: "Student is now in spotlight view",
    });
  };

  const mainContent = (
    <div className="space-y-4">
      <ToolsPanel
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isHandRaised={isHandRaised}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onToggleHand={toggleHand}
        onShowGames={() => toast({ title: "Games", description: "Opening games panel" })}
        onLayoutChange={handleLayoutChange}
        onShowRewards={() => toast({ title: "Rewards", description: "Opening rewards panel" })}
        onStartTimer={() => toast({ title: "Timer", description: "Starting timer" })}
        onUploadMaterial={() => toast({ title: "Upload", description: "Opening upload dialog" })}
      />

      <Tabs defaultValue="video" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="video">Video & Slides</TabsTrigger>
          <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
          <TabsTrigger value="students">{isTeacherView ? "Students" : "Lesson"}</TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <TeachingMaterial
                materialType="pdf"
                source="ESL_Animals_Lesson.pdf"
                currentPage={1}
                totalPages={5}
                allowAnnotation
              />
            </div>
            <div>
              <VideoConferencePanel
                feeds={mockVideoFeeds.map(feed => ({
                  ...feed,
                  isHandRaised: feed.id === "student1" ? isHandRaised : false
                }))}
                currentUserId="student1"
                onToggleMute={(id) => id === "student1" && toggleMute()}
                onToggleCamera={(id) => id === "student1" && toggleVideo()}
                onRaiseHand={(id) => id === "student1" && toggleHand()}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="whiteboard" className="pt-4">
          <ESLWhiteboard isCollaborative={true} />
        </TabsContent>

        <TabsContent value="students" className="pt-4">
          {isTeacherView ? (
            <StudentsTab
              students={mockStudents}
              onMessageStudent={handleMessageStudent}
              onToggleSpotlight={handleToggleSpotlight}
            />
          ) : (
            <LessonTab
              quizQuestions={mockQuizQuestions}
              onQuizComplete={handleQuizComplete}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  const sidebarContent = (
    <div className="space-y-4">
      {isChatOpen ? (
        <ClassroomChat
          teacherName="Ms. Johnson"
          studentName={studentName}
        />
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{languageText.students}</CardTitle>
            </CardHeader>
            <CardContent>
              <Input type="text" placeholder={languageText.searchStudents} className="mb-3" />
              <ul className="space-y-3">
                {mockStudents.map((student) => (
                  <li key={student.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {student.name}
                            {student.isCurrentUser && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                ({languageText.you})
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {student.status === "speaking" && languageText.speaking}
                            {student.status === "online" && languageText.online}
                            {student.status === "offline" && languageText.lastActive} 5m
                          </p>
                        </div>
                      </div>
                      {student.status !== "offline" && (
                        <Badge variant={student.status === "speaking" ? "default" : "secondary"}>
                          {student.status === "speaking" ? languageText.speakingNow : languageText.online}
                        </Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{languageText.resources}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm hover:underline flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    Animal Vocabulary.pdf
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    Animal Sounds.mp3
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    Homework Assignment.docx
                  </a>
                </li>
              </ul>
              
              {isTeacherView && (
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Resource
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {isChatOpen && (
        <Button variant="outline" onClick={toggleChat} className="w-full">
          Close Chat
        </Button>
      )}
    </div>
  );

  return (
    <ClassroomLayout
      studentName={studentName}
      points={points}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
};

export default ESLClassroom;
