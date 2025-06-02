
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Calendar, 
  Users, 
  History, 
  FileText, 
  FolderOpen, 
  MessageCircle, 
  DollarSign, 
  BarChart, 
  Settings, 
  LogOut,
  Sparkles
} from "lucide-react";

interface TeacherSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const TeacherSidebar = ({ activeTab, setActiveTab, onLogout }: TeacherSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'students', label: 'My Students', icon: Users },
    { id: 'history', label: 'Lesson History', icon: History },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'resources', label: 'Resource Library', icon: FolderOpen },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: BarChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-teal-600">Teacher Portal</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === item.id 
                  ? "bg-teal-500 hover:bg-teal-600 text-white" 
                  : "hover:bg-gray-100"
              } ${item.id === 'ai-assistant' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
              {item.id === 'ai-assistant' && (
                <Sparkles className="h-4 w-4 ml-auto" />
              )}
            </Button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};
