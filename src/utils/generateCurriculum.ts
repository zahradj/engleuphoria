import { supabase } from "@/integrations/supabase/client";

export async function generateK12Curriculum() {
  console.log('🎓 Starting K12 curriculum generation...');
  
  try {
    const { data, error } = await supabase.functions.invoke('k12-curriculum-generator', {
      body: { 
        action: 'generate_full_curriculum',
        batchSize: 15 // Smaller batches for better reliability
      }
    });

    if (error) {
      console.error('❌ Error generating curriculum:', error);
      throw error;
    }

    console.log('✅ Curriculum generation response:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed to generate curriculum:', error);
    throw error;
  }
}