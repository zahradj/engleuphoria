
export interface OneOnOneVideoSectionProps {
  enhancedClassroom: any;
  currentUserId: string;
  currentUserName: string;
  isTeacher: boolean;
  studentXP?: number;
  onAwardPoints?: (points: number, reason?: string) => void;
  showRewardPopup?: boolean;
  lessonStarted?: boolean;
}
