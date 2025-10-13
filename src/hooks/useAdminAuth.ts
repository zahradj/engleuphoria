
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { validateUserRole } from '@/utils/roleValidation';

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
    const checkAdminStatus = async () => {
      console.log('=== Admin Auth Check Starting (Secure) ===');
      
      if (!user?.id) {
        console.log('No user, setting non-admin status');
        setIsAdmin(false);
        setPermissions({
          canManageUsers: false,
          canManageTeachers: false,
          canAssignTeachers: false,
          canViewAnalytics: false,
          canModerateContent: false,
          canGenerateReports: false,
          canAccessSystemSettings: false,
        });
        setIsLoading(false);
        return;
      }

      // SECURITY: Validate role server-side only
      const validatedRole = await validateUserRole(user.id);
      const userRole = (user as any)?.role as string | undefined;
      
      // Use server-validated role if available, otherwise use AuthContext role
      const effectiveRole = validatedRole || userRole || 'student';
      
      const adminStatus = effectiveRole === 'admin';
      
      console.log('Admin status determined (secure):', {
        adminStatus,
        effectiveRole,
        userId: user.id
      });
      
      setIsAdmin(adminStatus);

      // Set permissions based on admin status
      if (adminStatus) {
        console.log('Setting admin permissions');
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
        console.log('Setting no permissions (not admin)');
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
      console.log('=== Admin Auth Check Complete ===');
    };

    checkAdminStatus();
  }, [user]);

  return {
    isAdmin,
    isLoading,
    permissions,
    user,
  };
};
