
import { RefObject } from "react";

export type IssueType = "Audio Issue" | "Video Issue" | "Internet Issue" | "Other";

export interface OneOnOneVideoSectionProps {
  enhancedClassroom: any;
  currentUserId: string;
  currentUserName: string;
  isTeacher: boolean;
  studentXP?: number;
  onAwardPoints?: () => void;
  showRewardPopup?: boolean;
  lessonStarted?: boolean;
}
export interface VideoRefs {
  teacherVideoRef: RefObject<HTMLVideoElement>;
  studentVideoRef: RefObject<HTMLVideoElement>;
}
