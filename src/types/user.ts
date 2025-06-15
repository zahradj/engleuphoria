
// Unified user interface that works with both database User and context UserProfile
export interface UnifiedUser {
  id: string;
  name?: string;
  full_name?: string;
  email?: string;
  role: 'teacher' | 'student';
  avatar?: string;
  avatar_url?: string;
}

// Helper function to get display name from any user type
export function getDisplayName(user: UnifiedUser): string {
  return user.full_name || user.name || 'User';
}

// Helper function to get avatar from any user type
export function getAvatarUrl(user: UnifiedUser): string | undefined {
  return user.avatar_url || user.avatar;
}
