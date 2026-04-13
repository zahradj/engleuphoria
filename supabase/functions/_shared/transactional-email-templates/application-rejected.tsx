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

const LOGO_WHITE_URL = 'https://dcoxpyzoqjvmuuygvlme.supabase.co/storage/v1/object/public/email-assets/logo-white.png'

interface ApplicationRejectedProps {
  name?: string
  reason?: string
}

function ApplicationRejectedEmail({ name, reason }: ApplicationRejectedProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Update regarding your application - EnglEuphoria</Preview>
      <Body style={{ margin: '0', padding: '0', background: '#f4f5f7', fontFamily: "'Inter','Segoe UI',Arial,sans-serif" }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', background: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          {/* Navy Header */}
          <Section style={{ background: '#0047AB', padding: '28px 32px', textAlign: 'center' as const }}>
            <Img src={LOGO_WHITE_URL} width="160" height="44" alt="EnglEuphoria" style={{ margin: '0 auto', display: 'block' }} />
          </Section>
          {/* Content */}
          <Section style={{ padding: '32px' }}>
            <Text style={{ fontSize: '16px', fontWeight: '600', color: '#0047AB', margin: '0 0 20px' }}>Dear {name || 'Applicant'},</Text>
            <Text style={{ fontSize: '15px', color: '#37474F', lineHeight: '1.7', margin: '0 0 16px' }}>
              Thank you for your interest in joining <strong>EnglEuphoria</strong>. After careful review, we have decided not to move forward with your application at this time.
            </Text>
            {reason && (
              <Section style={{ background: '#FEF2F2', borderRadius: '10px', padding: '16px 20px', margin: '16px 0', border: '1px solid #FECACA' }}>
                <Text style={{ fontSize: '14px', color: '#991B1B', lineHeight: '1.6', margin: '0' }}><strong>Feedback:</strong> {reason}</Text>
              </Section>
            )}
            <Text style={{ fontSize: '15px', color: '#37474F', lineHeight: '1.7', margin: '0 0 16px' }}>
              We encourage you to continue developing your teaching skills and welcome you to reapply in the future. We wish you the best in your professional endeavors.
            </Text>
            <Text style={{ fontSize: '13px', color: '#78909C', lineHeight: '1.5', margin: '0 0 16px' }}>
              If you have any questions, please don't hesitate to reach out to our support team.
            </Text>
            <Text style={{ fontSize: '15px', color: '#37474F', lineHeight: '1.7', margin: '24px 0 4px' }}>Warm regards,</Text>
            <Text style={{ fontSize: '14px', color: '#0047AB', fontWeight: '600', margin: '0 0 4px' }}>The EnglEuphoria Academic Committee</Text>
            <Text style={{ fontSize: '12px', color: '#78909C', fontStyle: 'italic', margin: '0' }}>Precision in Phonics. Excellence in Education.</Text>
          </Section>
          {/* Dark Footer */}
          <Section style={{ background: '#0D1642', padding: '24px 32px', textAlign: 'center' as const }}>
            <Img src={LOGO_WHITE_URL} width="100" height="28" alt="EnglEuphoria" style={{ margin: '0 auto 12px', display: 'block' }} />
            <Text style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 8px' }}>© 2026 EnglEuphoria. The Future of Learning.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template: TemplateEntry = {
  component: ApplicationRejectedEmail,
  subject: 'Update regarding your application - EnglEuphoria',
  displayName: 'Application rejected',
  previewData: { name: 'Sarah', reason: 'We are looking for candidates with more experience at this time.' },
}
