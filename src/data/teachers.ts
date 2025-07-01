
export interface TeacherProfile {
  id: string;
  name: string;
  profileImage: string;
  specialization: string[];
  accent: string;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  availability: string;
  introduction: string;
  experience: string;
  videoUrl?: string;
  languages: string[];
  certifications: string[];
}

export const getTeachers = async (): Promise<TeacherProfile[]> => {
  // In a real app, this would fetch from Supabase
  return [
    {
      id: '1',
      name: 'Sarah Johnson',
      profileImage: '/lovable-uploads/teacher-1.jpg',
      specialization: ['Business English', 'IELTS Preparation'],
      accent: 'American',
      rating: 4.9,
      reviewCount: 127,
      pricePerHour: 25,
      availability: 'Available today',
      introduction: 'Experienced English teacher with 8 years of teaching experience.',
      experience: '8 years',
      languages: ['English', 'Spanish'],
      certifications: ['TESOL', 'CELTA']
    },
    {
      id: '2',
      name: 'James Wilson',
      profileImage: '/lovable-uploads/teacher-2.jpg',
      specialization: ['Conversation', 'Grammar'],
      accent: 'British',
      rating: 4.8,
      reviewCount: 89,
      pricePerHour: 22,
      availability: 'Available tomorrow',
      introduction: 'Native British speaker specializing in conversational English.',
      experience: '5 years',
      languages: ['English', 'French'],
      certifications: ['TEFL']
    }
  ];
};
