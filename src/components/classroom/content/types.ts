
export interface ContentItem {
  id: string;
  type: "pdf" | "image" | "video" | "game" | "interactive" | "curriculum" | "lesson" | "bulk-curriculum";
  title: string;
  source: string;
  uploadedBy: string;
  timestamp: Date;
  size?: number;
  fileType?: string;
  level?: string;
  duration?: number;
  topic?: string;
  theme?: string;
  difficulty?: string;
  content?: string;
  metadata?: {
    estimated_duration?: number;
    difficulty_level?: string;
    learning_objectives?: string[];
    activities?: Array<{
      title?: string;
      description?: string;
      content?: string;
      duration?: number;
    }>;
  };
}

export type MaterialType = "pdf" | "image" | "video" | "interactive";
