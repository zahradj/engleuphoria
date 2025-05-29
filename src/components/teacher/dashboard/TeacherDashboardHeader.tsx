
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TeacherDashboardHeaderProps {
  teacherName: string;
  onLogout: () => void;
}

export const TeacherDashboardHeader = ({ teacherName, onLogout }: TeacherDashboardHeaderProps) => {
  const { languageText } = useLanguage();
  
  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-b py-4 shadow-lg">
      <div className="container max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <h1 className="text-xl font-bold">{languageText.teacherDashboard}</h1>
          <span className="bg-purple-500 text-xs px-2 py-1 rounded-full ml-2">Teacher</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium">👨‍🏫 {teacherName}</span>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onLogout} 
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            {languageText.logOut}
          </Button>
        </div>
      </div>
    </header>
  );
};
