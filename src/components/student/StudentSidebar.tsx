
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Mic, 
  CreditCard, 
  User, 
  Settings,
  LogOut
} from "lucide-react";

interface StudentSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

export const StudentSidebar = ({ activeTab, setActiveTab, onLogout }: StudentSidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "upcoming-classes", label: "Upcoming Classes", icon: Calendar },
    { id: "homework", label: "Homework", icon: BookOpen },
    { id: "materials", label: "Materials", icon: FileText },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "speaking", label: "Speaking Practice", icon: Mic },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive 
                    ? "bg-purple-600 text-white hover:bg-purple-700" 
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
                {item.id === "homework" && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    2
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
};
