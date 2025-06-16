import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

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
      description: "Your progress report will be available soon!",
    });
  };

  const handlePracticeVocabulary = () => {
    toast({
      title: "Vocabulary Practice",
      description: "Vocabulary practice activities coming soon!",
    });
  };

  const handleViewHomework = () => {
    toast({
      title: "Homework",
      description: "Homework assignments will be available soon!",
    });
  };

  return {
    handleScheduleLesson,
    handleJoinClass,
    handleViewProgress,
    handlePracticeVocabulary,
    handleViewHomework,
  };
};
