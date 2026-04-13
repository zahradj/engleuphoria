/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as bookingConfirmation } from './booking-confirmation.tsx'
import { template as victoryNotification } from './victory-notification.tsx'
import { template as applicationReceived } from './application-received.tsx'
import { template as interviewInvitation } from './interview-invitation.tsx'
import { template as finalWelcome } from './final-welcome.tsx'
import { template as applicationRejected } from './application-rejected.tsx'
import { template as videoRejected } from './video-rejected.tsx'
import { template as videoApproved } from './video-approved.tsx'
import { template as welcomeStudent } from './welcome-student.tsx'
import { template as welcomeTeacher } from './welcome-teacher.tsx'
import { template as adminNewRegistration } from './admin-new-registration.tsx'
import { template as adminNewStudent } from './admin-new-student.tsx'
import { template as teacherBooking } from './teacher-booking.tsx'
import { template as studentLessonReady } from './student-lesson-ready.tsx'
import { template as lessonReminder } from './lesson-reminder.tsx'
import { template as unitMasteryReport } from './unit-mastery-report.tsx'
import { template as profileApproved } from './profile-approved.tsx'
import { template as unitCompleted } from './unit-completed.tsx'
import { template as teacherWelcomeApproved } from './teacher-welcome-approved.tsx'
import { template as interviewInvitationBranded } from './interview-invitation-branded.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'booking-confirmation': bookingConfirmation,
  'victory-notification': victoryNotification,
  'application-received': applicationReceived,
  'interview-invitation': interviewInvitation,
  'final-welcome': finalWelcome,
  'application-rejected': applicationRejected,
  'video-rejected': videoRejected,
  'video-approved': videoApproved,
  'welcome-student': welcomeStudent,
  'welcome-teacher': welcomeTeacher,
  'admin-new-registration': adminNewRegistration,
  'admin-new-student': adminNewStudent,
  'teacher-booking': teacherBooking,
  'student-lesson-ready': studentLessonReady,
  'lesson-reminder': lessonReminder,
  'unit-mastery-report': unitMasteryReport,
  'profile-approved': profileApproved,
  'unit-completed': unitCompleted,
  'teacher-welcome-approved': teacherWelcomeApproved,
  'interview-invitation-branded': interviewInvitationBranded,
}
