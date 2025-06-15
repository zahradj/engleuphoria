
export interface ContentItem {
  id: string;
  type: "pdf" | "image" | "video" | "game" | "interactive";
  title: string;
  source: string;
  uploadedBy: string;
  timestamp: Date;
  size?: number;
  fileType?: string;
}

export type MaterialType = "pdf" | "image" | "video" | "interactive";
