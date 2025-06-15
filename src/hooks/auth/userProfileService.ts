import { supabase } from '@/integrations/supabase/client';
import { User } from '@/services/classroomDatabase';

export const createUserProfile = async (userId: string, userData: { email: string; full_name: string; role: 'teacher' | 'student'; avatar_id?: number }) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ 
      id: userId,
      email: userData.email,
      full_name: userData.full_name,
      role: userData.role,
      avatar_id: userData.avatar_id || null
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data as User;
};

// Add timeout wrapper for database queries
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 10000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Database query timeout')), timeoutMs)
    )
  ]);
};

export const loadUserProfile = async (userId: string): Promise<User | null> => {
  console.log('UserProfileService: Loading user profile for:', userId);
  
  try {
    // Execute the Supabase query first, then apply timeout wrapper
    const userProfileQuery = supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    const { data: userData, error } = await withTimeout(userProfileQuery, 8000);
    
    if (error) {
      console.log('UserProfileService: Database error loading user profile:', error);
      
      // If user profile doesn't exist, try to get user info from auth
      if (error.code === 'PGRST116') { // No rows returned
        console.log('UserProfileService: User profile not found, checking auth user');
        
        try {
          const authQuery = supabase.auth.getUser();
          const { data: { user: authUser } } = await withTimeout(authQuery, 5000);
          
          if (authUser) {
            console.log('UserProfileService: Auth user exists but no profile, creating default profile');
            const newUserData = {
              email: authUser.email || '',
              full_name: authUser.user_metadata?.full_name || 
                        authUser.user_metadata?.name || 
                        authUser.email?.split('@')[0] || 'User',
              role: 'student' as const, // Default to student for OAuth users
            };
            
            try {
              const createProfileQuery = createUserProfile(userId, newUserData);
              const createdUser = await withTimeout(createProfileQuery, 5000);
              console.log('UserProfileService: Created user profile:', createdUser);
              return createdUser;
            } catch (createError) {
              console.error('UserProfileService: Failed to create user profile:', createError);
              
              // Create fallback user object from auth data
              const fallbackUser: User = {
                id: authUser.id,
                email: authUser.email || '',
                full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                role: 'student',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              return fallbackUser;
            }
          } else {
            console.log('UserProfileService: No auth user found');
            return null;
          }
        } catch (authError) {
          console.error('UserProfileService: Error getting auth user:', authError);
          return null;
        }
      } else {
        // Other database errors
        console.error('UserProfileService: Unexpected database error:', error);
        throw error;
      }
    } else if (userData) {
      console.log('UserProfileService: User profile loaded successfully:', userData.role);
      // Ensure role is properly typed
      const typedUser: User = {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role as 'teacher' | 'student',
        avatar_id: userData.avatar_id,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      };
      return typedUser;
    }
    
    console.log('UserProfileService: No user data returned');
    return null;
    
  } catch (error) {
    console.error('UserProfileService: Unexpected error in loadUserProfile:', error);
    
    // Return null instead of throwing to prevent infinite loading
    return null;
  }
};
