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
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
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
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    ...(hasProfile ? [{ id: 'learning-path', label: 'My Learning Path', icon: Map, badge: 'New' }] : []),
    { id: 'discover-teachers', label: 'Discover Teachers', icon: Search, isLink: true, path: '/discover-teachers' },
    { id: 'teachers', label: 'My Teachers', icon: Users },
    { id: 'upcoming-classes', label: 'Upcoming Classes', icon: Calendar },
    { id: 'homework', label: 'Homework', icon: ClipboardList },
    { id: 'materials', label: 'Materials Library', icon: Library },
    { id: 'progress', label: 'Progress Tracker', icon: TrendingUp },
    { id: 'speaking', label: 'Speaking Practice', icon: Mic },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
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
                
                if (item.isLink) {
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild>
                        <Link to={item.path}>
                          <Icon className="h-4 w-4" />
                          {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      isActive={isActive}
                      onClick={() => setActiveTab(item.id)}
                    >
                      <Icon className="h-4 w-4" />
                      {!isCollapsed && (
                        <>
                          <span>{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          {item.id === 'learning-path' && (
                            <Sparkles className="ml-2 h-3 w-3 text-emerald-500" />
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