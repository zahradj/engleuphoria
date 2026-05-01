import React from 'react';
import { useTranslation } from 'react-i18next';
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
  Gift,
  Trophy
} from "lucide-react";
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
  const { t } = useTranslation();
  const { studentLevel } = useStudentLevel();
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';

  const hubKey = studentLevel || 'playground';
  const hubColors = HUB_ICON_COLORS[hubKey] || HUB_ICON_COLORS.playground;
  const hubId = hubKey as 'playground' | 'academy' | 'professional';

  const newBadge = t('sd.badge.new');
  const menuItems = [
    { id: 'dashboard', label: t('sd.menu.dashboard'), icon: Home },
    { id: 'classes', label: t('sd.menu.classes'), icon: Calendar },
    { id: 'homework', label: t('sd.menu.homework'), icon: BookOpen },
    { id: 'lessons', label: t('sd.menu.lessons'), icon: BookOpen },
    { id: 'learning-path', label: t('sd.menu.learningPath'), icon: Map, badge: newBadge },
    { id: 'sounds', label: t('sd.menu.sounds'), icon: Sparkles, badge: newBadge },
    { id: 'vocabulary', label: t('sd.menu.vocabulary'), icon: BookOpen, badge: newBadge },
    { id: 'milestones', label: t('sd.menu.milestones'), icon: Trophy, badge: newBadge },
    { id: 'assessments', label: t('sd.menu.assessments'), icon: ClipboardList },
    { id: 'certificates', label: t('sd.menu.certificates'), icon: Library },
    { id: 'teachers', label: t('sd.menu.teachers'), icon: Users },
    { id: 'progress', label: t('sd.menu.progress'), icon: TrendingUp },
    { id: 'referrals', label: t('sd.menu.referrals'), icon: Gift, badge: newBadge },
    { id: 'profile', label: t('sd.menu.profile'), icon: User }
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
                      onClick={() => setActiveTab(item.id)}
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
                      {!isCollapsed && <span>{t('sd.menu.logout')}</span>}
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
