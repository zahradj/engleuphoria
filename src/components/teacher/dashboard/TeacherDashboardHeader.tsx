
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { LogOut, Settings } from "lucide-react";

interface TeacherDashboardHeaderProps {
  teacherName: string;
  onLogout: () => void;
}

export const TeacherDashboardHeader = ({ teacherName, onLogout }: TeacherDashboardHeaderProps) => {
  const { languageText } = useLanguage();

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-b py-6 shadow-lg">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-white/20">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{teacherName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {teacherName}!</h1>
              <p className="text-indigo-100">Manage your classes and students</p>
              <Badge variant="secondary" className="mt-1 bg-white/20 text-white">
                Teacher Dashboard
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="text-indigo-600 border-white bg-white hover:bg-indigo-50">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout} className="text-indigo-600 border-white bg-white hover:bg-indigo-50">
              <LogOut className="mr-2 h-4 w-4" />
              {languageText.logout || "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
