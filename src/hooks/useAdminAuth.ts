
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
  const [isLoading, setIsLoading] = useState(true);
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
    const checkAdminStatus = () => {
      // Check localStorage for admin status in demo mode
      const userType = localStorage.getItem('userType');
      const adminName = localStorage.getItem('adminName');
      
      console.log('Admin auth check:', { userType, adminName, user });
      
      // User is admin if userType is 'admin' OR if they have auth user with admin role
      const adminStatus = userType === 'admin' || (user && user.role === 'admin');
      
      console.log('Admin status determined:', adminStatus);
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
      
      setIsLoading(false);
    };

    // Check immediately
    checkAdminStatus();

    // Also listen for localStorage changes (in case user logs in via another tab)
    const handleStorageChange = () => {
      checkAdminStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  return {
    isAdmin,
    isLoading,
    permissions,
    user,
  };
};
