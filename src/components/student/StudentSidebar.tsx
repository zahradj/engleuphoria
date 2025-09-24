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
  Mic, 
  CreditCard, 
  User, 
  Settings,
  Map,
  Sparkles,
  Search,
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
    { id: 'teachers', label: 'My Teachers', icon: Users },
    { id: 'upcoming-classes', label: 'Classes', icon: Calendar },
    { id: 'homework', label: 'Homework', icon: ClipboardList },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      isActive={isActive}
                      onClick={() => item.action ? item.action() : setActiveTab(item.id)}
                    >
                      <Icon className="h-4 w-4" />
                      {!isCollapsed && (
                        <>
                          <span>{item.label}</span>
                          {item.badge && (
                            <Badge 
                              variant={item.id === 'classroom' ? 'default' : 'secondary'} 
                              className={`ml-auto text-xs ${item.id === 'classroom' ? 'bg-green-500 text-white animate-pulse' : ''}`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                          {item.id === 'learning-path' && (
                            <Sparkles className="ml-2 h-3 w-3 text-emerald-500" />
                          )}
                          {item.id === 'classroom' && (
                            <Video className="ml-2 h-3 w-3 text-green-500" />
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
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={onLogout}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
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