import React from 'react';
import { Badge } from "@/components/ui/badge";
import { HubLogo } from '@/components/student/HubLogo';
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
import { useNavigate } from "react-router-dom";
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
import { useStudentLevel } from '@/hooks/useStudentLevel';
import { useThemeMode } from '@/hooks/useThemeMode';

// Hub-specific color maps — bolder, more saturated
const HUB_ICON_COLORS: Record<string, { 
  active: string; 
  activeBg: string; 
  iconDefault: string;
  glowColor: string;
}> = {
  playground: {
    active: 'text-orange-600 dark:text-orange-300',
    activeBg: 'bg-orange-100/80 dark:bg-orange-500/15 border-orange-400/50 dark:border-orange-400/30',
    iconDefault: 'text-orange-500/70 dark:text-orange-400/50',
    glowColor: 'shadow-[0_0_12px_rgba(254,106,47,0.25)] dark:shadow-[0_0_12px_rgba(254,175,21,0.2)]',
  },
  academy: {
    active: 'text-indigo-700 dark:text-indigo-300',
    activeBg: 'bg-indigo-100/80 dark:bg-indigo-500/15 border-indigo-400/50 dark:border-indigo-400/30',
    iconDefault: 'text-indigo-500/70 dark:text-indigo-400/50',
    glowColor: 'shadow-[0_0_12px_rgba(23,78,166,0.25)] dark:shadow-[0_0_12px_rgba(183,94,237,0.2)]',
  },
  professional: {
    active: 'text-emerald-700 dark:text-emerald-300',
    activeBg: 'bg-emerald-100/80 dark:bg-emerald-500/15 border-emerald-400/50 dark:border-emerald-400/30',
    iconDefault: 'text-emerald-500/70 dark:text-emerald-400/50',
    glowColor: 'shadow-[0_0_12px_rgba(13,101,45,0.25)] dark:shadow-[0_0_12px_rgba(61,211,155,0.2)]',
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
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';
  
  const hubKey = studentLevel || 'playground';
  const hubColors = HUB_ICON_COLORS[hubKey] || HUB_ICON_COLORS.playground;
  const hubId = hubKey as 'playground' | 'academy' | 'professional';

  const handleEnterClassroom = () => {
    // Navigate to dashboard to find and join a booked classroom
    navigate('/playground');
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
    <Sidebar collapsible="icon" className={`border-r backdrop-blur-xl transition-colors duration-300 ${
      isDark
        ? 'bg-black/30 border-white/8'
        : 'bg-white/50 border-black/5'
    }`}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={`px-4 py-4 mx-2 mt-2 rounded-xl ${
            isDark ? 'bg-white/5' : 'bg-black/3'
          }`}>
            <HubLogo hubId={hubId} size="sm" />
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
                        relative px-4 py-3 mx-2 my-0.5 rounded-xl transition-all duration-200 font-medium border
                        ${isActive 
                          ? `${hubColors.activeBg} ${hubColors.glowColor}`
                          : `border-transparent ${isDark ? 'text-white/50 hover:bg-white/5 hover:text-white/80' : 'text-muted-foreground hover:bg-black/5 hover:text-foreground'}`
                        }
                      `}
                    >
                      <Icon className={`h-5 w-5 transition-colors ${isActive ? hubColors.active : hubColors.iconDefault}`} />
                      {!isCollapsed && (
                        <>
                          <span className={`flex-1 font-medium ${isActive ? hubColors.active : ''}`}>{item.label}</span>
                          {item.badge && (
                            <Badge 
                              variant={item.id === 'classroom' ? 'default' : 'secondary'} 
                              className={`ml-auto text-xs font-medium ${
                                item.id === 'classroom' 
                                  ? 'bg-emerald-500 text-white border-0' 
                                  : isDark ? 'bg-white/10 text-white/70 border-0' : 'bg-black/5 text-foreground/70 border-0'
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                          {item.id === 'learning-path' && (
                            <Sparkles className={`ml-2 h-4 w-4 ${hubColors.active}`} />
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

        {/* Logout Section */}
        {onLogout && (
          <>
            <SidebarSeparator className={`my-4 ${isDark ? 'bg-white/8' : 'bg-black/8'}`} />
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={onLogout}
                      className={`mx-2 px-4 py-3 rounded-xl font-medium border border-transparent transition-all duration-200 ${
                        isDark
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/20'
                          : 'text-red-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200'
                      }`}
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
