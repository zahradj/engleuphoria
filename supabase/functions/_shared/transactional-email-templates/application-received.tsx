/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

import {
  Body,
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

interface ApplicationReceivedProps {
  name?: string
  hubSelection?: string
}

const ApplicationReceivedEmail = ({ name, hubSelection }: ApplicationReceivedProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We've received your application, {name || 'Teacher'}! 📝</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerBar} />
        <Section style={logoSection}>
          <Img src={LOGO_URL} width="180" height="50" alt={SITE_NAME} style={logo} />
        </Section>
        <Section style={heroSection}>
          <Heading style={h1}>Application Received! 📝</Heading>
          <Text style={text}>
            {name ? `Dear ${name},` : 'Dear Teacher,'}
          </Text>
          <Text style={text}>
            Thank you for applying to join the {SITE_NAME} teaching collective! We're thrilled that you're interested in becoming part of our team.
          </Text>
          {hubSelection && (
            <Section style={detailsBox}>
              <Text style={detailLine}>🎯 <strong>Hub Applied For:</strong> {hubSelection}</Text>
              <Text style={detailLine}>📋 <strong>Status:</strong> Under Review</Text>
              <Text style={detailLine}>⏰ <strong>Expected Response:</strong> Within 48 hours</Text>
            </Section>
          )}
          <Text style={text}>
            Our team is currently reviewing your profile{hubSelection ? ` for the ${hubSelection} Hub` : ''}. We will reach out within 48 hours regarding your 1-on-1 interview.
          </Text>
          <Text style={textMuted}>
            In the meantime, feel free to explore our platform and learn more about our teaching methodology.
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
  component: ApplicationReceivedEmail,
  subject: ({ name }: Record<string, any>) =>
    name ? `We've received your application, ${name}!` : `We've received your application!`,
  displayName: 'Application received',
  previewData: { name: 'Sarah', hubSelection: 'Playground' },
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
const hr = { borderColor: '#e5e7eb', margin: '20px 25px' }
const darkFooter = { backgroundColor: '#111827', padding: '20px 25px', textAlign: 'center' as const, borderRadius: '0 0 8px 8px' }
const footerText = { fontSize: '12px', color: '#9ca3af', margin: '0', fontWeight: '500' as const }
