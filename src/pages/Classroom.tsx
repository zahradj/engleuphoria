import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/card";
import { StudentHeader } from "@/components/StudentHeader";
import { Mic, MicOff, Users, Video, VideoOff, Hand, MessageCircle, Share } from "lucide-react";

const Classroom = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  
  // In a real app, we'd fetch class details using classId
  const classDetails = {
    title: "Fun with Phonics",
    teacher: "Ms. Johnson",
    time: "Monday, 2:00 PM",
  };
  
  useEffect(() => {
    // In a real app, we'd fetch this from an API
    const storedName = localStorage.getItem("studentName");
    const storedPoints = localStorage.getItem("points");
    
    if (!storedName) {
      navigate("/");
      return;
    }
    
    setStudentName(storedName);
    setPoints(storedPoints ? parseInt(storedPoints) : 0);
  }, [navigate]);
  
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  const toggleHand = () => setIsHandRaised(!isHandRaised);
  
  const openWhiteboard = () => {
    navigate("/whiteboard");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <StudentHeader studentName={studentName} points={points} />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{classDetails.title}</h1>
          <p className="text-muted-foreground">
            {classDetails.teacher} • {classDetails.time}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main video area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Teacher video */}
            <div className="relative bg-muted rounded-lg aspect-video overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-20 w-20 bg-purple/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-purple">T</span>
                  </div>
                  <p className="font-medium">{classDetails.teacher}</p>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                Teacher
              </div>
              
              <div className="absolute bottom-4 left-4">
                <div className="bg-black/50 text-white px-2 py-1 rounded-full flex items-center gap-2 text-sm">
                  <Mic size={14} />
                  Speaking...
                </div>
              </div>
            </div>
            
            {/* Control bar */}
            <div className="bg-white rounded-lg p-3 flex flex-wrap justify-center gap-2 shadow-sm">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-colors ${
                  isMuted ? "bg-destructive text-white" : "bg-muted hover:bg-muted/70"
                }`}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full transition-colors ${
                  isVideoOff ? "bg-destructive text-white" : "bg-muted hover:bg-muted/70"
                }`}
              >
                {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
              </button>
              
              <button
                onClick={toggleHand}
                className={`p-3 rounded-full transition-colors ${
                  isHandRaised ? "bg-yellow text-yellow-dark" : "bg-muted hover:bg-muted/70"
                }`}
              >
                <Hand size={24} />
              </button>
              
              <button
                onClick={openWhiteboard}
                className="p-3 rounded-full bg-muted hover:bg-muted/70 transition-colors"
              >
                <Share size={24} />
              </button>
              
              <button
                className="p-3 rounded-full bg-muted hover:bg-muted/70 transition-colors"
              >
                <MessageCircle size={24} />
              </button>
              
              <button
                className="px-4 py-2 bg-destructive text-white rounded-full ml-2 hover:bg-destructive/90 transition-colors"
                onClick={() => navigate("/dashboard")}
              >
                Leave Class
              </button>
            </div>
            
            {/* Shared content area - placeholder */}
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="font-bold mb-4">Today's Lesson: Animal Sounds</h2>
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Shared content will appear here</p>
              </div>
              <div className="mt-4 text-center">
                <button
                  className="px-4 py-2 bg-purple text-white rounded-full hover:bg-purple/90 transition-colors"
                  onClick={openWhiteboard}
                >
                  Open Whiteboard
                </button>
              </div>
            </div>
          </div>
          
          {/* Participants sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border h-full">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold">Participants</h2>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>8</span>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                {/* Teacher */}
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg mb-2">
                  <div className="h-8 w-8 bg-purple/20 rounded-full flex items-center justify-center">
                    <span className="font-bold text-purple">T</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{classDetails.teacher}</p>
                    <p className="text-xs text-muted-foreground">Teacher</p>
                  </div>
                  <div className="text-xs bg-purple/20 text-purple px-2 py-0.5 rounded-full">
                    Host
                  </div>
                </div>
                
                {/* Current student */}
                <div className="flex items-center gap-2 p-2 bg-yellow-light/50 rounded-lg mb-2">
                  <div className="h-8 w-8 bg-yellow/20 rounded-full flex items-center justify-center">
                    <span className="font-bold text-yellow-dark">
                      {studentName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{studentName} (You)</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {isMuted ? <MicOff size={10} /> : <Mic size={10} />}
                      {isVideoOff ? <VideoOff size={10} /> : <Video size={10} />}
                      {isHandRaised && <Hand size={10} className="text-yellow-dark" />}
                    </div>
                  </div>
                </div>
                
                {/* Other students (placeholders) */}
                {["Emma", "Liam", "Olivia", "Noah", "Sophia", "Jackson"].map((name, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30">
                    <div 
                      className="h-8 w-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `hsl(${(index * 40) % 360}, 70%, 90%)` }}
                    >
                      <span className="font-bold">{name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {index % 3 === 0 ? <MicOff size={10} /> : <Mic size={10} />}
                        {index % 2 === 0 ? <VideoOff size={10} /> : <Video size={10} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Classroom;
