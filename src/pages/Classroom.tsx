
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { ClassroomContent } from "./ClassroomContent";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { ClassroomHeader } from "@/components/classroom/ClassroomHeader";
import { ClassroomVideo } from "@/components/classroom/ClassroomVideo";
import { ClassroomControls } from "@/components/classroom/ClassroomControls";
import { ParticipantsList } from "@/components/classroom/ParticipantsList";

const Classroom = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { languageText } = useLanguage();
  const [studentName, setStudentName] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  
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
    
    if (!isHandRaised) {
      toast({
        title: languageText.handRaised,
        description: languageText.teacherNotified,
      });
    } else {
      toast({
        title: languageText.handLowered,
        description: languageText.handLoweredDesc,
      });
    }
  };
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Create participants list for the sidebar
  const participants = [
    {
      name: classDetails.teacher,
      isTeacher: true,
    },
    {
      name: studentName,
      isCurrentUser: true,
      isMuted,
      isVideoOff,
      isHandRaised,
    },
    ...["Emma", "Liam", "Olivia", "Noah", "Sophia", "Jackson"].map((name, index) => ({
      name,
      isMuted: index % 3 === 0,
      isVideoOff: index % 2 === 0,
      isHandRaised: index === 1,
    })),
  ];
  
  // Prepare the main content for the classroom layout
  const mainContent = (
    <>
      <ClassroomHeader 
        title={classDetails.title} 
        teacher={classDetails.teacher} 
        time={classDetails.time} 
      />
      
      <ClassroomVideo teacher={classDetails.teacher} />
      
      <ClassroomControls
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isHandRaised={isHandRaised}
        isChatOpen={isChatOpen}
        toggleMute={toggleMute}
        toggleVideo={toggleVideo}
        toggleHand={toggleHand}
        toggleChat={toggleChat}
      />
      
      <div className="bg-white rounded-lg p-6 border">
        <ClassroomContent />
      </div>
    </>
  );
  
  // Sidebar content with participants list
  const sidebarContent = <ParticipantsList participants={participants} />;
  
  return (
    <ClassroomLayout
      studentName={studentName}
      points={points}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
};

export default Classroom;
