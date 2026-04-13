/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const LOGO_URL = 'https://dcoxpyzoqjvmuuygvlme.supabase.co/storage/v1/object/public/email-assets/logo-black.png'

interface InterviewInvitationBrandedProps {
  candidateName?: string
  interviewDate?: string
  interviewTime?: string
  meetingLink?: string
  confirmUrl?: string
}

function InterviewInvitationBranded({
  candidateName = 'Candidate',
  interviewDate = 'TBD',
  interviewTime = 'TBD',
  meetingLink = '#',
  confirmUrl = '#',
}: InterviewInvitationBrandedProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Invitation to Interview: Joining the EnglEuphoria Pedagogical Team</Preview>
      <Body style={{ margin: '0', padding: '0', background: '#f4f5f7', fontFamily: "'Inter','Segoe UI',Arial,sans-serif" }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', background: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          {/* Navy Header */}
          <Section style={{ background: '#0047AB', padding: '28px 32px', textAlign: 'center' as const }}>
            <Img src={LOGO_URL} width="160" height="44" alt="EnglEuphoria" style={{ filter: 'brightness(0) invert(1)', margin: '0 auto', display: 'block' }} />
          </Section>
          {/* Seal */}
          <Section style={{ background: '#FFF8E1', padding: '12px 32px', textAlign: 'center' as const, borderBottom: '2px solid #F9A825' }}>
            <Text style={{ fontSize: '14px', fontWeight: '700', color: '#F57F17', letterSpacing: '2px', textTransform: 'uppercase' as const, margin: '0' }}>📋 PEDAGOGICAL INTERVIEW</Text>
          </Section>
          {/* Content */}
          <Section style={{ padding: '32px' }}>
            <Text style={{ fontSize: '16px', fontWeight: '600', color: '#0047AB', margin: '0 0 20px' }}>Dear {candidateName},</Text>
            <Text style={{ fontSize: '15px', color: '#37474F', lineHeight: '1.7', margin: '0 0 16px' }}>
              Thank you for your application to <strong>Engleuphoria Academy</strong>.
            </Text>
            <Text style={{ fontSize: '15px', color: '#37474F', lineHeight: '1.7', margin: '0 0 16px' }}>
              After a thorough review of your professional background and teaching philosophy, our team is impressed with your potential to contribute to our mission of systematic, <em>"Slowly, Slowly"</em> language acquisition.
            </Text>
            <Text style={{ fontSize: '15px', color: '#37474F', lineHeight: '1.7', margin: '0 0 24px' }}>
              We would like to invite you to a <strong>Virtual Pedagogical Interview</strong>.
            </Text>
            {/* Details Card */}
            <Section style={{ background: '#F5F5F5', borderRadius: '10px', padding: '20px 24px', margin: '24px 0', border: '1px solid #E0E0E0' }}>
              <Text style={{ fontSize: '16px', fontWeight: '700', color: '#0047AB', margin: '0 0 12px' }}>📅 Your Interview Details</Text>
              <Text style={{ fontSize: '14px', color: '#455A64', lineHeight: '1.6', margin: '0 0 6px' }}><strong>Role:</strong> ESL Pedagogical Specialist</Text>
              <Text style={{ fontSize: '14px', color: '#455A64', lineHeight: '1.6', margin: '0 0 6px' }}><strong>Date:</strong> {interviewDate}</Text>
              <Text style={{ fontSize: '14px', color: '#455A64', lineHeight: '1.6', margin: '0 0 6px' }}><strong>Time:</strong> {interviewTime}</Text>
              <Text style={{ fontSize: '14px', color: '#455A64', lineHeight: '1.6', margin: '0 0 6px' }}><strong>Duration:</strong> 30 minutes</Text>
              <Text style={{ fontSize: '14px', color: '#455A64', lineHeight: '1.6', margin: '0' }}><strong>Platform:</strong> Virtual Meeting</Text>
            </Section>
            {/* Join Button */}
            <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
              <a href={meetingLink} style={{ background: '#0047AB', color: '#ffffff', fontSize: '15px', fontWeight: '600', borderRadius: '8px', padding: '14px 32px', textDecoration: 'none', display: 'inline-block' }}>
                Click Here to Join Meeting
              </a>
            </Section>
            {/* What to Expect */}
            <Text style={{ fontSize: '16px', fontWeight: '700', color: '#0047AB', margin: '24px 0 12px' }}>🔍 What to Expect</Text>
            <Text style={{ fontSize: '14px', color: '#455A64', lineHeight: '1.6', margin: '0 0 10px', paddingLeft: '12px', borderLeft: '3px solid #0047AB' }}>
              <strong>Phonetic Precision:</strong> Your approach to teaching core English phonemes.
            </Text>
            <Text style={{ fontSize: '14px', color: '#455A64', lineHeight: '1.6', margin: '0 0 10px', paddingLeft: '12px', borderLeft: '3px solid #0047AB' }}>
              <strong>Tech-Integration:</strong> A brief walkthrough of how you will use our Professional Hub.
            </Text>
            <Text style={{ fontSize: '14px', color: '#455A64', lineHeight: '1.6', margin: '0 0 24px', paddingLeft: '12px', borderLeft: '3px solid #0047AB' }}>
              <strong>Engleuphoria Culture:</strong> How you implement the "Slowly, Slowly" method.
            </Text>
            {/* Confirm Button */}
            <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
              <a href={confirmUrl} style={{ background: '#2E7D32', color: '#ffffff', fontSize: '15px', fontWeight: '600', borderRadius: '8px', padding: '14px 32px', textDecoration: 'none', display: 'inline-block' }}>
                ✅ Confirm My Attendance
              </a>
            </Section>
            <Text style={{ fontSize: '15px', color: '#37474F', lineHeight: '1.7', margin: '24px 0 4px' }}>Warm regards,</Text>
            <Text style={{ fontSize: '14px', color: '#0047AB', fontWeight: '600', margin: '0 0 4px' }}>The EnglEuphoria Academic Committee</Text>
            <Text style={{ fontSize: '12px', color: '#78909C', fontStyle: 'italic', margin: '0' }}>Precision in Phonics. Excellence in Education.</Text>
          </Section>
          {/* Dark Footer */}
          <Section style={{ background: '#0D1642', padding: '24px 32px', textAlign: 'center' as const }}>
            <Text style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 8px' }}>© 2026 EnglEuphoria. The Future of Learning.</Text>
            <Text style={{ fontSize: '11px', color: '#6B7280', margin: '0', lineHeight: '1.5', fontStyle: 'italic' }}>"Progress is a marathon, not a sprint."</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template: TemplateEntry = {
  component: InterviewInvitationBranded,
  subject: 'Invitation to Interview: Joining the EnglEuphoria Pedagogical Team',
  displayName: 'Interview Invitation (Branded)',
  previewData: {
    candidateName: 'Jane Doe',
    interviewDate: 'Monday, January 15, 2026',
    interviewTime: '14:00',
    meetingLink: 'https://engleuphoria.lovable.app/interview-room/123',
    confirmUrl: 'https://engleuphoria.lovable.app/confirm-interview?id=123',
  },
}
