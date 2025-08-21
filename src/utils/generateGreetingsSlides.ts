import { supabase } from '@/lib/supabase';

export const generateGreetingsSlides = async () => {
  const lessonId = '597db0a1-0770-4e28-86a1-1f4ef2d564a1';
  
  try {
    console.log('Starting generation of 25 slides for Greetings and Introductions...');
    
    const { data, error } = await supabase.functions.invoke('ai-slide-generator', {
      body: {
        action: 'generate_full_deck',
        content_id: lessonId,
        slide_count: 25
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }

    if (!data?.success) {
      console.error('Generation failed:', data);
      throw new Error(data?.error || 'Failed to generate slides');
    }

    console.log('Successfully generated 25 slides:', data);
    return data;
    
  } catch (error) {
    console.error('Failed to generate greeting slides:', error);
    throw error;
  }
};

// Auto-invoke if this file is loaded directly
if (typeof window !== 'undefined') {
  console.log('Auto-generating slides for Greetings and Introductions...');
  generateGreetingsSlides().then(() => {
    console.log('Slide generation completed successfully!');
  }).catch(error => {
    console.error('Slide generation failed:', error);
  });
}