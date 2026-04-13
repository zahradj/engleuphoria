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
const DASHBOARD_URL = 'https://engleuphoria.lovable.app/teacher-dashboard'

interface FinalWelcomeProps {
  name?: string
}

function FinalWelcomeEmail({ name }: FinalWelcomeProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to the Team - EnglEuphoria</Preview>
      <Body style={{ margin: '0', padding: '0', background: '#f4f5f7', fontFamily: "'Inter','Segoe UI',Arial,sans-serif" }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', background: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          {/* Navy Header */}
          <Section style={{ background: '#0047AB', padding: '28px 32px', textAlign: 'center' as const }}>
            <Img src={LOGO_WHITE_URL} width="160" height="44" alt="EnglEuphoria" style={{ margin: '0 auto', display: 'block' }} />
          </Section>
          {/* Content */}
          <Section style={{ padding: '32px' }}>
            <Text style={{ fontSize: '16px', fontWeight: '600', color: '#0047AB', margin: '0 0 20px' }}>Dear {name || 'Teacher'},</Text>
            <Text style={{ fontSize: '15px', color: '#37474F', lineHeight: '1.7', margin: '0 0 16px' }}>
              Congratulations! You have successfully completed the teacher application process. We are thrilled to have you as part of the <strong>EnglEuphoria</strong> teaching team.
            </Text>
            <Text style={{ fontSize: '15px', color: '#37474F', lineHeight: '1.7', margin: '0 0 24px' }}>
              Your profile is now live and you can now access your teacher dashboard.
            </Text>
            {/* CTA Button */}
            <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
              <a href={DASHBOARD_URL} style={{ background: '#0047AB', color: '#ffffff', fontSize: '15px', fontWeight: '600', borderRadius: '8px', padding: '14px 32px', textDecoration: 'none', display: 'inline-block' }}>
                Go to Dashboard
              </a>
            </Section>
            <Text style={{ fontSize: '15px', color: '#37474F', lineHeight: '1.7', margin: '24px 0 4px' }}>Warm regards,</Text>
            <Text style={{ fontSize: '14px', color: '#0047AB', fontWeight: '600', margin: '0' }}>The EnglEuphoria Academic Committee</Text>
          </Section>
          {/* Dark Footer */}
          <Section style={{ background: '#0D1642', padding: '24px 32px', textAlign: 'center' as const }}>
            <Img src={LOGO_WHITE_URL} width="100" height="28" alt="EnglEuphoria" style={{ margin: '0 auto 12px', display: 'block' }} />
            <Text style={{ fontSize: '12px', color: '#9CA3AF', margin: '0' }}>© 2026 EnglEuphoria. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template: TemplateEntry = {
  component: FinalWelcomeEmail,
  subject: 'Welcome to the Team - EnglEuphoria',
  displayName: 'Final welcome (teacher approved)',
  previewData: { name: 'Sarah' },
}
