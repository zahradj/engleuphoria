
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Settings,
  BookOpen,
  ClipboardCheck
} from "lucide-react";

interface TeacherDashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const TeacherDashboardSidebar = ({ activeSection, onSectionChange }: TeacherDashboardSidebarProps) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "students", label: "Students", icon: Users },
    { id: "lessons", label: "Lesson Plans", icon: BookOpen },
    { id: "materials", label: "Materials", icon: FileText },
    { id: "grading", label: "Grading", icon: ClipboardCheck },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      {/* Profile Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>FD</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">Fátima Djamina</h3>
            <p className="text-sm text-gray-600">Individual class rate</p>
            <Badge className="mt-1">Teacher</Badge>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Balance</span>
            <span className="font-semibold">$279.60</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Individual class rate</span>
            <span className="font-semibold">$11.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">This week</span>
            <span className="text-sm">Attendance 4</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Account health</span>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-blue-500 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Your Level Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold">Your level</h4>
          <Button variant="link" size="sm" className="text-blue-600 p-0">See details</Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">Basic level 4/6</span>
                <span className="text-sm font-medium">$1.00</span>
              </div>
              <p className="text-xs text-gray-500">Next course level: Major</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">Estimated next level</span>
                <span className="text-sm font-medium">$1.00</span>
              </div>
              <p className="text-xs text-gray-500">Next course level: Major</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 h-10"
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
