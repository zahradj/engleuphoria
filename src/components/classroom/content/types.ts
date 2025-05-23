
export interface ContentItem {
  id: string;
  type: "pdf" | "image" | "video" | "game" | "interactive";
  title: string;
  source: string;
  uploadedBy: string;
  timestamp: Date;
}

export type MaterialType = "pdf" | "image" | "video" | "interactive";
