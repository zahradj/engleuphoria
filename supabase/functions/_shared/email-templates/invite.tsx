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

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

const LOGO_URL = 'https://dcoxpyzoqjvmuuygvlme.supabase.co/storage/v1/object/public/email-assets/logo-black.png'

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've been invited to join EnglEuphoria! 🎓</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img src={LOGO_URL} width="180" height="50" alt="EnglEuphoria" style={logo} />
        </Section>
        <Section style={heroSection}>
          <Heading style={h1}>You've been invited! 🎓</Heading>
          <Text style={text}>
            You've been invited to join{' '}
            <Link href={siteUrl} style={link}>
              <strong>EnglEuphoria</strong>
            </Link>
            . Click the button below to accept the invitation and start your English learning journey.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={confirmationUrl}>
              Accept Invitation
            </Button>
          </Section>
          <Text style={textMuted}>
            If you weren't expecting this invitation, you can safely ignore this email.
          </Text>
        </Section>
        <Hr style={hr} />
        <Text style={footerBrand}>© EnglEuphoria — Learn English with Joy</Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const logoSection = { padding: '30px 25px 10px', textAlign: 'center' as const }
const logo = { margin: '0 auto' }
const heroSection = { padding: '10px 25px 20px' }
const h1 = { fontSize: '26px', fontWeight: '700' as const, color: '#1a1a1a', margin: '0 0 16px', lineHeight: '1.3' }
const text = { fontSize: '15px', color: '#4a4a4a', lineHeight: '1.6', margin: '0 0 20px' }
const textMuted = { fontSize: '13px', color: '#888888', lineHeight: '1.5', margin: '0 0 20px' }
const link = { color: '#F59E0B', textDecoration: 'underline' }
const buttonContainer = { textAlign: 'center' as const, margin: '8px 0 12px' }
const button = { backgroundColor: '#F59E0B', color: '#ffffff', fontSize: '15px', fontWeight: '600' as const, borderRadius: '10px', padding: '14px 32px', textDecoration: 'none' }
const hr = { borderColor: '#f0f0f0', margin: '20px 25px' }
const footerBrand = { fontSize: '12px', color: '#F59E0B', margin: '0 25px 25px', fontWeight: '500' as const }
