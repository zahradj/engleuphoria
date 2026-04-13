/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const LOGO_WHITE_URL = 'https://dcoxpyzoqjvmuuygvlme.supabase.co/storage/v1/object/public/email-assets/logo-white.png'
const SITE_NAME = 'EnglEuphoria'
const SITE_URL = 'https://engleuphoria.lovable.app'

interface InterviewInvitationProps {
  name?: string
  interviewDate?: string
  interviewTime?: string
  interviewLink?: string
  confirmUrl?: string
  reminderType?: string
  candidateTimezone?: string
}

const InterviewInvitationEmail = ({
  name,
  interviewDate,
  interviewTime,
  interviewLink,
  confirmUrl,
  reminderType,
  candidateTimezone,
}: InterviewInvitationProps) => {
  const isReminder = !!reminderType

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
        `}</style>
      </Head>
      <Preview>
        {isReminder
          ? `${reminderType} — ${SITE_NAME} Interview`
          : `Invitation to Interview: Joining the ${SITE_NAME} Pedagogical Team`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Navy Header Bar */}
          <Section style={navyHeader}>
            <Img src={LOGO_WHITE_URL} width="160" height="44" alt={SITE_NAME} style={headerLogo} />
          </Section>

          {/* Gold Mastery Seal for new invitations */}
          {!isReminder && (
            <Section style={sealSection}>
              <Text style={sealText}>📋 PEDAGOGICAL INTERVIEW</Text>
            </Section>
          )}

          {/* Reminder Badge */}
          {isReminder && (
            <Section style={reminderBadge}>
              <Text style={reminderBadgeText}>⏰ {reminderType}</Text>
            </Section>
          )}

          {/* Main Content */}
          <Section style={contentSection}>
            <Text style={greeting}>
              Dear {name || 'Candidate'},
            </Text>

            {!isReminder ? (
              <>
                <Text style={bodyText}>
                  Thank you for your application to <strong>Engleuphoria Academy</strong>.
                </Text>
                <Text style={bodyText}>
                  After a thorough review of your professional background and teaching philosophy,
                  our team is impressed with your potential to contribute to our mission of systematic,
                  <em>"Slowly, Slowly"</em> language acquisition. At Engleuphoria, we don't just teach;
                  we use data and phonics-based science to transform how children perceive the English language.
                </Text>
                <Text style={bodyText}>
                  We would like to invite you to a <strong>Virtual Pedagogical Interview</strong> to
                  discuss your experience and provide you with a deeper look into our Professional Hub
                  and the II Wizard ecosystem.
                </Text>
              </>
            ) : (
              <Text style={bodyText}>
                This is a friendly reminder about your upcoming interview with {SITE_NAME}.
                Please ensure you're in a quiet environment with a stable internet connection.
              </Text>
            )}

            {/* Interview Details Box */}
            <Section style={detailsCard}>
              <Text style={detailsTitle}>📅 Your Interview Details</Text>
              <Hr style={detailsDivider} />
              <Text style={detailRow}>
                <strong>Role:</strong> ESL Pedagogical Specialist
              </Text>
              {interviewDate && (
                <Text style={detailRow}>
                  <strong>Date:</strong> {interviewDate}
                </Text>
              )}
              {interviewTime && (
                <Text style={detailRow}>
                  <strong>Time:</strong> {interviewTime}{candidateTimezone ? ` (${candidateTimezone})` : ''}
                </Text>
              )}
              <Text style={detailRow}>
                <strong>Duration:</strong> 30 minutes
              </Text>
              <Text style={detailRow}>
                <strong>Platform:</strong> Virtual Meeting
              </Text>
            </Section>

            {/* Join Meeting Button */}
            {interviewLink && (
              <Section style={buttonContainer}>
                <Button style={joinButton} href={interviewLink}>
                  Click Here to Join Meeting
                </Button>
              </Section>
            )}

            {/* What to Expect Section */}
            {!isReminder && (
              <Section style={expectSection}>
                <Text style={expectTitle}>🔍 What to Expect</Text>
                <Text style={bodyText}>
                  This 30-minute session will focus on:
                </Text>
                <Text style={bulletPoint}>
                  <strong>Phonetic Precision:</strong> Your approach to teaching core English phonemes.
                </Text>
                <Text style={bulletPoint}>
                  <strong>Tech-Integration:</strong> A brief walkthrough of how you will use our Professional Hub to track student mastery.
                </Text>
                <Text style={bulletPoint}>
                  <strong>Engleuphoria Culture:</strong> How you implement the "Slowly, Slowly" method in high-energy classroom environments.
                </Text>
              </Section>
            )}

            {/* Confirm Attendance Button */}
            {confirmUrl && (
              <Section style={buttonContainer}>
                <Button style={confirmButton} href={confirmUrl}>
                  ✅ Confirm My Attendance
                </Button>
              </Section>
            )}

            <Text style={bodyText}>
              We look forward to {isReminder ? 'speaking with you soon' : 'meeting you and potentially welcoming you to the Engleuphoria family'}.
            </Text>

            <Text style={signoff}>
              Warm regards,
            </Text>
            <Text style={signoffTitle}>
              <strong>The Engleuphoria Academic Committee</strong>
            </Text>
            <Text style={tagline}>
              Precision in Phonics. Excellence in Education.
            </Text>
          </Section>

          {/* Dark Footer */}
          <Section style={darkFooter}>
            <Text style={footerText}>© 2026 {SITE_NAME}. The Future of Learning.</Text>
            <Text style={footerSubtext}>
              <em>"Progress is a marathon, not a sprint. We celebrate every sound, every word, and every step."</em>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: InterviewInvitationEmail,
  subject: ({ name, reminderType }: Record<string, any>) =>
    reminderType
      ? `Reminder: ${SITE_NAME} Interview — ${name || 'Teacher'}`
      : `Invitation to Interview: Joining the ${SITE_NAME} Pedagogical Team`,
  displayName: 'Interview invitation',
  previewData: {
    name: 'Sarah Johnson',
    interviewDate: 'Monday, April 14, 2026',
    interviewTime: '14:00',
    interviewLink: 'https://meet.google.com/abc-defg-hij',
    confirmUrl: 'https://engleuphoria.lovable.app/confirm-interview?token=abc123',
    candidateTimezone: 'CET',
  },
} satisfies TemplateEntry

// Styles — Professional Flat 2.0 with Engleuphoria Navy
const main = {
  backgroundColor: '#f4f5f7',
  fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
}
const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  overflow: 'hidden' as const,
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
}
const navyHeader = {
  backgroundColor: '#1A237E',
  padding: '28px 32px',
  textAlign: 'center' as const,
}
const headerLogo = {
  margin: '0 auto',
  display: 'block',
}
const sealSection = {
  backgroundColor: '#FFF8E1',
  padding: '12px 32px',
  textAlign: 'center' as const,
  borderBottom: '2px solid #F9A825',
}
const sealText = {
  fontSize: '14px',
  fontWeight: '700' as const,
  color: '#F57F17',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  margin: '0',
  fontFamily: "'Sora', 'Inter', sans-serif",
}
const reminderBadge = {
  backgroundColor: '#E3F2FD',
  padding: '10px 32px',
  textAlign: 'center' as const,
  borderBottom: '2px solid #1565C0',
}
const reminderBadgeText = {
  fontSize: '14px',
  fontWeight: '600' as const,
  color: '#1565C0',
  margin: '0',
}
const contentSection = {
  padding: '32px 32px 24px',
}
const greeting = {
  fontSize: '16px',
  color: '#1A237E',
  fontWeight: '600' as const,
  margin: '0 0 20px',
  fontFamily: "'Sora', 'Inter', sans-serif",
}
const bodyText = {
  fontSize: '15px',
  color: '#37474F',
  lineHeight: '1.7',
  margin: '0 0 16px',
}
const detailsCard = {
  backgroundColor: '#F5F5F5',
  borderRadius: '10px',
  padding: '20px 24px',
  margin: '24px 0',
  border: '1px solid #E0E0E0',
}
const detailsTitle = {
  fontSize: '16px',
  fontWeight: '700' as const,
  color: '#1A237E',
  margin: '0 0 8px',
  fontFamily: "'Sora', 'Inter', sans-serif",
}
const detailsDivider = {
  borderColor: '#E0E0E0',
  margin: '12px 0',
}
const detailRow = {
  fontSize: '14px',
  color: '#455A64',
  lineHeight: '1.6',
  margin: '0 0 6px',
}
const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
}
const joinButton = {
  backgroundColor: '#1A237E',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600' as const,
  borderRadius: '8px',
  padding: '14px 32px',
  textDecoration: 'none',
  fontFamily: "'Sora', 'Inter', sans-serif",
}
const confirmButton = {
  backgroundColor: '#2E7D32',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600' as const,
  borderRadius: '8px',
  padding: '14px 32px',
  textDecoration: 'none',
  fontFamily: "'Sora', 'Inter', sans-serif",
}
const expectSection = {
  margin: '24px 0 16px',
}
const expectTitle = {
  fontSize: '16px',
  fontWeight: '700' as const,
  color: '#1A237E',
  margin: '0 0 12px',
  fontFamily: "'Sora', 'Inter', sans-serif",
}
const bulletPoint = {
  fontSize: '14px',
  color: '#455A64',
  lineHeight: '1.6',
  margin: '0 0 10px',
  paddingLeft: '12px',
  borderLeft: '3px solid #1A237E',
}
const signoff = {
  fontSize: '15px',
  color: '#37474F',
  margin: '24px 0 4px',
}
const signoffTitle = {
  fontSize: '14px',
  color: '#1A237E',
  margin: '0 0 4px',
}
const tagline = {
  fontSize: '12px',
  color: '#78909C',
  fontStyle: 'italic' as const,
  margin: '0',
}
const darkFooter = {
  backgroundColor: '#0D1642',
  padding: '24px 32px',
  textAlign: 'center' as const,
}
const footerText = {
  fontSize: '12px',
  color: '#9CA3AF',
  margin: '0 0 8px',
  fontWeight: '500' as const,
}
const footerSubtext = {
  fontSize: '11px',
  color: '#6B7280',
  margin: '0',
  lineHeight: '1.5',
}
