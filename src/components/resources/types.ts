
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "video" | "audio" | "interactive";
  level: "beginner" | "intermediate" | "advanced";
  url: string;
  thumbnail?: string;
}
