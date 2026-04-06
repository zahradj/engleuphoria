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
const DASHBOARD_URL = 'https://engleuphoria.lovable.app/teacher-dashboard'

interface FinalWelcomeProps {
  name?: string
  hubType?: string
}

const FinalWelcomeEmail = ({ name, hubType }: FinalWelcomeProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to the Team! Your {SITE_NAME} Teacher Dashboard is Live.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerBar} />
        <Section style={logoSection}>
          <Img src={LOGO_URL} width="180" height="50" alt={SITE_NAME} style={logo} />
        </Section>
        <Section style={heroSection}>
          <Heading style={h1}>🌟 Welcome to the Team!</Heading>
          <Text style={text}>
            Congratulations{name ? `, ${name}` : ''}!
          </Text>
          <Text style={text}>
            You officially passed the interview for the <strong>{hubType || 'General'} Hub</strong>. 
            Your profile is now visible to students, and you are ready to start your first 30-minute session.
          </Text>

          <Section style={stepsBox}>
            <Text style={stepTitle}>Your Next Steps:</Text>
            <Text style={stepItem}>
              <strong>1. Enter your Dashboard</strong> — Set up your profile and get familiar with your tools.
            </Text>
            <Text style={stepItem}>
              <strong>2. Review your First Lesson</strong> — Open the Curriculum Vault to practice with Pip or Cyra.
            </Text>
            <Text style={stepItem}>
              <strong>3. Sync your Calendar</strong> — Ensure your availability is up to date so students can book you.
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={DASHBOARD_URL}>
              Open My Dashboard
            </Button>
          </Section>

          <Text style={textMuted}>
            We're thrilled to have you on board. If you need any help, use the Help button inside your dashboard.
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
  component: FinalWelcomeEmail,
  subject: '🌟 Welcome to the Team! Your EnglEuphoria Teacher Dashboard is Live.',
  displayName: 'Final welcome (teacher approved)',
  previewData: {
    name: 'Sarah',
    hubType: 'Academy',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const headerBar = { backgroundColor: '#4f46e5', height: '4px' }
const logoSection = { padding: '30px 25px 10px', textAlign: 'center' as const }
const logo = { margin: '0 auto' }
const heroSection = { padding: '10px 25px 20px' }
const h1 = { fontSize: '24px', fontWeight: '700' as const, color: '#4f46e5', margin: '0 0 16px', lineHeight: '1.3' }
const text = { fontSize: '15px', color: '#1f2937', lineHeight: '1.6', margin: '0 0 16px' }
const textMuted = { fontSize: '13px', color: '#6b7280', lineHeight: '1.5', margin: '0 0 20px' }
const stepsBox = { backgroundColor: '#f0fdf4', borderRadius: '8px', padding: '16px 20px', margin: '0 0 20px', border: '1px solid #bbf7d0' }
const stepTitle = { fontSize: '15px', fontWeight: '700' as const, color: '#166534', margin: '0 0 12px' }
const stepItem = { fontSize: '14px', color: '#374151', margin: '0 0 8px', lineHeight: '1.5' }
const buttonContainer = { textAlign: 'center' as const, margin: '8px 0 16px' }
const button = { backgroundColor: '#4f46e5', color: '#ffffff', fontSize: '15px', fontWeight: '600' as const, borderRadius: '8px', padding: '14px 28px', textDecoration: 'none' }
const hr = { borderColor: '#e5e7eb', margin: '20px 25px' }
const darkFooter = { backgroundColor: '#111827', padding: '20px 25px', textAlign: 'center' as const, borderRadius: '0 0 8px 8px' }
const footerText = { fontSize: '12px', color: '#9ca3af', margin: '0', fontWeight: '500' as const }
