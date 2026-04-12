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
    <Preview>Congratulations! You've been accepted to join the EnglEuphoria Family 🌟</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Hero banner */}
        <Section style={heroBanner}>
          <Heading style={heroTitle}>🌟 Welcome to the Family!</Heading>
          <Text style={heroSubtitle}>Teaching Excellence Community</Text>
        </Section>

        <Section style={contentPadding}>
          <div style={celebrationBanner}>🌟 🎓 🌟</div>
          <Heading style={h1}>Congratulations!</Heading>

          <Text style={highlightText}>
            We were highly impressed by your application and are thrilled to inform you
            that you have been accepted to join our <strong>elite team of educators</strong> at{' '}
            <Link href={siteUrl} style={link}>
              <strong>{siteName}</strong>
            </Link>.
          </Text>

          <Text style={text}>
            Your expertise is exactly what we need to inspire the next generation of learners.
            To begin your journey, click the button below to set up your account and finalize
            your professional profile.
          </Text>

          <Section style={buttonSection}>
            <Button style={button} href={confirmationUrl}>
              Accept Invitation &amp; Create Account
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={subheading}>🚀 Your Onboarding Roadmap</Text>

          <Text style={stepText}>
            <strong>1.</strong> Set your password and log in{'\n'}
            <strong>2.</strong> Complete your professional profile (bio, video, certificates){'\n'}
            <strong>3.</strong> Our team will review and approve your profile{'\n'}
            <strong>4.</strong> Start accepting students and teaching!
          </Text>

          <Hr style={hr} />

          <Text style={motivationText}>
            "The best teachers don't give you the answer — they spark the desire to find it yourself."
          </Text>

          <Text style={footer}>
            If you weren't expecting this invitation, you can safely ignore this email.
          </Text>

          <Text style={signature}>
            Welcome to the future of English education.{'\n'}
            <strong>The EnglEuphoria Team</strong> 💙
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }
const container = { padding: '0', maxWidth: '580px', margin: '0 auto' }
const heroBanner = {
  backgroundColor: '#0047AB',
  padding: '40px 24px 32px',
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
const heroSubtitle = {
  color: '#a8c8f0',
  fontSize: '13px',
  margin: '8px 0 0',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
}
const contentPadding = { padding: '0 24px' }
const celebrationBanner = { textAlign: 'center' as const, fontSize: '32px', margin: '24px 0 8px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#111827',
  margin: '0 0 16px',
  textAlign: 'center' as const,
}
const highlightText = {
  fontSize: '15px',
  color: '#374151',
  lineHeight: '1.7',
  margin: '0 0 16px',
  backgroundColor: '#eef4fc',
  padding: '16px',
  borderRadius: '8px',
  borderLeft: '4px solid #0047AB',
}
const text = {
  fontSize: '15px',
  color: '#374151',
  lineHeight: '1.6',
  margin: '0 0 16px',
}
const link = { color: '#0047AB', textDecoration: 'underline' }
const buttonSection = { textAlign: 'center' as const, margin: '24px 0' }
const button = {
  backgroundColor: '#0047AB',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600' as const,
  borderRadius: '8px',
  padding: '14px 32px',
  textDecoration: 'none',
}
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const subheading = {
  fontSize: '16px',
  fontWeight: '600' as const,
  color: '#111827',
  margin: '0 0 8px',
}
const stepText = {
  fontSize: '14px',
  color: '#4b5563',
  lineHeight: '1.8',
  margin: '0 0 16px',
  whiteSpace: 'pre-line' as const,
}
const motivationText = {
  fontSize: '14px',
  color: '#9ca3af',
  lineHeight: '1.6',
  fontStyle: 'italic' as const,
  textAlign: 'center' as const,
  margin: '0 0 16px',
}
const footer = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '16px 0 8px',
}
const signature = {
  fontSize: '13px',
  color: '#6b7280',
  margin: '8px 0 24px',
  whiteSpace: 'pre-line' as const,
}
