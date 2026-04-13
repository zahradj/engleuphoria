import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SITE_URL = 'https://engleuphoria.lovable.app'
const RESEND_GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'
const LOGO_URL = 'https://dcoxpyzoqjvmuuygvlme.supabase.co/storage/v1/object/public/email-assets/logo-black.png'

function buildInterviewHtml(
  candidateName: string,
  interviewDate: string,
  interviewTime: string,
  meetingLink: string,
  confirmUrl: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Inter','Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <!-- Navy Header -->
  <div style="background:#0047AB;padding:28px 32px;text-align:center;">
    <img src="${LOGO_URL}" width="160" height="44" alt="EnglEuphoria" style="filter:brightness(0) invert(1);margin:0 auto;display:block;" />
  </div>
  <!-- Seal -->
  <div style="background:#FFF8E1;padding:12px 32px;text-align:center;border-bottom:2px solid #F9A825;">
    <p style="font-size:14px;font-weight:700;color:#F57F17;letter-spacing:2px;text-transform:uppercase;margin:0;">📋 PEDAGOGICAL INTERVIEW</p>
  </div>
  <!-- Content -->
  <div style="padding:32px;">
    <p style="font-size:16px;font-weight:600;color:#0047AB;margin:0 0 20px;">Dear ${candidateName},</p>
    <p style="font-size:15px;color:#37474F;line-height:1.7;margin:0 0 16px;">
      Thank you for your application to <strong>Engleuphoria Academy</strong>.
    </p>
    <p style="font-size:15px;color:#37474F;line-height:1.7;margin:0 0 16px;">
      After a thorough review of your professional background and teaching philosophy,
      our team is impressed with your potential to contribute to our mission of systematic,
      <em>"Slowly, Slowly"</em> language acquisition.
    </p>
    <p style="font-size:15px;color:#37474F;line-height:1.7;margin:0 0 24px;">
      We would like to invite you to a <strong>Virtual Pedagogical Interview</strong>.
    </p>
    <!-- Details Card -->
    <div style="background:#F5F5F5;border-radius:10px;padding:20px 24px;margin:24px 0;border:1px solid #E0E0E0;">
      <p style="font-size:16px;font-weight:700;color:#0047AB;margin:0 0 12px;">📅 Your Interview Details</p>
      <hr style="border:none;border-top:1px solid #E0E0E0;margin:12px 0;" />
      <p style="font-size:14px;color:#455A64;line-height:1.6;margin:0 0 6px;"><strong>Role:</strong> ESL Pedagogical Specialist</p>
      <p style="font-size:14px;color:#455A64;line-height:1.6;margin:0 0 6px;"><strong>Date:</strong> ${interviewDate}</p>
      <p style="font-size:14px;color:#455A64;line-height:1.6;margin:0 0 6px;"><strong>Time:</strong> ${interviewTime}</p>
      <p style="font-size:14px;color:#455A64;line-height:1.6;margin:0 0 6px;"><strong>Duration:</strong> 30 minutes</p>
      <p style="font-size:14px;color:#455A64;line-height:1.6;margin:0;"><strong>Platform:</strong> Virtual Meeting</p>
    </div>
    <!-- Join Button -->
    <div style="text-align:center;margin:24px 0;">
      <a href="${meetingLink}" style="background:#0047AB;color:#ffffff;font-size:15px;font-weight:600;border-radius:8px;padding:14px 32px;text-decoration:none;display:inline-block;">
        Click Here to Join Meeting
      </a>
    </div>
    <!-- What to Expect -->
    <p style="font-size:16px;font-weight:700;color:#0047AB;margin:24px 0 12px;">🔍 What to Expect</p>
    <p style="font-size:14px;color:#455A64;line-height:1.6;margin:0 0 10px;padding-left:12px;border-left:3px solid #0047AB;">
      <strong>Phonetic Precision:</strong> Your approach to teaching core English phonemes.
    </p>
    <p style="font-size:14px;color:#455A64;line-height:1.6;margin:0 0 10px;padding-left:12px;border-left:3px solid #0047AB;">
      <strong>Tech-Integration:</strong> A brief walkthrough of how you will use our Professional Hub.
    </p>
    <p style="font-size:14px;color:#455A64;line-height:1.6;margin:0 0 24px;padding-left:12px;border-left:3px solid #0047AB;">
      <strong>Engleuphoria Culture:</strong> How you implement the "Slowly, Slowly" method.
    </p>
    <!-- Confirm Button -->
    <div style="text-align:center;margin:24px 0;">
      <a href="${confirmUrl}" style="background:#2E7D32;color:#ffffff;font-size:15px;font-weight:600;border-radius:8px;padding:14px 32px;text-decoration:none;display:inline-block;">
        ✅ Confirm My Attendance
      </a>
    </div>
    <p style="font-size:15px;color:#37474F;line-height:1.7;margin:24px 0 4px;">Warm regards,</p>
    <p style="font-size:14px;color:#0047AB;font-weight:600;margin:0 0 4px;">The EnglEuphoria Academic Committee</p>
    <p style="font-size:12px;color:#78909C;font-style:italic;margin:0;">Precision in Phonics. Excellence in Education.</p>
  </div>
  <!-- Dark Footer -->
  <div style="background:#0D1642;padding:24px 32px;text-align:center;">
    <p style="font-size:12px;color:#9CA3AF;margin:0 0 8px;">© 2026 EnglEuphoria. The Future of Learning.</p>
    <p style="font-size:11px;color:#6B7280;margin:0;line-height:1.5;font-style:italic;">"Progress is a marathon, not a sprint."</p>
  </div>
</div>
</body>
</html>`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')

    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verify caller is admin
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: claimsData, error: claimsError } = await callerClient.auth.getClaims(
      authHeader.replace('Bearer ', '')
    )
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    const { data: roleData } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', claimsData.claims.sub)
      .eq('role', 'admin')
      .maybeSingle()

    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Forbidden: admin role required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { interviewId, applicationId } = await req.json()

    if (!interviewId && !applicationId) {
      return new Response(JSON.stringify({ error: 'interviewId or applicationId required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch interview data
    let interview: any
    if (interviewId) {
      const { data, error } = await adminClient
        .from('teacher_interviews')
        .select('*, teacher_applications!inner(email, first_name, last_name)')
        .eq('id', interviewId)
        .single()
      if (error) throw new Error(`Interview not found: ${error.message}`)
      interview = data
    } else {
      const { data, error } = await adminClient
        .from('teacher_interviews')
        .select('*, teacher_applications!inner(email, first_name, last_name)')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      if (error) throw new Error(`Interview not found for application: ${error.message}`)
      interview = data
    }

    const app = (interview as any).teacher_applications
    const candidateName = `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'Candidate'

    // Use internal interview room as default
    const internalLink = `${SITE_URL}/interview-room/${interview.application_id || interview.id}`
    const meetingLink = interview.zoom_link || interview.meeting_link || internalLink
    const scheduledDate = new Date(interview.scheduled_at)

    const interviewDate = scheduledDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    const interviewTime = scheduledDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    const confirmUrl = `${SITE_URL}/confirm-interview?id=${interview.id}&token=${crypto.randomUUID()}`

    // Build and send email via Resend
    const emailHtml = buildInterviewHtml(candidateName, interviewDate, interviewTime, meetingLink, confirmUrl)

    const resendResponse = await fetch(`${RESEND_GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lovableApiKey}`,
        'X-Connection-Api-Key': resendApiKey,
      },
      body: JSON.stringify({
        from: 'EnglEuphoria <onboarding@notify.engleuphoria.com>',
        to: [app.email],
        subject: `Invitation to Interview: Joining the EnglEuphoria Pedagogical Team`,
        html: emailHtml,
      }),
    })

    const resendResult = await resendResponse.json()

    if (!resendResponse.ok) {
      console.error('Resend error:', resendResult)

      await adminClient.from('system_emails').insert({
        email_type: 'interview_invite',
        recipient_email: app.email,
        recipient_name: candidateName,
        subject: `Invitation to Interview: Joining the EnglEuphoria Pedagogical Team`,
        delivery_status: 'failed',
        error_message: JSON.stringify(resendResult),
        related_entity_id: interview.id,
        related_entity_type: 'teacher_interview',
        metadata: { interviewDate, interviewTime, interviewLink: meetingLink },
      })

      return new Response(JSON.stringify({ error: 'Failed to send email', details: resendResult }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Log success
    await adminClient.from('system_emails').insert({
      email_type: 'interview_invite',
      recipient_email: app.email,
      recipient_name: candidateName,
      subject: `Invitation to Interview: Joining the EnglEuphoria Pedagogical Team`,
      delivery_status: 'sent',
      sent_at: new Date().toISOString(),
      related_entity_id: interview.id,
      related_entity_type: 'teacher_interview',
      metadata: { interviewDate, interviewTime, interviewLink: meetingLink, confirmUrl, resend_id: resendResult.id },
    })

    console.log(`✅ Interview invite sent to ${app.email} via Resend`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Interview invitation sent to ${candidateName} (${app.email})`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error: any) {
    console.error('Unexpected error in send-interview-invite:', error)
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
