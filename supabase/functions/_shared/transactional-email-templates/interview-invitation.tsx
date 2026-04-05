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

const LOGO_URL = 'https://dcoxpyzoqjvmuuygvlme.supabase.co/storage/v1/object/public/email-assets/logo-black.png'
const SITE_NAME = 'EnglEuphoria'

interface InterviewInvitationProps {
  name?: string
  hubType?: string
  meetingLink?: string
}

const InterviewInvitationEmail = ({ name, hubType, meetingLink }: InterviewInvitationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You're invited to interview with {SITE_NAME}! 🗓️</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerBar} />
        <Section style={logoSection}>
          <Img src={LOGO_URL} width="180" height="50" alt={SITE_NAME} style={logo} />
        </Section>
        <Section style={heroSection}>
          <Heading style={h1}>Interview Invitation 🗓️</Heading>
          <Text style={text}>
            {name ? `Dear ${name},` : 'Dear Teacher,'}
          </Text>
          <Text style={text}>
            We loved your profile! We'd like to invite you to a brief 15-minute interview to discuss your teaching style
            {hubType ? ` for the ${hubType} Hub` : ''}.
          </Text>
          <Section style={detailsBox}>
            <Text style={detailLine}>🎯 <strong>Interview Duration:</strong> 15 minutes</Text>
            {hubType && <Text style={detailLine}>🏠 <strong>Hub:</strong> {hubType}</Text>}
            <Text style={detailLine}>📋 <strong>What to Expect:</strong></Text>
            <Text style={bulletItem}>• Discussion of your teaching experience</Text>
            <Text style={bulletItem}>• A brief demo lesson (5 minutes)</Text>
            <Text style={bulletItem}>• Q&A about our platform and expectations</Text>
          </Section>
          {meetingLink && (
            <Section style={buttonContainer}>
              <Button style={button} href={meetingLink}>
                Schedule Your Interview
              </Button>
            </Section>
          )}
          <Text style={text}>
            Please choose a time that works best for you. We look forward to speaking with you!
          </Text>
          <Text style={textMuted}>
            If you have any questions before the interview, feel free to reply to this email.
          </Text>
        </Section>
        <Hr style={hr} />
        <Section style={darkFooter}>
          <Text style={footerText}>© 2026 {SITE_NAME}. The Future of Learning.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: InterviewInvitationEmail,
  subject: ({ name, hubType }: Record<string, any>) =>
    `EnglEuphoria Interview Invitation: ${name || 'Teacher'}${hubType ? ` × ${hubType}` : ''}`,
  displayName: 'Interview invitation',
  previewData: { name: 'Sarah', hubType: 'Playground', meetingLink: 'https://calendly.com/engleuphoria/teacher-interview' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const headerBar = { backgroundColor: '#4f46e5', height: '4px' }
const logoSection = { padding: '30px 25px 10px', textAlign: 'center' as const }
const logo = { margin: '0 auto' }
const heroSection = { padding: '10px 25px 20px' }
const h1 = { fontSize: '24px', fontWeight: '700' as const, color: '#4f46e5', margin: '0 0 16px', lineHeight: '1.3' }
const text = { fontSize: '15px', color: '#1f2937', lineHeight: '1.6', margin: '0 0 20px' }
const textMuted = { fontSize: '13px', color: '#6b7280', lineHeight: '1.5', margin: '0 0 20px' }
const detailsBox = { backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px 20px', margin: '0 0 20px', border: '1px solid #e5e7eb' }
const detailLine = { fontSize: '14px', color: '#374151', margin: '0 0 8px', lineHeight: '1.5' }
const bulletItem = { fontSize: '14px', color: '#374151', margin: '0 0 4px', lineHeight: '1.5', paddingLeft: '8px' }
const buttonContainer = { textAlign: 'center' as const, margin: '8px 0 20px' }
const button = { backgroundColor: '#4f46e5', color: '#ffffff', fontSize: '15px', fontWeight: '600' as const, borderRadius: '8px', padding: '14px 28px', textDecoration: 'none' }
const hr = { borderColor: '#e5e7eb', margin: '20px 25px' }
const darkFooter = { backgroundColor: '#111827', padding: '20px 25px', textAlign: 'center' as const, borderRadius: '0 0 8px 8px' }
const footerText = { fontSize: '12px', color: '#9ca3af', margin: '0', fontWeight: '500' as const }
