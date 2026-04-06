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

export const TEMPLATES: Record<string, TemplateEntry> = {
  'booking-confirmation': bookingConfirmation,
  'victory-notification': victoryNotification,
  'application-received': applicationReceived,
  'interview-invitation': interviewInvitation,
  'final-welcome': finalWelcome,
  'application-rejected': applicationRejected,
  'video-rejected': videoRejected,
  'video-approved': videoApproved,
}
