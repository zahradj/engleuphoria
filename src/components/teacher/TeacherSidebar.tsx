import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Brain,
  Calendar, 
  Users, 
  Clock, 
  FileText, 
  BookOpen, 
  MessageSquare, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  LogOut,
  GraduationCap,
  Book,
  FolderOpen,
  User,
  Sparkles
} from "lucide-react";

interface TeacherSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const TeacherSidebar = ({ activeTab, setActiveTab, onLogout }: TeacherSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, type: 'tab' },
    { id: 'profile', label: 'My Profile', icon: User, type: 'tab' },
    { id: 'ai-generator', label: 'Curriculum Architect', icon: Sparkles, type: 'tab' },
    { id: 'ai-assistant', label: 'AI Curriculum', icon: Brain, type: 'tab' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, type: 'tab' },
    { id: 'students', label: 'Students', icon: Users, type: 'tab' },
    { id: 'reading-library', label: 'Reading Library', icon: Book, type: 'tab' },
    { id: 'curriculum', label: 'Curriculum Library', icon: FolderOpen, type: 'page', path: '/curriculum-library' },
    { id: 'history', label: 'Lesson History', icon: Clock, type: 'tab' },
    { id: 'assignments', label: 'Assignments', icon: FileText, type: 'tab' },
    { id: 'resources', label: 'Resources', icon: BookOpen, type: 'tab' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, type: 'tab' },
    { id: 'earnings', label: 'Earnings', icon: DollarSign, type: 'tab' },
    { id: 'reports', label: 'Reports', icon: TrendingUp, type: 'tab' },
    { id: 'enterprise', label: 'Enterprise Hub', icon: BarChart3, type: 'tab' },
    { id: 'settings', label: 'Settings', icon: Settings, type: 'tab' }
  ];

  return (
    <div className="w-64 flex-shrink-0 border-r bg-gray-50 dark:bg-gray-900 dark:border-gray-700 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b dark:border-gray-700">
        <GraduationCap className="h-8 w-8 text-blue-500" />
        <span className="ml-2 text-lg font-semibold">Teacher Panel</span>
      </div>
      
      <div className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          if (item.type === 'page') {
            return (
              <Link key={item.id} to={item.path}>
                <Button
                  variant="ghost"
                  className="justify-start w-full"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          }
          
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className="justify-start w-full"
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </div>
      
      <div className="p-4 border-t dark:border-gray-700">
        <Button variant="outline" className="w-full" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};
