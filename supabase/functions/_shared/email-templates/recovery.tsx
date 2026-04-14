/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

const LOGO_WHITE_URL = 'https://dcoxpyzoqjvmuuygvlme.supabase.co/storage/v1/object/public/email-assets/logo-white.png'

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reset your password for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with logo */}
        <Section style={headerSection}>
          <Img src={LOGO_WHITE_URL} width="160" height="44" alt={siteName} style={logo} />
        </Section>

        {/* Main content */}
        <Section style={contentSection}>
          {/* Lock icon */}
          <div style={iconCircle}>
            <Text style={iconText}>🔐</Text>
          </div>

          <Heading style={h1}>Reset Your Password</Heading>
          
          <Text style={text}>
            Hi there! We received a request to reset the password for your <strong>{siteName}</strong> account.
          </Text>

          <Text style={text}>
            Click the button below to create a new, secure password and get back to learning.
          </Text>

          {/* CTA Button */}
          <Section style={ctaSection}>
            <Button style={button} href={confirmationUrl}>
              Reset My Password
            </Button>
          </Section>

          {/* Security notice */}
          <Section style={securityBox}>
            <Text style={securityTitle}>🛡️ Security Notice</Text>
            <Text style={securityText}>
              This link expires in 1 hour. If you didn't request this reset, no action is needed — your account remains safe.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Tips section */}
          <Text style={tipsTitle}>Password Tips:</Text>
          <Text style={tipItem}>✓ Use at least 6 characters</Text>
          <Text style={tipItem}>✓ Include uppercase &amp; lowercase letters</Text>
          <Text style={tipItem}>✓ Add numbers and special characters</Text>
        </Section>

        {/* Footer */}
        <Section style={footerSection}>
          <Text style={footerText}>
            Need help? Contact us at support@engleuphoria.com
          </Text>
          <Text style={copyright}>
            © {siteName}. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

/* ── Styles ─────────────────────────────────────────── */

const main = {
  backgroundColor: '#f3f4f6',
  fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  padding: '40px 0',
}

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  borderRadius: '16px',
  overflow: 'hidden' as const,
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
}

const headerSection = {
  backgroundColor: '#0047AB',
  padding: '36px 24px',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #0047AB 0%, #0066CC 100%)',
}

const logo = { margin: '0 auto', display: 'block' }

const contentSection = {
  backgroundColor: '#ffffff',
  padding: '40px 32px 32px',
}

const iconCircle = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: '#EEF2FF',
  margin: '0 auto 24px',
  textAlign: 'center' as const,
  lineHeight: '64px',
}

const iconText = {
  fontSize: '28px',
  margin: '0',
  lineHeight: '64px',
}

const h1 = {
  fontSize: '26px',
  fontWeight: '700' as const,
  color: '#111827',
  margin: '0 0 16px',
  textAlign: 'center' as const,
}

const text = {
  fontSize: '15px',
  color: '#4b5563',
  lineHeight: '1.7',
  margin: '0 0 16px',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '28px 0',
}

const button = {
  backgroundColor: '#0047AB',
  color: '#ffffff',
  padding: '16px 40px',
  borderRadius: '10px',
  fontWeight: '700' as const,
  fontSize: '16px',
  textDecoration: 'none',
  display: 'inline-block',
  boxShadow: '0 4px 14px rgba(0, 71, 171, 0.3)',
}

const securityBox = {
  backgroundColor: '#FEF9C3',
  borderRadius: '10px',
  padding: '16px 20px',
  margin: '24px 0',
  border: '1px solid #FDE68A',
}

const securityTitle = {
  fontSize: '14px',
  fontWeight: '600' as const,
  color: '#92400E',
  margin: '0 0 6px',
}

const securityText = {
  fontSize: '13px',
  color: '#92400E',
  lineHeight: '1.5',
  margin: '0',
}

const divider = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
}

const tipsTitle = {
  fontSize: '14px',
  fontWeight: '600' as const,
  color: '#374151',
  margin: '0 0 8px',
}

const tipItem = {
  fontSize: '13px',
  color: '#6b7280',
  margin: '0 0 4px',
  lineHeight: '1.6',
}

const footerSection = {
  backgroundColor: '#1e293b',
  padding: '24px',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '13px',
  color: '#94a3b8',
  margin: '0 0 8px',
}

const copyright = {
  fontSize: '12px',
  color: '#64748b',
  margin: '0',
}
