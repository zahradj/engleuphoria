/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to the EnglEuphoria Family — Accept Your Invitation 🌟</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Hero banner */}
        <Section style={heroBanner}>
          <Heading style={heroTitle}>🌟 Welcome to the Family!</Heading>
        </Section>

        <Heading style={h1}>Congratulations!</Heading>

        <Text style={text}>
          We were highly impressed by your application and are thrilled to invite you to
          join our <strong>elite team of educators</strong> at{' '}
          <Link href={siteUrl} style={link}>
            <strong>{siteName}</strong>
          </Link>.
        </Text>

        <Text style={text}>
          You are one step closer to making a real impact in the lives of learners around
          the world. Click the button below to accept your invitation and set up your
          account.
        </Text>

        <Section style={buttonSection}>
          <Button style={button} href={confirmationUrl}>
            Accept Invitation & Get Started
          </Button>
        </Section>

        <Hr style={hr} />

        <Text style={subheading}>What's Next?</Text>

        <Text style={stepText}>
          <strong>1.</strong> Set your password and log in{'\n'}
          <strong>2.</strong> Complete your professional profile (bio, video, certificates){'\n'}
          <strong>3.</strong> Our team will review your profile and schedule your onboarding
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          If you weren't expecting this invitation, you can safely ignore this email.
        </Text>

        <Text style={signature}>
          With excitement,{'\n'}
          <strong>The EnglEuphoria Team</strong>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }
const container = { padding: '0', maxWidth: '580px', margin: '0 auto' }
const heroBanner = {
  backgroundColor: '#7c3aed',
  padding: '32px 24px',
  borderRadius: '12px 12px 0 0',
  textAlign: 'center' as const,
}
const heroTitle = {
  fontSize: '26px',
  fontWeight: 'bold' as const,
  color: '#ffffff',
  margin: '0',
  letterSpacing: '-0.5px',
}
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#111827',
  margin: '28px 24px 12px',
}
const text = {
  fontSize: '15px',
  color: '#374151',
  lineHeight: '1.6',
  margin: '0 24px 16px',
}
const link = { color: '#7c3aed', textDecoration: 'underline' }
const buttonSection = { textAlign: 'center' as const, margin: '24px 0' }
const button = {
  backgroundColor: '#7c3aed',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600' as const,
  borderRadius: '10px',
  padding: '14px 32px',
  textDecoration: 'none',
}
const hr = { borderColor: '#e5e7eb', margin: '24px 24px' }
const subheading = {
  fontSize: '16px',
  fontWeight: '600' as const,
  color: '#111827',
  margin: '0 24px 8px',
}
const stepText = {
  fontSize: '14px',
  color: '#4b5563',
  lineHeight: '1.8',
  margin: '0 24px 16px',
  whiteSpace: 'pre-line' as const,
}
const footer = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '16px 24px 8px',
}
const signature = {
  fontSize: '13px',
  color: '#6b7280',
  margin: '8px 24px 24px',
  whiteSpace: 'pre-line' as const,
}
