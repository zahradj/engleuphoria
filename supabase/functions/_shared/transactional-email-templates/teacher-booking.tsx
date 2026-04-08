/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'EnglEuphoria'

interface TeacherBookingProps {
  teacherName?: string
  studentName?: string
  lessonTitle?: string
  lessonDate?: string
  lessonTime?: string
  roomLink?: string
}

const TeacherBookingEmail = ({ teacherName, studentName, lessonTitle, lessonDate, lessonTime, roomLink }: TeacherBookingProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New lesson booked: {lessonTitle || 'Untitled'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={logoText}>{SITE_NAME}</Heading>
        </Section>
        <Section style={contentSection}>
          <Heading style={h1}>New Lesson Booked! 🎉</Heading>
          <Text style={text}>Hi {teacherName || 'Teacher'}, <strong>{studentName || 'a student'}</strong> has booked a lesson with you.</Text>
          <Section style={cardSection}>
            <Text style={cardTitle}>📋 Lesson Details</Text>
            <Text style={cardRow}><strong>Title:</strong> {lessonTitle || 'N/A'}</Text>
            <Text style={cardRow}><strong>Student:</strong> {studentName || 'N/A'}</Text>
            <Text style={cardRow}><strong>Date:</strong> {lessonDate || 'TBD'}</Text>
            <Text style={cardRow}><strong>Time:</strong> {lessonTime || 'TBD'}</Text>
          </Section>
          {roomLink && (
            <Section style={ctaSection}>
              <Button style={button} href={roomLink}>Join Classroom</Button>
            </Section>
          )}
          <Text style={muted}>You'll receive a reminder before the lesson starts.</Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>{SITE_NAME} — Your English Learning Journey</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: TeacherBookingEmail,
  subject: (data: Record<string, any>) => `📚 New Lesson Booked: ${data.lessonTitle || 'Untitled'}`,
  displayName: 'Teacher booking notification',
  previewData: { teacherName: 'Maria', studentName: 'Alex', lessonTitle: 'Present Perfect Tense', lessonDate: 'Monday, Jan 20, 2025', lessonTime: '10:00 AM', roomLink: 'https://engleuphoria.lovable.app/classroom/123' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const headerSection = { backgroundColor: '#9b6dba', padding: '32px 24px', textAlign: 'center' as const }
const logoText = { color: '#ffffff', fontSize: '28px', fontWeight: '700' as const, margin: '0' }
const contentSection = { padding: '32px 24px' }
const h1 = { fontSize: '22px', fontWeight: '700' as const, color: '#111827', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#4b5563', lineHeight: '1.6', margin: '0 0 20px' }
const cardSection = { backgroundColor: '#f5f0fa', padding: '20px', borderRadius: '8px', margin: '0 0 24px' }
const cardTitle = { fontSize: '16px', fontWeight: '600' as const, color: '#7c3aed', margin: '0 0 12px' }
const cardRow = { fontSize: '14px', color: '#374151', margin: '0 0 6px', lineHeight: '1.5' }
const ctaSection = { textAlign: 'center' as const, margin: '0 0 24px' }
const button = { backgroundColor: '#9b6dba', color: '#ffffff', padding: '14px 32px', borderRadius: '8px', fontWeight: '600' as const, fontSize: '16px', textDecoration: 'none' }
const muted = { fontSize: '13px', color: '#9ca3af', fontStyle: 'italic' as const, margin: '0 0 8px' }
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#9ca3af', textAlign: 'center' as const, margin: '0' }
