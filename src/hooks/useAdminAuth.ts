
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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
      console.log('=== Admin Auth Check Starting ===');
      
      // Get all localStorage values for debugging
      const userType = localStorage.getItem('userType');
      const adminName = localStorage.getItem('adminName');
      const teacherName = localStorage.getItem('teacherName');
      const studentName = localStorage.getItem('studentName');
      
      console.log('localStorage values:', { 
        userType, 
        adminName, 
        teacherName, 
        studentName,
        user 
      });

      // Removed auto-set admin demo logic to avoid false positives

      // Clear conflicting data if userType is admin but we have other user data
      if (userType === 'admin') {
        if (teacherName) {
          console.log('Clearing conflicting teacher data');
          localStorage.removeItem('teacherName');
        }
        if (studentName) {
          console.log('Clearing conflicting student data');
          localStorage.removeItem('studentName');
        }
      }

      // Determine admin status (with whitelist + metadata + localStorage)
      const specialAdminEmails = ['f.zahra.djaanine@engleuphoria.com'];
      const email = (user as any)?.email as string | undefined;
      const userRole = (user as any)?.role as string | undefined;
      const metaRole = (user as any)?.user_metadata?.role as string | undefined;

      const adminStatus = Boolean(
        (email && specialAdminEmails.includes(email)) ||
        userRole === 'admin' ||
        metaRole === 'admin' ||
        userType === 'admin'
      );
      
      console.log('Admin status determined:', {
        adminStatus,
        fromWhitelist: email ? specialAdminEmails.includes(email) : false,
        fromUserType: userType === 'admin',
        fromUserRole: userRole === 'admin',
        fromMetaRole: metaRole === 'admin'
      });
      
      // Convert to boolean explicitly
      setIsAdmin(Boolean(adminStatus));

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

    // Add a small delay to ensure localStorage is fully loaded
    const timeoutId = setTimeout(checkAdminStatus, 100);

    // Also listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      console.log('Storage change detected:', e.key, e.newValue);
      if (e.key === 'userType' || e.key === 'adminName') {
        checkAdminStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearTimeout(timeoutId);
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
