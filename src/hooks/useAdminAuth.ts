
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
    if (user) {
      // Check if user is admin
      const adminStatus = user.role === 'admin';
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
      }
    }
  }, [user]);

  return {
    isAdmin,
    permissions,
    user,
  };
};
