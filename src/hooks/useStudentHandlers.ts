
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const useStudentHandlers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleScheduleLesson = () => {
    navigate("/student-lesson-scheduler");
  };

  const handleJoinClass = () => {
    navigate("/media-test?roomId=unified-classroom-1&role=student&name=Student&userId=student-1");
  };

  const handleViewProgress = () => {
    toast({
      title: "Progress Report",
      description: "Opening your detailed progress report...",
    });
    // This would typically open a progress modal or navigate to progress page
  };

  const handlePracticeVocabulary = () => {
    toast({
      title: "Vocabulary Practice",
      description: "Starting vocabulary practice session...",
    });
    // This would open vocabulary practice games/exercises
  };

  const handleViewHomework = () => {
    toast({
      title: "Homework Center",
      description: "Opening homework assignments...",
    });
    // This would navigate to homework tab or open homework modal
  };

  const handleSubmitHomework = (assignmentId: string, submission: { text: string; files: File[] }) => {
    // Simulate homework submission
    console.log("Submitting homework:", { assignmentId, submission });
    
    toast({
      title: "Homework Submitted!",
      description: "Your homework has been successfully submitted for review.",
    });
  };

  const handleMessageTeacher = (message: { teacherId: string; subject: string; content: string }) => {
    // Navigate to teachers tab to select and message a teacher
    console.log("Opening teachers to message:", message);
    
    toast({
      title: "Select a Teacher",
      description: "Choose a teacher from your teachers list to send a message.",
    });
  };

  const handleViewMaterials = () => {
    navigate("/material-library");
  };

  const handleBookClass = () => {
    navigate("/discover-teachers");
  };

  return {
    handleScheduleLesson,
    handleJoinClass,
    handleViewProgress,
    handlePracticeVocabulary,
    handleViewHomework,
    handleSubmitHomework,
    handleMessageTeacher,
    handleViewMaterials,
    handleBookClass,
  };
};
