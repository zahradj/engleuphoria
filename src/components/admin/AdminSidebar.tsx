import React from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Activity,
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
  PieChart,
  Package,
  Radio
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const { signOut } = useAuth();
  
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "super-control", label: "Super Control Center", icon: Activity },
    { id: "users", label: "User Manager", icon: Users },
    { id: "curriculum", label: "Curriculum", icon: BookOpen },
    { id: "curriculum-library", label: "Lesson Library", icon: Library },
    { id: "curriculum-progress", label: "Curriculum Progress", icon: PieChart },
    { id: "curriculum-export", label: "Export Curriculum", icon: Package },
    { id: "ai-generator", label: "AI Generator", icon: Wand2 },
    { id: "ai-tools", label: "AI Tools", icon: Brain },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "teachers", label: "Teachers", icon: GraduationCap },
    { id: "teacher-applications", label: "Applications", icon: FileText },
    { id: "students", label: "Students", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "communications", label: "Communications", icon: Radio },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-full overflow-y-auto">
      <div className="p-4">
        <div className="mb-6 px-2">
          <Logo size="small" />
          <p className="text-xs text-muted-foreground mt-1">Control Tower — Master Admin</p>
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
