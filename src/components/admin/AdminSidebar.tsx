import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
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
  File,
  LogOut
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const { signOut } = useAuth();
  
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "teacher-applications", label: "Teacher Applications", icon: FileText },
    { id: "assignments", label: "Assignments", icon: File },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "moderation", label: "Moderation", icon: Mic },
    { id: "reports", label: "Reports", icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
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
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
};