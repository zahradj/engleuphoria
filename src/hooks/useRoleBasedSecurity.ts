import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useRoleBasedSecurity() {
  const { user } = useAuth();
  const [isSecureConnection, setIsSecureConnection] = useState(false);

  useEffect(() => {
    // Check if connection is secure (HTTPS)
    setIsSecureConnection(window.location.protocol === 'https:' || window.location.hostname === 'localhost');
  }, []);

  const hasPermission = (requiredRole: string): boolean => {
    if (!user) return false;
    
    const roleHierarchy = {
      'student': 1,
      'teacher': 2, 
      'admin': 3
    };

    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userLevel >= requiredLevel;
  };

  const checkResourceAccess = (resourceType: string, resourceId: string): boolean => {
    if (!user) return false;

    // Add resource-specific access logic here
    switch (resourceType) {
      case 'lesson':
        // Check if user is teacher or student of the lesson
        return true; // Implement actual check
      case 'profile':
        // Check if user owns the profile or is admin
        return user.id === resourceId || user.role === 'admin';
      default:
        return hasPermission('student');
    }
  };

  return {
    hasPermission,
    checkResourceAccess,
    isSecureConnection,
    userRole: user?.role || null
  };
}