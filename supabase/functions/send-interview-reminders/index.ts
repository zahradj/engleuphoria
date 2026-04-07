import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables')
    return new Response(JSON.stringify({ error: 'Server config error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const now = new Date()

  // Find interviews scheduled within next 24-25 hours (1-day reminder)
  // and within next 25-35 minutes (30-min reminder)
  const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const oneDayPlusHour = new Date(now.getTime() + 25 * 60 * 60 * 1000)
  const thirtyMinFromNow = new Date(now.getTime() + 25 * 60 * 1000)
  const thirtyFiveMinFromNow = new Date(now.getTime() + 35 * 60 * 1000)

  console.log('🔔 Checking interview reminders at:', now.toISOString())

  // Get interviews needing 1-day reminder
  const { data: oneDayInterviews, error: err1 } = await supabase
    .from('teacher_interviews')
    .select('*, teacher_applications!inner(email, first_name, last_name)')
    .eq('status', 'scheduled')
    .gte('scheduled_at', oneDayFromNow.toISOString())
    .lte('scheduled_at', oneDayPlusHour.toISOString())

  if (err1) {
    console.error('Error fetching 1-day reminders:', err1)
  }

  // Get interviews needing 30-min reminder
  const { data: thirtyMinInterviews, error: err2 } = await supabase
    .from('teacher_interviews')
    .select('*, teacher_applications!inner(email, first_name, last_name)')
    .eq('status', 'scheduled')
    .gte('scheduled_at', thirtyMinFromNow.toISOString())
    .lte('scheduled_at', thirtyFiveMinFromNow.toISOString())

  if (err2) {
    console.error('Error fetching 30-min reminders:', err2)
  }

  let sentCount = 0

  // Send 1-day reminders
  for (const interview of oneDayInterviews || []) {
    const app = (interview as any).teacher_applications
    if (!app?.email) continue

    const scheduledDate = new Date(interview.scheduled_at)
    try {
      await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'interview-invitation',
          recipientEmail: app.email,
          idempotencyKey: `interview-reminder-1day-${interview.id}`,
          templateData: {
            name: `${app.first_name} ${app.last_name}`.trim(),
            interviewDate: scheduledDate.toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
            }),
            interviewTime: scheduledDate.toLocaleTimeString('en-US', {
              hour: '2-digit', minute: '2-digit', hour12: false,
            }),
            reminderType: 'Your interview is tomorrow',
          },
        },
      })
      sentCount++
      console.log(`✅ 1-day reminder sent to ${app.email}`)
    } catch (error) {
      console.error(`❌ Failed to send 1-day reminder to ${app.email}:`, error)
    }
  }

  // Send 30-min reminders
  for (const interview of thirtyMinInterviews || []) {
    const app = (interview as any).teacher_applications
    if (!app?.email) continue

    const scheduledDate = new Date(interview.scheduled_at)
    try {
      await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'interview-invitation',
          recipientEmail: app.email,
          idempotencyKey: `interview-reminder-30min-${interview.id}`,
          templateData: {
            name: `${app.first_name} ${app.last_name}`.trim(),
            interviewDate: scheduledDate.toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
            }),
            interviewTime: scheduledDate.toLocaleTimeString('en-US', {
              hour: '2-digit', minute: '2-digit', hour12: false,
            }),
            reminderType: 'Your interview starts in 30 minutes',
          },
        },
      })
      sentCount++
      console.log(`✅ 30-min reminder sent to ${app.email}`)
    } catch (error) {
      console.error(`❌ Failed to send 30-min reminder to ${app.email}:`, error)
    }
  }

  console.log(`📧 Interview reminders complete: ${sentCount} sent`)

  return new Response(
    JSON.stringify({
      success: true,
      reminders_sent: sentCount,
      one_day_count: oneDayInterviews?.length || 0,
      thirty_min_count: thirtyMinInterviews?.length || 0,
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  )
})
