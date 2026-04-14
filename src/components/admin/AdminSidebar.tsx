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
  Calendar,
  GraduationCap,
  Radio,
  Video,
  Mail,
  Briefcase
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const { signOut } = useAuth();
  
  const mainItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "super-control", label: "Super Control Center", icon: Activity },
    { id: "staff-operations", label: "Staff Operations", icon: Briefcase },
    { id: "hiring-pipeline", label: "Hiring Pipeline", icon: Users },
  ];

  const managementItems = [
    { id: "users", label: "User Manager", icon: Users },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "teachers", label: "Teachers", icon: GraduationCap },
    { id: "profile-review", label: "Profile Review", icon: FileText },
    { id: "teacher-applications", label: "Applications", icon: FileText },
    { id: "interviews", label: "Interviews", icon: Video },
    { id: "students", label: "Students", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "communications", label: "Communications", icon: Radio },
    { id: "email-log", label: "Email Log", icon: Mail },
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
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 mb-2 font-semibold">Management</p>
          <div className="space-y-1">
            {managementItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>
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
