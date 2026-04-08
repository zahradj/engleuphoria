/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'EnglEuphoria'

interface WelcomeTeacherProps {
  name?: string
}

const WelcomeTeacherEmail = ({ name }: WelcomeTeacherProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to the {SITE_NAME} teaching team!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={logoText}>{SITE_NAME}</Heading>
        </Section>
        <Section style={contentSection}>
          <Heading style={h1}>Welcome, {name || 'Teacher'}! 🎓</Heading>
          <Text style={text}>
            Thank you for applying to join our teaching community! We're excited to review your application and help you start making a difference in students' lives.
          </Text>
          <Section style={cardSection}>
            <Text style={cardTitle}>📋 Next Steps</Text>
            <Text style={cardText}>• Complete your teaching profile</Text>
            <Text style={cardText}>• Add your photo, bio, and experience</Text>
            <Text style={cardText}>• Our team will review your application</Text>
            <Text style={cardText}>• Once approved, start accepting students!</Text>
          </Section>
          <Section style={ctaSection}>
            <Button style={button} href="https://engleuphoria.lovable.app/teacher-application">
              Complete Your Profile
            </Button>
          </Section>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>{SITE_NAME} — Your English Learning Journey</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WelcomeTeacherEmail,
  subject: '👩‍🏫 Welcome to EnglEuphoria Teaching Team!',
  displayName: 'Teacher welcome',
  previewData: { name: 'Maria' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const headerSection = { backgroundColor: '#9b6dba', padding: '32px 24px', textAlign: 'center' as const }
const logoText = { color: '#ffffff', fontSize: '28px', fontWeight: '700' as const, margin: '0' }
const contentSection = { padding: '32px 24px' }
const h1 = { fontSize: '24px', fontWeight: '700' as const, color: '#111827', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#4b5563', lineHeight: '1.6', margin: '0 0 20px' }
const cardSection = { backgroundColor: '#f5f0fa', padding: '20px', borderRadius: '8px', margin: '0 0 24px' }
const cardTitle = { fontSize: '16px', fontWeight: '600' as const, color: '#7c3aed', margin: '0 0 12px' }
const cardText = { fontSize: '14px', color: '#4b5563', margin: '0 0 6px', lineHeight: '1.5' }
const ctaSection = { textAlign: 'center' as const, margin: '0 0 24px' }
const button = { backgroundColor: '#9b6dba', color: '#ffffff', padding: '14px 32px', borderRadius: '8px', fontWeight: '600' as const, fontSize: '16px', textDecoration: 'none' }
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#9ca3af', textAlign: 'center' as const, margin: '0' }
