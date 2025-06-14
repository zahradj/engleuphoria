
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface AdminPermissions {
  canManageUsers: boolean;
  canManageTeachers: boolean;
  canAssignTeachers: boolean;
  canViewAnalytics: boolean;
  canModerateContent: boolean;
  canGenerateReports: boolean;
  canAccessSystemSettings: boolean;
}

export const useAdminAuth = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [permissions, setPermissions] = useState<AdminPermissions>({
    canManageUsers: false,
    canManageTeachers: false,
    canAssignTeachers: false,
    canViewAnalytics: false,
    canModerateContent: false,
    canGenerateReports: false,
    canAccessSystemSettings: false,
  });

  useEffect(() => {
    // Check localStorage for admin status in demo mode
    const userType = localStorage.getItem('userType');
    const adminStatus = userType === 'admin' || (user && user.role === 'admin');
    
    console.log('Admin auth check:', { userType, user, adminStatus });
    setIsAdmin(adminStatus);

    // For now, grant all permissions to admin users
    // In production, this would be based on actual permissions from database
    if (adminStatus) {
      setPermissions({
        canManageUsers: true,
        canManageTeachers: true,
        canAssignTeachers: true,
        canViewAnalytics: true,
        canModerateContent: true,
        canGenerateReports: true,
        canAccessSystemSettings: true,
      });
    } else {
      setPermissions({
        canManageUsers: false,
        canManageTeachers: false,
        canAssignTeachers: false,
        canViewAnalytics: false,
        canModerateContent: false,
        canGenerateReports: false,
        canAccessSystemSettings: false,
      });
    }
  }, [user]);

  return {
    isAdmin,
    permissions,
    user,
  };
};
