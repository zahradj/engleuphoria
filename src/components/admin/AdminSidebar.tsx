
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  BarChart3, 
  Shield, 
  FileText, 
  Home,
  Settings
} from 'lucide-react';
import { AdminPermissions } from '@/hooks/useAdminAuth';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  permissions: AdminPermissions;
}

export const AdminSidebar = ({ activeTab, onTabChange, permissions }: AdminSidebarProps) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home, permission: true },
    { id: 'users', label: 'User Management', icon: Users, permission: permissions.canManageUsers },
    { id: 'teachers', label: 'Teacher Management', icon: GraduationCap, permission: permissions.canManageTeachers },
    { id: 'assignments', label: 'Teacher Assignments', icon: UserCheck, permission: permissions.canAssignTeachers },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, permission: permissions.canViewAnalytics },
    { id: 'moderation', label: 'Content Moderation', icon: Shield, permission: permissions.canModerateContent },
    { id: 'reports', label: 'Reports', icon: FileText, permission: permissions.canGenerateReports },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        <Badge variant="secondary" className="mt-2">Administrator</Badge>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          if (!item.permission) return null;
          
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <Button variant="outline" className="w-full justify-start">
          <Settings className="w-4 h-4 mr-2" />
          System Settings
        </Button>
      </div>
    </div>
  );
};
