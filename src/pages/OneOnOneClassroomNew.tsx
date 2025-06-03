
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  Settings, 
  Circle,
  Maximize2,
  MessageCircle,
  FileText,
  BookOpen,
  Gamepad2,
  Star,
  Timer,
  Upload,
  Send,
  Smile
} from "lucide-react";
import { OneOnOneWhiteboard } from "@/components/classroom/oneonone/OneOnOneWhiteboard";
import { OneOnOneAIAssistant } from "@/components/classroom/oneonone/OneOnOneAIAssistant";
import { OneOnOneGames } from "@/components/classroom/oneonone/OneOnOneGames";
import { OneOnOneHomework } from "@/components/classroom/oneonone/OneOnOneHomework";
import { OneOnOneChat } from "@/components/classroom/oneonone/OneOnOneChat";
import { OneOnOneRewards } from "@/components/classroom/oneonone/OneOnOneRewards";

const OneOnOneClassroomNew = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [classTime, setClassTime] = useState(0);
  const [activeRightTab, setActiveRightTab] = useState("chat");
  const [activeCenterTab, setActiveCenterTab] = useState("whiteboard");
  const [studentXP, setStudentXP] = useState(1250);
  const [studentLevel, setStudentLevel] = useState("Intermediate");
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const { toast } = useToast();

  // Class timer
  useEffect(() => {
    const timer = setInterval(() => {
      setClassTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording ? "Class recording has been stopped" : "Class is now being recorded",
    });
  };

  const awardPoints = () => {
    setStudentXP(prev => prev + 50);
    setShowRewardPopup(true);
    setTimeout(() => setShowRewardPopup(false), 3000);
    toast({
      title: "🌟 Great Job!",
      description: "Emma earned 50 XP points!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      {/* Top Bar */}
      <Card className="mb-4 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer size={20} className="text-blue-600" />
              <span className="font-mono text-lg font-semibold">{formatTime(classTime)}</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <span className="font-semibold">Emma Thompson</span>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {studentLevel}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={isMuted ? "destructive" : "outline"}
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
            </Button>
            
            <Button
              variant={isCameraOff ? "destructive" : "outline"}
              size="sm"
              onClick={() => setIsCameraOff(!isCameraOff)}
            >
              {isCameraOff ? <CameraOff size={16} /> : <Camera size={16} />}
            </Button>
            
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              onClick={toggleRecording}
              className={isRecording ? "animate-pulse" : ""}
            >
              <Circle size={16} className={isRecording ? "fill-current" : ""} />
              {isRecording ? "Stop" : "Record"}
            </Button>
            
            <Button variant="outline" size="sm">
              <Settings size={16} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Classroom Layout */}
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-180px)]">
        
        {/* Left Panel - Teacher Video */}
        <div className="col-span-3">
          <Card className="h-full p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">Ms. Johnson</h3>
              <Button variant="ghost" size="sm">
                <Maximize2 size={16} />
              </Button>
            </div>
            
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              {isCameraOff ? (
                <div className="text-center">
                  <CameraOff size={48} className="text-gray-400 mx-auto mb-2" />
                  <span className="text-gray-500">Camera Off</span>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                  <span className="text-teal-700 font-medium">Teacher Video</span>
                </div>
              )}
              
              {isMuted && (
                <div className="absolute bottom-2 left-2 bg-red-500 rounded-full p-1">
                  <MicOff size={12} className="text-white" />
                </div>
              )}
            </div>
            
            <OneOnOneRewards 
              studentXP={studentXP} 
              onAwardPoints={awardPoints}
              showRewardPopup={showRewardPopup}
            />
          </Card>
        </div>

        {/* Center Panel - Interactive Content */}
        <div className="col-span-6">
          <Card className="h-full shadow-lg">
            <div className="border-b p-3">
              <div className="flex gap-1">
                <Button
                  variant={activeCenterTab === "whiteboard" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveCenterTab("whiteboard")}
                >
                  <FileText size={16} className="mr-1" />
                  Whiteboard
                </Button>
                <Button
                  variant={activeCenterTab === "ai" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveCenterTab("ai")}
                >
                  <Star size={16} className="mr-1" />
                  AI Assistant
                </Button>
                <Button
                  variant={activeCenterTab === "games" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveCenterTab("games")}
                >
                  <Gamepad2 size={16} className="mr-1" />
                  Activities
                </Button>
              </div>
            </div>
            
            <div className="p-4 h-[calc(100%-80px)]">
              {activeCenterTab === "whiteboard" && <OneOnOneWhiteboard />}
              {activeCenterTab === "ai" && <OneOnOneAIAssistant />}
              {activeCenterTab === "games" && <OneOnOneGames />}
            </div>
          </Card>
        </div>

        {/* Right Panel - Student & Interactions */}
        <div className="col-span-3">
          <Card className="h-full shadow-lg flex flex-col">
            {/* Student Video */}
            <div className="p-4 border-b">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">Emma</h3>
                <Badge className="bg-yellow-100 text-yellow-700">
                  {Math.floor(studentXP / 100)} Level
                </Badge>
              </div>
              
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center relative">
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <span className="text-purple-700 font-medium">Student Video</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b p-2">
              <div className="flex gap-1">
                <Button
                  variant={activeRightTab === "chat" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveRightTab("chat")}
                >
                  <MessageCircle size={14} className="mr-1" />
                  Chat
                </Button>
                <Button
                  variant={activeRightTab === "homework" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveRightTab("homework")}
                >
                  <BookOpen size={14} className="mr-1" />
                  Tasks
                </Button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-3 overflow-hidden">
              {activeRightTab === "chat" && <OneOnOneChat />}
              {activeRightTab === "homework" && <OneOnOneHomework />}
            </div>
          </Card>
        </div>
      </div>

      {/* Floating Reward Popup */}
      {showRewardPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-scale-in">
          <Card className="p-6 text-center bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300">
            <div className="text-4xl mb-2">🌟</div>
            <h3 className="font-bold text-lg text-orange-800">Excellent Work!</h3>
            <p className="text-orange-700">+50 XP Earned!</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OneOnOneClassroomNew;
