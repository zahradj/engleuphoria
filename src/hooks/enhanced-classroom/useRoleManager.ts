
import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UserRole {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  permissions: {
    canRecord: boolean;
    canMuteOthers: boolean;
    canControlWhiteboard: boolean;
    canManageParticipants: boolean;
    canUploadContent: boolean;
  };
}

interface UseRoleManagerProps {
  initialRole: 'teacher' | 'student';
  userId: string;
  userName: string;
}

export function useRoleManager({ initialRole, userId, userName }: UseRoleManagerProps) {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const teacherPermissions = {
      canRecord: true,
      canMuteOthers: true,
      canControlWhiteboard: true,
      canManageParticipants: true,
      canUploadContent: true
    };

    const studentPermissions = {
      canRecord: false,
      canMuteOthers: false,
      canControlWhiteboard: false,
      canManageParticipants: false,
      canUploadContent: false
    };

    return {
      id: userId,
      name: userName,
      role: initialRole,
      permissions: initialRole === 'teacher' ? teacherPermissions : studentPermissions
    };
  });

  const { toast } = useToast();

  const validatePermission = useCallback((action: keyof UserRole['permissions']) => {
    const hasPermission = currentRole.permissions[action];
    
    if (!hasPermission) {
      toast({
        title: "Permission Denied",
        description: `You don't have permission to ${action.replace('can', '').toLowerCase()}`,
        variant: "destructive"
      });
    }
    
    return hasPermission;
  }, [currentRole.permissions, toast]);

  const switchRole = useCallback((newRole: 'teacher' | 'student') => {
    if (newRole === currentRole.role) return;

    const newPermissions = newRole === 'teacher' ? {
      canRecord: true,
      canMuteOthers: true,
      canControlWhiteboard: true,
      canManageParticipants: true,
      canUploadContent: true
    } : {
      canRecord: false,
      canMuteOthers: false,
      canControlWhiteboard: false,
      canManageParticipants: false,
      canUploadContent: false
    };

    setCurrentRole(prev => ({
      ...prev,
      role: newRole,
      permissions: newPermissions
    }));

    toast({
      title: "Role Changed",
      description: `You are now a ${newRole}`,
    });
  }, [currentRole.role, toast]);

  // Persist role in localStorage
  useEffect(() => {
    localStorage.setItem('classroom-role', JSON.stringify(currentRole));
  }, [currentRole]);

  return {
    currentRole,
    validatePermission,
    switchRole,
    isTeacher: currentRole.role === 'teacher',
    isStudent: currentRole.role === 'student'
  };
}
