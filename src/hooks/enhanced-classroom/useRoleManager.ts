
import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UserRole {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  permissions: {
    // Core permissions
    canRecord: boolean;
    canMuteOthers: boolean;
    canControlWhiteboard: boolean;
    canManageParticipants: boolean;
    canUploadContent: boolean;
    
    // Communication permissions
    canAccessChat: boolean;
    canSendPrivateMessages: boolean;
    canUseReactions: boolean;
    
    // Learning tools permissions
    canAccessDictionary: boolean;
    canAccessTranslation: boolean;
    canTakeNotes: boolean;
    
    // Participation permissions
    canParticipateInPolls: boolean;
    canRaiseHand: boolean;
    canShareScreen: boolean;
    
    // Advanced teacher permissions
    canControlLessonFlow: boolean;
    canCreateBreakoutRooms: boolean;
    canViewAllProgress: boolean;
    canModerateChat: boolean;
    canSpotlightStudents: boolean;
    canCreatePolls: boolean;
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
      // Core permissions
      canRecord: true,
      canMuteOthers: true,
      canControlWhiteboard: true,
      canManageParticipants: true,
      canUploadContent: true,
      
      // Communication permissions
      canAccessChat: true,
      canSendPrivateMessages: true,
      canUseReactions: true,
      
      // Learning tools permissions
      canAccessDictionary: true,
      canAccessTranslation: true,
      canTakeNotes: true,
      
      // Participation permissions
      canParticipateInPolls: true,
      canRaiseHand: true,
      canShareScreen: true,
      
      // Advanced teacher permissions
      canControlLessonFlow: true,
      canCreateBreakoutRooms: true,
      canViewAllProgress: true,
      canModerateChat: true,
      canSpotlightStudents: true,
      canCreatePolls: true,
    };

    const studentPermissions = {
      // Core permissions
      canRecord: false,
      canMuteOthers: false,
      canControlWhiteboard: false,
      canManageParticipants: false,
      canUploadContent: false,
      
      // Communication permissions
      canAccessChat: true,
      canSendPrivateMessages: true,
      canUseReactions: true,
      
      // Learning tools permissions
      canAccessDictionary: true,
      canAccessTranslation: true,
      canTakeNotes: true,
      
      // Participation permissions
      canParticipateInPolls: true,
      canRaiseHand: true,
      canShareScreen: false,
      
      // Advanced teacher permissions
      canControlLessonFlow: false,
      canCreateBreakoutRooms: false,
      canViewAllProgress: false,
      canModerateChat: false,
      canSpotlightStudents: false,
      canCreatePolls: false,
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
      // Core permissions
      canRecord: true,
      canMuteOthers: true,
      canControlWhiteboard: true,
      canManageParticipants: true,
      canUploadContent: true,
      
      // Communication permissions
      canAccessChat: true,
      canSendPrivateMessages: true,
      canUseReactions: true,
      
      // Learning tools permissions
      canAccessDictionary: true,
      canAccessTranslation: true,
      canTakeNotes: true,
      
      // Participation permissions
      canParticipateInPolls: true,
      canRaiseHand: true,
      canShareScreen: true,
      
      // Advanced teacher permissions
      canControlLessonFlow: true,
      canCreateBreakoutRooms: true,
      canViewAllProgress: true,
      canModerateChat: true,
      canSpotlightStudents: true,
      canCreatePolls: true,
    } : {
      // Core permissions
      canRecord: false,
      canMuteOthers: false,
      canControlWhiteboard: false,
      canManageParticipants: false,
      canUploadContent: false,
      
      // Communication permissions
      canAccessChat: true,
      canSendPrivateMessages: true,
      canUseReactions: true,
      
      // Learning tools permissions
      canAccessDictionary: true,
      canAccessTranslation: true,
      canTakeNotes: true,
      
      // Participation permissions
      canParticipateInPolls: true,
      canRaiseHand: true,
      canShareScreen: false,
      
      // Advanced teacher permissions
      canControlLessonFlow: false,
      canCreateBreakoutRooms: false,
      canViewAllProgress: false,
      canModerateChat: false,
      canSpotlightStudents: false,
      canCreatePolls: false,
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
