import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CALLBACK_URL = Deno.env.get('LOVABLE_CALLBACK_URL') || ''
const API_KEY = Deno.env.get('LOVABLE_API_KEY') || ''

interface QueueMessage {
  id: number
  payload: {
    message_id: string
    to: string
    from: string
    sender_domain: string
    subject: string
    html: string
    text: string
    purpose: string
    label: string
    idempotency_key: string
    unsubscribe_token?: string
    queued_at: string
  }
  attempts: number
  expires_at: string
  created_at: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  if (!supabaseUrl || !supabaseServiceKey || !CALLBACK_URL || !API_KEY) {
    console.error('Missing required environment variables')
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Check rate-limit backoff
  const { data: state } = await supabase
    .from('email_send_state')
    .select('retry_after_until, send_delay_ms')
    .eq('id', 1)
    .single()

  if (state?.retry_after_until && new Date(state.retry_after_until) > new Date()) {
    console.log('Rate-limited, skipping cycle until', state.retry_after_until)
    return new Response(JSON.stringify({ skipped: true, reason: 'rate_limited' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const sendDelayMs = state?.send_delay_ms ?? 200
  let totalSent = 0
  let totalFailed = 0

  // Process auth_emails queue first (higher priority)
  for (const queueName of ['auth_emails', 'transactional_emails']) {
    const { data: messages, error: readError } = await supabase.rpc('read_email_batch', {
      _queue_name: queueName,
    })

    if (readError) {
      console.error(`Failed to read ${queueName} queue`, readError)
      continue
    }

    if (!messages || messages.length === 0) continue

    console.log(`Processing ${messages.length} messages from ${queueName}`)

    for (const msg of messages as QueueMessage[]) {
      const payload = msg.payload

      // Check TTL expiry
      if (new Date(msg.expires_at) < new Date()) {
        console.warn('Message expired, moving to DLQ', { id: msg.id, message_id: payload.message_id })
        await supabase.rpc('move_to_dlq', {
          _queue_name: queueName,
          _message_id: msg.id,
          _error_message: 'Message expired (TTL exceeded)',
        })
        await supabase.from('email_send_log').insert({
          message_id: payload.message_id,
          template_name: payload.label || queueName,
          recipient_email: payload.to,
          status: 'dlq',
          error_message: 'Message expired (TTL exceeded)',
        })
        totalFailed++
        continue
      }

      // Send via Lovable email API
      try {
        const emailPayload: Record<string, unknown> = {
          to: payload.to,
          from: payload.from,
          sender_domain: payload.sender_domain,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
          purpose: payload.purpose,
          label: payload.label,
          idempotency_key: payload.idempotency_key,
        }

        if (payload.unsubscribe_token) {
          emailPayload.unsubscribe_token = payload.unsubscribe_token
        }

        const response = await fetch(`${CALLBACK_URL}/emails/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify(emailPayload),
        })

        if (response.ok) {
          // Success — remove from queue
          await supabase.rpc('delete_email', {
            _queue_name: queueName,
            _message_id: msg.id,
          })
          await supabase.from('email_send_log').insert({
            message_id: payload.message_id,
            template_name: payload.label || queueName,
            recipient_email: payload.to,
            status: 'sent',
          })
          totalSent++
        } else if (response.status === 429) {
          // Rate limited — record backoff and stop processing
          const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10)
          const retryUntil = new Date(Date.now() + retryAfter * 1000).toISOString()
          console.warn('Rate limited, backing off until', retryUntil)
          await supabase
            .from('email_send_state')
            .update({
              retry_after_until: retryUntil,
              last_rate_limit_reason: `429 from email API at ${new Date().toISOString()}`,
            })
            .eq('id', 1)
          // Leave message in queue for retry
          return new Response(
            JSON.stringify({ sent: totalSent, failed: totalFailed, rate_limited: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else {
          // Server error or other failure
          const errorBody = await response.text().catch(() => 'unknown')
          console.error('Email send failed', {
            status: response.status,
            error: errorBody,
            message_id: payload.message_id,
          })

          if (msg.attempts >= 5) {
            await supabase.rpc('move_to_dlq', {
              _queue_name: queueName,
              _message_id: msg.id,
              _error_message: `Failed after ${msg.attempts} attempts: ${response.status} ${errorBody}`,
            })
            await supabase.from('email_send_log').insert({
              message_id: payload.message_id,
              template_name: payload.label || queueName,
              recipient_email: payload.to,
              status: 'dlq',
              error_message: `Failed after ${msg.attempts} attempts: ${response.status}`,
            })
            totalFailed++
          }
          // Otherwise, leave in queue with incremented attempts for retry
        }
      } catch (err) {
        console.error('Unexpected error sending email', {
          error: String(err),
          message_id: payload.message_id,
        })
        // Leave in queue for retry
      }

      // Small delay between sends to avoid bursting
      if (sendDelayMs > 0) {
        await new Promise((r) => setTimeout(r, sendDelayMs))
      }
    }
  }

  console.log(`Queue processing complete: ${totalSent} sent, ${totalFailed} failed`)

  return new Response(
    JSON.stringify({ sent: totalSent, failed: totalFailed }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})