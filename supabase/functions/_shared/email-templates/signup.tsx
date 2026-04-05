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
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

const LOGO_URL = 'https://dcoxpyzoqjvmuuygvlme.supabase.co/storage/v1/object/public/email-assets/logo-black.png'

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to EnglEuphoria! Confirm your email to get started 🚀</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerBar} />
        <Section style={logoSection}>
          <Img src={LOGO_URL} width="180" height="50" alt="EnglEuphoria" style={logo} />
        </Section>
        <Section style={heroSection}>
          <Heading style={h1}>Welcome to the Hub, Explorer! 🚀</Heading>
          <Text style={text}>
            Thanks for joining{' '}
            <Link href={siteUrl} style={link}>
              <strong>EnglEuphoria</strong>
            </Link>
            ! Your journey to English mastery starts now.
          </Text>
          <Text style={text}>
            Whether you're entering the <strong>Playground</strong>, the <strong>Academy</strong>, or the <strong>Professional</strong> Hub — we've got your first mission ready.
          </Text>
          <Text style={text}>
            Please confirm your email address (
            <Link href={`mailto:${recipient}`} style={link}>
              {recipient}
            </Link>
            ) to activate your account:
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={confirmationUrl}>
              Verify My Access
            </Button>
          </Section>
        </Section>
        <Hr style={hr} />
        <Text style={disclaimer}>
          If you didn't create an account on EnglEuphoria, you can safely ignore this email.
        </Text>
        <Section style={darkFooter}>
          <Text style={footerText}>© 2026 EnglEuphoria. The Future of Learning.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const headerBar = { backgroundColor: '#4f46e5', height: '4px' }
const logoSection = { padding: '30px 25px 10px', textAlign: 'center' as const }
const logo = { margin: '0 auto' }
const heroSection = { padding: '10px 25px 20px' }
const h1 = { fontSize: '24px', fontWeight: '700' as const, color: '#4f46e5', margin: '0 0 16px', lineHeight: '1.3' }
const text = { fontSize: '15px', color: '#1f2937', lineHeight: '1.6', margin: '0 0 20px' }
const link = { color: '#4f46e5', textDecoration: 'underline' }
const buttonContainer = { textAlign: 'center' as const, margin: '8px 0 12px' }
const button = { backgroundColor: '#4f46e5', color: '#ffffff', fontSize: '15px', fontWeight: '600' as const, borderRadius: '8px', padding: '14px 28px', textDecoration: 'none' }
const hr = { borderColor: '#e5e7eb', margin: '20px 25px' }
const disclaimer = { fontSize: '13px', color: '#6b7280', margin: '0 25px 20px', lineHeight: '1.5' }
const darkFooter = { backgroundColor: '#111827', padding: '20px 25px', textAlign: 'center' as const, borderRadius: '0 0 8px 8px' }
const footerText = { fontSize: '12px', color: '#9ca3af', margin: '0', fontWeight: '500' as const }
