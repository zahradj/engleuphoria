
import { TeacherProfile } from "@/types/teacher-discovery";

export const mockTeachers: TeacherProfile[] = [
  {
    id: "1",
    user_id: "teacher1",
    bio: "Experienced English teacher with a passion for helping students achieve fluency through interactive lessons.",
    specializations: ["Business English", "Conversation", "Grammar"],
    accent: "American",
    languages_spoken: ["English", "Spanish"],
    intro_video_url: "",
    profile_image_url: "",
    hourly_rate_dzd: 2500,
    hourly_rate_eur: 15,
    years_experience: 8,
    rating: 4.9,
    total_reviews: 127,
    is_available: true,
    timezone: "EST",
    full_name: "Sarah Johnson"
  },
  {
    id: "2",
    user_id: "teacher2",
    bio: "Native British speaker specializing in IELTS preparation and academic English.",
    specializations: ["IELTS Prep", "Academic English", "Pronunciation"],
    accent: "British",
    languages_spoken: ["English", "French"],
    intro_video_url: "",
    profile_image_url: "",
    hourly_rate_dzd: 2800,
    hourly_rate_eur: 18,
    years_experience: 6,
    rating: 4.8,
    total_reviews: 95,
    is_available: true,
    timezone: "GMT",
    full_name: "James Wilson"
  },
  {
    id: "3",
    user_id: "teacher3",
    bio: "Specialized in teaching children and teenagers with fun, engaging methods.",
    specializations: ["Kids English", "Conversation", "Grammar"],
    accent: "Australian",
    languages_spoken: ["English"],
    intro_video_url: "",
    profile_image_url: "",
    hourly_rate_dzd: 2200,
    hourly_rate_eur: 13,
    years_experience: 5,
    rating: 4.7,
    total_reviews: 78,
    is_available: true,
    timezone: "AEST",
    full_name: "Emma Davis"
  }
];
