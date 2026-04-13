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
  hubType?: string
}

function FinalWelcomeEmail({ name, hubType }: FinalWelcomeProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to the Team! - EnglEuphoria</Preview>
      <Body style={{ margin: '0', padding: '0', background: '#f4f5f7', fontFamily: "'Inter','Segoe UI',Arial,sans-serif" }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', background: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          {/* Navy Header */}
          <Section style={{ background: '#0047AB', padding: '28px 32px', textAlign: 'center' as const }}>
            <Img src={LOGO_WHITE_URL} width="160" height="44" alt="EnglEuphoria" style={{ margin: '0 auto', display: 'block' }} />
          </Section>
          {/* Gold Seal */}
          <Section style={{ background: '#FFF8E1', padding: '12px 32px', textAlign: 'center' as const, borderBottom: '2px solid #F9A825' }}>
            <Text style={{ fontSize: '14px', fontWeight: '700', color: '#F57F17', letterSpacing: '2px', textTransform: 'uppercase' as const, margin: '0' }}>🎉 WELCOME TO THE TEAM</Text>
          </Section>
          {/* Content */}
          <Section style={{ padding: '32px' }}>
            <Text style={{ fontSize: '18px', fontWeight: '700', color: '#0047AB', margin: '0 0 16px' }}>Congratulations, {name || 'Teacher'}! 🌟</Text>
            <Text style={{ fontSize: '15px', color: '#37474F', lineHeight: '1.7', margin: '0 0 16px' }}>
              You have successfully completed the teacher application process. We are thrilled to have you as part of the <strong>EnglEuphoria</strong> teaching team.
            </Text>
            <Text style={{ fontSize: '15px', color: '#37474F', lineHeight: '1.7', margin: '0 0 24px' }}>
              Your profile is now live{hubType ? ` in the ${hubType} Hub` : ''}, and you can begin managing your dashboard. Students can now discover you and book sessions!
            </Text>
            {/* Next Steps */}
            <Section style={{ background: '#F0FDF4', borderRadius: '10px', padding: '20px 24px', margin: '24px 0', border: '1px solid #BBF7D0' }}>
              <Text style={{ fontSize: '16px', fontWeight: '700', color: '#166534', margin: '0 0 12px' }}>🚀 Your Next Steps</Text>
              <Text style={{ fontSize: '14px', color: '#455A64', lineHeight: '1.6', margin: '0 0 6px' }}>✅ <strong>Step 1:</strong> Enter your Dashboard — set up your profile and get familiar with your tools</Text>
              <Text style={{ fontSize: '14px', color: '#455A64', lineHeight: '1.6', margin: '0 0 6px' }}>📚 <strong>Step 2:</strong> Review your First Lesson — open the Curriculum Vault</Text>
              <Text style={{ fontSize: '14px', color: '#455A64', lineHeight: '1.6', margin: '0' }}>📅 <strong>Step 3:</strong> Sync your Calendar — ensure your availability is up to date</Text>
            </Section>
            {/* CTA Button */}
            <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
              <a href={DASHBOARD_URL} style={{ background: '#0047AB', color: '#ffffff', fontSize: '16px', fontWeight: '600', borderRadius: '8px', padding: '16px 36px', textDecoration: 'none', display: 'inline-block' }}>
                Go to Dashboard
              </a>
            </Section>
            <Text style={{ fontSize: '13px', color: '#78909C', lineHeight: '1.5', margin: '0 0 16px' }}>
              We're thrilled to have you on board. If you need any help, use the Help button inside your dashboard.
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
  component: FinalWelcomeEmail,
  subject: 'Welcome to the Team! - EnglEuphoria',
  displayName: 'Final welcome (teacher approved)',
  previewData: { name: 'Sarah', hubType: 'Academy' },
}
