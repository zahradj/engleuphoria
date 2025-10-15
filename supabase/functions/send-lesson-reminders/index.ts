import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔔 Starting lesson reminder check...');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get pending reminders that need to be sent
    const { data: reminders, error: remindersError } = await supabase
      .rpc('get_pending_reminders');
    
    if (remindersError) {
      console.error('Error fetching reminders:', remindersError);
      throw remindersError;
    }
    
    if (!reminders || reminders.length === 0) {
      console.log('No pending reminders to send');
      return new Response(
        JSON.stringify({ message: 'No pending reminders', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    
    console.log(`Found ${reminders.length} reminders to send`);
    
    let successCount = 0;
    let failCount = 0;
    
    // Send each reminder
    for (const reminder of reminders) {
      try {
        const reminderTypeText = reminder.reminder_type === '24h_before' 
          ? '24 hours' 
          : reminder.reminder_type === '1h_before' 
            ? '1 hour' 
            : '15 minutes';
        
        const recipientLabel = reminder.recipient_type === 'teacher' 
          ? 'Teacher' 
          : reminder.recipient_type === 'parent' 
            ? 'Parent' 
            : 'Student';
        
        // Send email
        const { error: emailError } = await resend.emails.send({
          from: 'EnglEuphoria <lessons@resend.dev>',
          to: [reminder.recipient_email],
          subject: `Reminder: ${reminder.lesson_title} in ${reminderTypeText}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Lesson Reminder</h2>
              <p>Hello ${reminder.recipient_name},</p>
              
              <p>This is a reminder that your lesson is coming up in <strong>${reminderTypeText}</strong>.</p>
              
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">${reminder.lesson_title}</h3>
                <p><strong>Date & Time:</strong> ${new Date(reminder.lesson_date).toLocaleString()}</p>
                <p><strong>Teacher:</strong> ${reminder.teacher_name}</p>
                <p><strong>Student:</strong> ${reminder.student_name}</p>
              </div>
              
              ${reminder.room_link ? `
              <p>
                <a href="${reminder.room_link}" 
                   style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 6px; margin: 10px 0;">
                  Join Lesson Room
                </a>
              </p>
              ` : ''}
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                See you soon!<br>
                EnglEuphoria Team
              </p>
            </div>
          `,
        });
        
        if (emailError) {
          console.error(`Failed to send email to ${reminder.recipient_email}:`, emailError);
          
          // Update reminder status to failed
          await supabase
            .from('lesson_reminders')
            .update({ 
              email_status: 'failed',
              error_message: emailError.message || 'Unknown error',
              sent_at: new Date().toISOString()
            })
            .eq('id', reminder.reminder_id);
          
          failCount++;
        } else {
          console.log(`✅ Sent ${reminder.reminder_type} reminder to ${reminder.recipient_email}`);
          
          // Update reminder status to sent
          await supabase
            .from('lesson_reminders')
            .update({ 
              email_status: 'sent',
              sent_at: new Date().toISOString()
            })
            .eq('id', reminder.reminder_id);
          
          successCount++;
        }
      } catch (error) {
        console.error(`Error processing reminder ${reminder.reminder_id}:`, error);
        failCount++;
      }
    }
    
    console.log(`✅ Reminder processing complete. Success: ${successCount}, Failed: ${failCount}`);
    
    return new Response(
      JSON.stringify({ 
        message: 'Reminders processed',
        total: reminders.length,
        success: successCount,
        failed: failCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error('Error in send-lesson-reminders function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
