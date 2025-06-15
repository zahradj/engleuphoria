
import { supabase } from '@/integrations/supabase/client';
import { User, checkAuth } from './types';

export const userService = {
  async createUser(userData: { email: string; full_name: string; role: 'teacher' | 'student'; avatar_id?: number }) {
    // Get the current user ID from auth
    const user = await checkAuth();

    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        id: user.id,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
        avatar_id: userData.avatar_id || null
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as User;
  },

  async getUserByEmail(email: string) {
    await checkAuth();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data as User;
  },

  async getUsersByRole(role: 'teacher' | 'student') {
    await checkAuth();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .order('full_name');
    
    if (error) throw error;
    return (data || []).map(user => ({ ...user, role: user.role as 'teacher' | 'student' })) as User[];
  }
};
