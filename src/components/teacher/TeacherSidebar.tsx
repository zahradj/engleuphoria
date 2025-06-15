
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
  FolderOpen
} from "lucide-react";

interface TeacherSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const TeacherSidebar = ({ activeTab, setActiveTab, onLogout }: TeacherSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, type: 'tab' },
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
    { id: 'settings', label: 'Settings', icon: Settings, type: 'tab' }
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Engleuphoria
            </h1>
            <p className="text-sm text-gray-500">Teacher Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.type === 'page') {
            return (
              <Link key={item.id} to={item.path}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              </Link>
            );
          }
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-3 h-12 ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );
};
