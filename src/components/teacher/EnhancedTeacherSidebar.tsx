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

  return <Sidebar className="border-r border-purple-200/50 bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 backdrop-blur-sm shadow-lg" collapsible="offcanvas">
      <SidebarHeader className="border-b border-purple-200/50 bg-gradient-to-br from-purple-100/50 via-pink-100/50 to-blue-100/50">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="relative">
            <Logo size="small" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse" />
          </div>
          {!isCollapsed && (
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">👨‍🏫 Teacher Panel</span>
              <span className="truncate text-xs text-purple-600/70 font-medium">Professional Workspace ✨</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-purple-600/80 uppercase tracking-wider px-4 py-3">
            🎯 Navigation
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
                          ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg' 
                          : 'text-purple-600 hover:bg-purple-100/50 hover:text-purple-700'
                        }
                      `}
                    >
                      <item.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-purple-500'}`} />
                      {!isCollapsed && <span className="flex-1">{item.label}</span>}
                      {isActive && !isCollapsed && <span className="text-xs">✨</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-purple-200/50 bg-gradient-to-t from-red-50/50 to-transparent">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              className="px-4 py-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-100/50 transition-all duration-200 font-medium"
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>;
};