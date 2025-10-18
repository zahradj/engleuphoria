import React from 'react';
import { Badge } from "@/components/ui/badge";
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
  Video
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
  
  const handleEnterClassroom = () => {
    const studentId = `student-${Date.now()}`;
    const studentName = localStorage.getItem('studentName') || 'Student';
    navigate(`/classroom?role=student&name=${encodeURIComponent(studentName)}&userId=${studentId}&roomId=unified-classroom-1`);
  };
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    ...(hasProfile ? [{ id: 'learning-path', label: 'My Learning Path', icon: Map, badge: 'New' }] : []),
    { id: 'classroom', label: 'Join Classroom', icon: Video, action: handleEnterClassroom, badge: 'Live' },
    { id: 'assessments', label: 'Assessments', icon: ClipboardList },
    { id: 'certificates', label: 'Certificates', icon: Library },
    { id: 'teachers', label: 'My Teachers', icon: Users },
    { id: 'upcoming-classes', label: 'Classes', icon: Calendar },
    { id: 'homework', label: 'Homework', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-text-muted uppercase tracking-wider px-4 py-4 bg-surface-soft mx-2 mt-2 rounded-lg">
            🎓 Student Hub
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
                          ? 'bg-lavender text-lavender-dark border border-lavender-dark' 
                          : 'text-text-muted hover:bg-surface-soft hover:text-text'
                        }
                      `}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-lavender-dark' : 'text-text-subtle'}`} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 font-medium">{item.label}</span>
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