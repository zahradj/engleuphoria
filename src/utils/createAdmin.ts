import { supabase } from '@/integrations/supabase/client';

export const createAdminAccount = async () => {
  try {
    console.log('Calling admin-create function...');
    
    const { data, error } = await supabase.functions.invoke('admin-create', {
      body: {
        fullName: 'fatima zahra djaanine',
        email: 'f.zahra.djaanine@engleuphoria.com',
        password: 'ENGLEUPHORIA_ADMIN_2024',
        secretKey: prompt('Please enter the ADMIN_CREATION_SECRET:') || ''
      }
    });

    if (error) {
      console.error('Error calling admin-create:', error);
      return { success: false, error: error.message };
    }

    console.log('Admin-create response:', data);
    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: 'Unexpected error occurred' };
  }
};

// Auto-execute when this file loads
createAdminAccount().then(result => {
  if (result.success) {
    console.log('✅ Admin account created successfully!');
    console.log('You can now login with: f.zahra.djaanine@engleuphoria.com');
  } else {
    console.error('❌ Failed to create admin:', result.error);
  }
});