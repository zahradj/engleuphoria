
import React from 'react';
import { Button } from "@/components/ui/button";
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

  return (
    <div className="w-64 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            if (item.isLink) {
              return (
                <Link key={item.id} to={item.path}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            }
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start text-left ${
                  isActive ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : ""
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {item.badge}
                  </Badge>
                )}
                {item.id === 'learning-path' && (
                  <Sparkles className="ml-2 h-3 w-3 text-emerald-500" />
                )}
              </Button>
            );
          })}
          
          {/* Logout Button */}
          {onLogout && (
            <div className="pt-4 border-t border-gray-200 mt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-left text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={onLogout}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};
