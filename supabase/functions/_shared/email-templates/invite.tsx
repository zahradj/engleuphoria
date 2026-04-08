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
  Link,
  Preview,
  Text,
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
    <Preview>Welcome to EnglEuphoria — You've been invited!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to EnglEuphoria! 🎉</Heading>
        <Text style={text}>
          Congratulations! You've been approved to join{' '}
          <Link href={siteUrl} style={link}>
            <strong>EnglEuphoria</strong>
          </Link>{' '}
          as a teacher. Click the button below to set up your password and access your Teacher Dashboard.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Set Up My Account
        </Button>
        <Text style={footer}>
          If you weren't expecting this invitation, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '30px 25px', maxWidth: '480px', margin: '0 auto' }
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#1e293b',
  margin: '0 0 20px',
}
const text = {
  fontSize: '15px',
  color: '#64748b',
  lineHeight: '1.6',
  margin: '0 0 25px',
}
const link = { color: '#9b6dba', textDecoration: 'underline' }
const button = {
  backgroundColor: '#9b6dba',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600' as const,
  borderRadius: '12px',
  padding: '14px 28px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#94a3b8', margin: '30px 0 0' }
