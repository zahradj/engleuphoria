import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Logo } from '@/components/Logo';
import { 
  Home, 
  BookOpen, 
  Users, 
  Calendar, 
  ClipboardList, 
  Library, 
  TrendingUp, 
  User, 
  Map,
  Sparkles,
  LogOut,
  Video,
  Gift,
  Trophy
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeModeToggle } from '@/components/ui/ThemeModeToggle';
import { useStudentLevel } from '@/hooks/useStudentLevel';

// Hub-specific color maps
const HUB_ICON_COLORS: Record<string, { active: string; activeBg: string; iconDefault: string }> = {
  playground: {
    active: 'text-orange-600 dark:text-orange-400',
    activeBg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-600/30',
    iconDefault: 'text-orange-400 dark:text-orange-500/60',
  },
  academy: {
    active: 'text-indigo-600 dark:text-indigo-400',
    activeBg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-600/30',
    iconDefault: 'text-indigo-400 dark:text-indigo-500/60',
  },
  professional: {
    active: 'text-emerald-600 dark:text-emerald-400',
    activeBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-600/30',
    iconDefault: 'text-emerald-400 dark:text-emerald-500/60',
  },
};

interface StudentSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasProfile?: boolean;
  onLogout?: () => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  hasProfile = false,
  onLogout 
}) => {
  const navigate = useNavigate();
  const { studentLevel } = useStudentLevel();
  
  // Determine hub key for coloring
  const hubKey = studentLevel === 'kids' ? 'playground' 
    : studentLevel === 'teens' ? 'academy' 
    : 'professional';
  const hubColors = HUB_ICON_COLORS[hubKey];

  const handleEnterClassroom = () => {
    const studentId = `student-${Date.now()}`;
    const studentName = localStorage.getItem('studentName') || 'Student';
    navigate(`/classroom?role=student&name=${encodeURIComponent(studentName)}&userId=${studentId}&roomId=unified-classroom-1`);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'learning-path', label: 'My Learning Path', icon: Map, badge: 'New' },
    { id: 'sounds', label: 'Map of Sounds', icon: Sparkles, badge: 'New' },
    { id: 'vocabulary', label: 'Vocabulary Vault', icon: BookOpen, badge: 'New' },
    { id: 'milestones', label: 'Mastery Milestones', icon: Trophy, badge: 'New' },
    { id: 'lessons', label: 'My Lessons', icon: BookOpen },
    { id: 'classroom', label: 'Join Classroom', icon: Video, action: handleEnterClassroom, badge: 'Live' },
    { id: 'assessments', label: 'Assessments', icon: ClipboardList },
    { id: 'certificates', label: 'Certificates', icon: Library },
    { id: 'teachers', label: 'My Teachers', icon: Users },
    { id: 'upcoming-classes', label: 'Classes', icon: Calendar },
    { id: 'homework', label: 'Homework', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'referrals', label: 'Invite Friends', icon: Gift, badge: 'New' },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-white dark:bg-gray-950">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-text-muted px-4 py-4 bg-surface-soft mx-2 mt-2 rounded-lg">
            <Logo size="small" />
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      isActive={isActive}
                      onClick={() => item.action ? item.action() : setActiveTab(item.id)}
                      className={`
                        relative px-4 py-3 mx-2 my-1 rounded-lg transition-all duration-200 font-medium
                        ${isActive 
                          ? hubColors.activeBg
                          : 'text-text-muted hover:bg-surface-soft hover:text-text'
                        }
                      `}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? hubColors.active : hubColors.iconDefault}`} />
                      {!isCollapsed && (
                        <>
                          <span className={`flex-1 font-medium ${isActive ? hubColors.active : ''}`}>{item.label}</span>
                          {item.badge && (
                            <Badge 
                              variant={item.id === 'classroom' ? 'default' : 'secondary'} 
                              className={`ml-auto text-xs font-medium ${
                                item.id === 'classroom' 
                                  ? 'bg-mint-green-dark text-white border-0' 
                                  : 'bg-peach text-peach-dark border-0'
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                          {item.id === 'learning-path' && (
                            <Sparkles className="ml-2 h-4 w-4 text-peach-dark" />
                          )}
                        </>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Theme Toggle */}
        <SidebarSeparator className="bg-border my-2" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="mx-2 px-4 py-2 flex items-center gap-2">
                  {!isCollapsed && <span className="text-sm text-text-muted">Theme</span>}
                  <ThemeModeToggle className="text-text-muted hover:text-text" />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Section */}
        {onLogout && (
          <>
            <SidebarSeparator className="bg-border my-4" />
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={onLogout}
                      className="mx-2 px-4 py-3 rounded-lg text-error hover:text-error hover:bg-error-bg transition-all duration-200 font-medium border border-transparent hover:border-error-border"
                    >
                      <LogOut className="h-5 w-5" />
                      {!isCollapsed && <span>Logout</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
