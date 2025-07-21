import { commonTranslations } from './common';
import { learningTranslations } from './learning';
import { dashboardTranslations } from './dashboard';
import { homeworkTranslations } from './homework';
import { vocabularyTranslations } from './vocabulary';
import { assessmentTranslations } from './assessment';
import { interactiveTranslations } from './interactive';
import { teacherTranslations } from './teacher';
import { classroomTranslations } from './classroom';
import { resourcesTranslations } from './resources';
import { uiTranslations } from './ui';
import { landingTranslations } from './landing';
import { parentTranslations } from './parent';
import { achievementsTranslations } from './achievements';
import { calendarTranslations } from './calendar';
import { progressTranslations } from './progress';
import { whiteboardTranslations } from './whiteboard';
import { authenticationTranslations } from './authentication';

export const englishTranslations = {
  ...commonTranslations,
  ...learningTranslations,
  ...dashboardTranslations,
  ...homeworkTranslations,
  ...vocabularyTranslations,
  ...assessmentTranslations,
  ...interactiveTranslations,
  ...teacherTranslations,
  ...classroomTranslations,
  ...resourcesTranslations,
  ...uiTranslations,
  ...landingTranslations,
  ...parentTranslations,
  ...achievementsTranslations,
  ...calendarTranslations,
  ...progressTranslations,
  ...whiteboardTranslations,
  ...authenticationTranslations,

  // Additional UI translations for better coverage
  loginSubtitle: "Welcome back to your learning journey",
  signupSubtitle: "Start your English learning adventure", 
  studentDescription: "Learn English with fun activities",
  teacherDescription: "Create engaging lessons for students",
  enterFullName: "Enter your full name",
  enterEmail: "Enter your email",
  enterPassword: "Enter your password",
  confirmPassword: "Confirm Password",
  confirmPasswordPlaceholder: "Confirm your password",
  signingIn: "Signing in...",
  creatingAccount: "Creating account...",
  signIn: "Sign In",
  
  // Navigation and common UI
  home: "Home",
  about: "About",
  features: "Features",
  pricing: "Pricing",
  contact: "Contact",
  getStarted: "Get Started",
  learnMore: "Learn More",
  loading: "Loading...",
  error: "Error",
  success: "Success",
  warning: "Warning",
  info: "Information",
  close: "Close",
  cancel: "Cancel",
  save: "Save",
  edit: "Edit",
  delete: "Delete",
  search: "Search",
  filter: "Filter",
  sort: "Sort",
  back: "Back",
  next: "Next",
  previous: "Previous",
  continue: "Continue",
  submit: "Submit",
  reset: "Reset",
  clear: "Clear",
  
  // Dashboard and student interface
  dashboard: "Dashboard",
  myProgress: "My Progress",
  lessons: "Lessons",
  activities: "Activities",
  achievements: "Achievements",
  profile: "Profile",
  settings: "Settings",
  logout: "Logout",
  
  // Learning content
  lesson: "Lesson",
  activity: "Activity",
  quiz: "Quiz",
  exercise: "Exercise",
  practice: "Practice",
  review: "Review",
  study: "Study",
  learn: "Learn",
  
  // Time and dates
  today: "Today",
  yesterday: "Yesterday",
  tomorrow: "Tomorrow",
  thisWeek: "This Week",
  lastWeek: "Last Week",
  nextWeek: "Next Week",
  thisMonth: "This Month",
  
  // Status and progress
  completed: "Completed",
  inProgress: "In Progress",
  notStarted: "Not Started",
  locked: "Locked",
  unlocked: "Unlocked",
  
  // Common actions
  play: "Play",
  pause: "Pause",
  stop: "Stop",
  record: "Record",
  listen: "Listen",
  speak: "Speak",
  read: "Read",
  write: "Write",
};
