import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  TrendingUp, 
  CreditCard, 
  Settings,
  LogOut,
  BookOpen,
  Calendar,
  GraduationCap,
  Brain,
  Wand2,
  Library,
  PieChart
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const { signOut } = useAuth();
  
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "User Manager", icon: Users },
    { id: "curriculum", label: "Curriculum", icon: BookOpen },
    { id: "curriculum-library", label: "Lesson Library", icon: Library },
    { id: "curriculum-progress", label: "Curriculum Progress", icon: PieChart },
    { id: "ai-generator", label: "AI Generator", icon: Wand2 },
    { id: "ai-tools", label: "AI Tools", icon: Brain },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "teachers", label: "Teachers", icon: GraduationCap },
    { id: "teacher-applications", label: "Applications", icon: FileText },
    { id: "students", label: "Students", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-full overflow-y-auto">
      <div className="p-4">
        <div className="mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">🎛️</span>
            </div>
            <div>
              <h2 className="font-bold text-foreground">Control Tower</h2>
              <p className="text-xs text-muted-foreground">Master Admin</p>
            </div>
          </div>
        </div>

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
                    ? "" 
                    : ""
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </div>
        
        <div className="mt-8 pt-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
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
