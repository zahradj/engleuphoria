import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SITE_URL = 'https://engleuphoria.lovable.app'

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

    // Verify caller is admin
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: userError } = await callerClient.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    const { data: roleData } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
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

    // Always construct a concrete meeting link — never undefined
    const meetingLink = interview.zoom_link || interview.meeting_link || `${SITE_URL}/interview-room/${interview.application_id || interview.id}`

    if (!meetingLink || !meetingLink.startsWith('http')) {
      return new Response(JSON.stringify({ error: 'Could not generate a valid interview link. Email not sent.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
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

    // Send branded interview invitation via the Lovable transactional email queue
    const { error: emailError } = await adminClient.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'interview-invitation-branded',
        recipientEmail: app.email,
        idempotencyKey: `interview-invite-${interview.id}-${Date.now()}`,
        templateData: {
          candidateName,
          interviewDate,
          interviewTime,
          meetingLink,
          applicationId: interview.application_id || interview.id,
          confirmUrl,
        },
      },
    })

    if (emailError) {
      console.error('Email enqueue error:', emailError)
      await adminClient.from('system_emails').insert({
        email_type: 'interview_invite',
        recipient_email: app.email,
        recipient_name: candidateName,
        subject: 'Invitation to Interview: Joining the EnglEuphoria Pedagogical Team',
        delivery_status: 'failed',
        error_message: JSON.stringify(emailError),
        related_entity_id: interview.id,
        related_entity_type: 'teacher_interview',
        metadata: { interviewDate, interviewTime, interviewLink: meetingLink },
      })

      return new Response(JSON.stringify({ error: 'Failed to send email', details: emailError }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Log success
    await adminClient.from('system_emails').insert({
      email_type: 'interview_invite',
      recipient_email: app.email,
      recipient_name: candidateName,
      subject: 'Invitation to Interview: Joining the EnglEuphoria Pedagogical Team',
      delivery_status: 'sent',
      sent_at: new Date().toISOString(),
      related_entity_id: interview.id,
      related_entity_type: 'teacher_interview',
      metadata: { interviewDate, interviewTime, interviewLink: meetingLink, confirmUrl },
    })

    console.log(`✅ Interview invite queued for ${app.email}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Interview invitation queued for ${candidateName} (${app.email})`,
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
