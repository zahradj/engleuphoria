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
    id: 'curriculum',
    label: 'Curriculum Library',
    icon: FolderOpen,
    type: 'page',
    path: '/curriculum-library'
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
  return <Sidebar className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" collapsible="offcanvas">
      <SidebarHeader className="border-b border-border/40">
        <div className="flex items-center gap-2 px-4 py-3">
          <Logo size="small" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Teacher Panel</span>
            <span className="truncate text-xs text-muted-foreground">Clean Workspace Mode</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => {
              if (item.type === 'page') {
                return <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild>
                        <a 
                          href="https://lovable.dev/projects/3ad1c0d6-0d3d-47a9-b320-b09d2745911e" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                          <ArrowUpRight className="h-3 w-3 ml-auto" />
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>;
              }
              return <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton onClick={() => handleTabClick(item.id)} isActive={activeTab === item.id} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>;
            })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="w-full">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>;
};