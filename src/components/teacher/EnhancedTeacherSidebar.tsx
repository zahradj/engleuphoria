import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Brain, Calendar, Users, Clock, FileText, BookOpen, MessageSquare, DollarSign, TrendingUp, Settings, LogOut, GraduationCap, Book, FolderOpen, User, ArrowUpRight, Presentation } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
interface EnhancedTeacherSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}
export const EnhancedTeacherSidebar = ({
  activeTab,
  setActiveTab,
  onLogout
}: EnhancedTeacherSidebarProps) => {
  const {
    setOpen
  } = useSidebar();
  const menuItems = [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    type: 'tab'
  }, {
    id: 'profile',
    label: 'Profile',
    icon: User,
    type: 'tab'
  }, {
    id: 'library',
    label: 'Library',
    icon: BookOpen,
    type: 'tab'
  }, {
    id: 'slides',
    label: 'Lesson Slides',
    icon: Presentation,
    type: 'tab'
  }, {
    id: 'placement-test',
    label: 'Placement Test',
    icon: GraduationCap,
    type: 'tab'
  }, {
    id: 'calendar',
    label: 'Calendar',
    icon: Calendar,
    type: 'tab'
  }, {
    id: 'students',
    label: 'Students',
    icon: Users,
    type: 'tab'
  }, {
    id: 'reading-library',
    label: 'Reading Library',
    icon: Book,
    type: 'tab'
  }, {
    id: 'earnings',
    label: 'Earnings',
    icon: DollarSign,
    type: 'tab'
  }, {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    type: 'tab'
  }];
  const handleTabClick = useCallback((itemId: string) => {
    setActiveTab(itemId);
    // Auto-hide sidebar after selection
    setTimeout(() => {
      setOpen(false);
    }, 100);
  }, [setActiveTab, setOpen]);
  const handleLogout = useCallback(() => {
    onLogout();
    setOpen(false);
  }, [onLogout, setOpen]);
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return <Sidebar className="border-r border-border/50 bg-card/50 backdrop-blur-sm" collapsible="offcanvas">
      <SidebarHeader className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="flex items-center gap-3 px-4 py-4">
          <Logo size="small" />
          {!isCollapsed && (
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-bold text-foreground">Teacher Panel</span>
              <span className="truncate text-xs text-muted-foreground">Professional Workspace</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => handleTabClick(item.id)} 
                      isActive={isActive}
                      className={`
                        relative px-4 py-3 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                          : 'text-muted-foreground hover:bg-surface-1 hover:text-foreground'
                        }
                      `}
                    >
                      <item.icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
                      {!isCollapsed && <span className="flex-1">{item.label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 bg-gradient-to-t from-destructive/5 to-transparent">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              className="px-4 py-3 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>;
};