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

interface PostInterviewRejectionProps {
  name?: string
  reason?: string
}

function PostInterviewRejection({
  name = 'Candidate',
  reason,
}: PostInterviewRejectionProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Final Decision - EnglEuphoria Application</Preview>
      <Body style={{ margin: '0', padding: '0', background: '#f4f5f7', fontFamily: "'Inter','Segoe UI',Arial,sans-serif" }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', background: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          {/* Navy Header — white logo */}
          <Section style={{ background: '#0047AB', padding: '28px 32px', textAlign: 'center' as const }}>
            <Img src={LOGO_WHITE_URL} width="160" height="44" alt="EnglEuphoria" style={{ margin: '0 auto', display: 'block' }} />
          </Section>
          {/* Content */}
          <Section style={{ padding: '32px' }}>
            <Text style={{ fontSize: '16px', fontWeight: '600', color: '#0047AB', margin: '0 0 20px' }}>Dear {name},</Text>
            <Text style={{ fontSize: '15px', color: '#37474F', lineHeight: '1.7', margin: '0 0 16px' }}>
              Thank you for taking the time to meet with us and for your demo lesson. We truly appreciate the effort and preparation you put into the interview process.
            </Text>
            <Text style={{ fontSize: '15px', color: '#37474F', lineHeight: '1.7', margin: '0 0 16px' }}>
              At this stage, we have decided to move forward with other candidates whose profiles more closely align with our current needs.
            </Text>
            {reason && (
              <Section style={{ background: '#FEF2F2', borderRadius: '10px', padding: '16px 20px', margin: '16px 0', border: '1px solid #FECACA' }}>
                <Text style={{ fontSize: '14px', color: '#991B1B', lineHeight: '1.6', margin: '0' }}><strong>Feedback:</strong> {reason}</Text>
              </Section>
            )}
            <Text style={{ fontSize: '15px', color: '#37474F', lineHeight: '1.7', margin: '0 0 16px' }}>
              This decision does not reflect on your abilities as an educator. We encourage you to continue developing your teaching practice, and you are welcome to reapply in the future.
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
  component: PostInterviewRejection,
  subject: 'Final Decision - EnglEuphoria Application',
  displayName: 'Post-Interview Rejection',
  previewData: {
    name: 'Jane Doe',
    reason: 'We are looking for candidates with more experience in phonics-based instruction.',
  },
}
