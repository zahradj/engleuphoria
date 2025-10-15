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
    <Sidebar collapsible="icon" className="border-r-2 border-purple-200/50 bg-gradient-to-b from-purple-100/90 via-pink-50/90 to-blue-50/90 backdrop-blur-md shadow-xl">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-bold text-purple-700 uppercase tracking-wider px-4 py-4 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-lg mx-2 mt-2">
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
                        relative px-4 py-3 mx-2 my-1 rounded-xl transition-all duration-200 font-medium
                        ${isActive 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 scale-105' 
                          : 'text-purple-700 hover:bg-white/70 hover:text-purple-900 hover:shadow-md'
                        }
                      `}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-white animate-bounce' : 'text-purple-600'}`} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 font-semibold">{item.label}</span>
                          {item.badge && (
                            <Badge 
                              variant={item.id === 'classroom' ? 'default' : 'secondary'} 
                              className={`ml-auto text-xs font-bold ${
                                item.id === 'classroom' 
                                  ? 'bg-green-500 text-white animate-pulse border-0 shadow-lg shadow-green-500/50' 
                                  : 'bg-yellow-400 text-purple-900 border-0 shadow-md'
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                          {item.id === 'learning-path' && (
                            <Sparkles className="ml-2 h-4 w-4 text-yellow-500 animate-pulse" />
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
            <SidebarSeparator className="bg-purple-300/50 my-4" />
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={onLogout}
                      className="mx-2 px-4 py-3 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
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