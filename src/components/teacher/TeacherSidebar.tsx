
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Calendar, 
  Users, 
  BookOpen, 
  FileText, 
  FolderOpen, 
  MessageCircle, 
  DollarSign, 
  BarChart3, 
  Settings, 
  LogOut 
} from "lucide-react";

interface TeacherSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const TeacherSidebar = ({ activeTab, setActiveTab, onLogout }: TeacherSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'students', label: 'My Students', icon: Users },
    { id: 'history', label: 'Lesson History', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'resources', label: 'Resource Library', icon: FolderOpen },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-teal-600">Teacher Portal</h1>
        <p className="text-sm text-gray-600">English Learning Platform</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-3 text-left ${
                isActive 
                  ? "bg-teal-500 text-white hover:bg-teal-600" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};
