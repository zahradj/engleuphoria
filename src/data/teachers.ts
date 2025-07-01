
import { TeacherProfile } from "@/types/teacher-discovery";

export const getTeachers = async (): Promise<TeacherProfile[]> => {
  // In a real app, this would fetch from Supabase
  return [
    {
      id: '1',
      user_id: 'teacher-1-uuid',
      bio: 'Experienced English teacher with 8 years of teaching experience specializing in business English and IELTS preparation.',
      specializations: ['Business English', 'IELTS Preparation'],
      accent: 'American',
      languages_spoken: ['English', 'Spanish'],
      intro_video_url: '/lovable-uploads/teacher-1-intro.mp4',
      profile_image_url: '/lovable-uploads/teacher-1.jpg',
      hourly_rate_dzd: 2500,
      hourly_rate_eur: 25,
      years_experience: 8,
      rating: 4.9,
      total_reviews: 127,
      is_available: true,
      timezone: 'America/New_York',
      full_name: 'Sarah Johnson'
    },
    {
      id: '2',
      user_id: 'teacher-2-uuid',
      bio: 'Native British speaker specializing in conversational English and grammar improvement for all levels.',
      specializations: ['Conversation', 'Grammar'],
      accent: 'British',
      languages_spoken: ['English', 'French'],
      intro_video_url: '/lovable-uploads/teacher-2-intro.mp4',
      profile_image_url: '/lovable-uploads/teacher-2.jpg',
      hourly_rate_dzd: 2200,
      hourly_rate_eur: 22,
      years_experience: 5,
      rating: 4.8,
      total_reviews: 89,
      is_available: true,
      timezone: 'Europe/London',
      full_name: 'James Wilson'
    },
    {
      id: '3',
      user_id: 'teacher-3-uuid',
      bio: 'TESOL certified teacher with expertise in academic English and test preparation for international students.',
      specializations: ['Academic English', 'TOEFL Preparation'],
      accent: 'Canadian',
      languages_spoken: ['English', 'Mandarin'],
      intro_video_url: '/lovable-uploads/teacher-3-intro.mp4',
      profile_image_url: '/lovable-uploads/teacher-3.jpg',
      hourly_rate_dzd: 2800,
      hourly_rate_eur: 28,
      years_experience: 6,
      rating: 4.9,
      total_reviews: 156,
      is_available: true,
      timezone: 'America/Toronto',
      full_name: 'Emily Chen'
    }
  ];
};
