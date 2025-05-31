
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface TeacherDashboardHeaderProps {
  teacherName: string;
  onLogout: () => void;
}

export const TeacherDashboardHeader = ({ teacherName, onLogout }: TeacherDashboardHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 shadow-sm">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{teacherName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Welcome, {teacherName}!</h1>
              <p className="text-sm text-gray-600">Teacher Dashboard</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
