
import { supabase } from '@/integrations/supabase/client';
import { createUserProfile } from './userProfileService';

export const signInUser = async (email: string, password: string) => {
  console.log('AuthMethods: Attempting sign in for:', email);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log('AuthMethods: Sign in error:', error.message);
      return { success: false, error: error.message };
    }

    console.log('AuthMethods: Sign in successful');
    return { success: true };
  } catch (error) {
    console.error('AuthMethods: Unexpected sign in error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const signUpUser = async (email: string, password: string, fullName: string, role: 'teacher' | 'student') => {
  console.log('AuthMethods: Attempting sign up for:', email, 'as', role);
  try {
    // First create auth user with metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (authError) {
      console.log('AuthMethods: Sign up auth error:', authError.message);
      return { success: false, error: authError.message };
    }

    if (authData.user) {
      console.log('AuthMethods: Auth user created, creating profile');
      
      // For confirmed users, create profile immediately
      if (authData.user.email_confirmed_at) {
        try {
          const newUserData = {
            email,
            full_name: fullName,
            role,
          };
          
          await createUserProfile(authData.user.id, newUserData);
          console.log('AuthMethods: User profile created successfully');
        } catch (profileError) {
          console.error('AuthMethods: Error creating user profile:', profileError);
          return { success: false, error: 'Failed to create user profile' };
        }
      }

      return { success: true };
    }

    return { success: false, error: 'Failed to create user account' };
  } catch (error) {
    console.error('AuthMethods: Unexpected sign up error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const signOutUser = async () => {
  console.log('AuthMethods: Signing out');
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('AuthMethods: Error signing out:', error);
    throw error;
  }
};
