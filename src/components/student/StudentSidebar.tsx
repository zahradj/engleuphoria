
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  User, 
  Calendar, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  MessageCircle, 
  FolderOpen, 
  CreditCard, 
  Award, 
  Settings, 
  LogOut 
} from "lucide-react";

interface StudentSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const StudentSidebar = ({ activeTab, setActiveTab, onLogout }: StudentSidebarProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, type: 'tab' },
    { id: 'profile', label: 'Profile', icon: User, type: 'tab' },
    { id: 'classes', label: 'Upcoming Classes', icon: Calendar, type: 'tab' },
    { id: 'history', label: 'Lesson History', icon: BookOpen, type: 'tab' },
    { id: 'homework', label: 'Homework', icon: FileText, type: 'tab' },
    { id: 'progress', label: 'Progress Tracker', icon: TrendingUp, type: 'tab' },
    { id: 'chat', label: 'Chat with Teacher', icon: MessageCircle, type: 'tab' },
    { id: 'materials', label: 'Materials Library', icon: FolderOpen, type: 'page', path: '/material-library' },
    { id: 'billing', label: 'Payment & Billing', icon: CreditCard, type: 'tab' },
    { id: 'certificates', label: 'Certificates', icon: Award, type: 'tab' },
    { id: 'settings', label: 'Settings', icon: Settings, type: 'tab' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Engleuphoria
            </h1>
            <p className="text-sm text-gray-500">Student Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.type === 'page') {
            return (
              <Link key={item.id} to={item.path}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
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
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
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
