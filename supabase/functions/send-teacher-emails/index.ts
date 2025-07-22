import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'approval' | 'rejection' | 'interview_invite';
  teacherName: string;
  teacherEmail: string;
  interviewDate?: string;
  interviewTime?: string;
  rejectionReason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, teacherName, teacherEmail, interviewDate, interviewTime, rejectionReason }: EmailRequest = await req.json();

    let subject = "";
    let html = "";

    switch (type) {
      case 'approval':
        subject = "🎉 Welcome to EnglEuphoria - Application Approved!";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #6366f1; text-align: center;">Welcome to EnglEuphoria!</h1>
            <p>Dear ${teacherName},</p>
            <p>Congratulations! We're thrilled to inform you that your application to become a teacher at EnglEuphoria has been <strong>approved</strong>.</p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0369a1; margin-top: 0;">What's Next?</h3>
              <ul>
                <li>You can now access your teacher dashboard</li>
                <li>Start creating your teaching profile</li>
                <li>Schedule your first classes</li>
                <li>Connect with students worldwide</li>
              </ul>
            </div>
            
            <p>We're excited to have you join our community of dedicated English teachers. Your expertise and passion will help students achieve their language learning goals.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://engleuphoria.lovable.app/teacher-dashboard" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Access Your Dashboard</a>
            </div>
            
            <p>If you have any questions, please don't hesitate to reach out to our support team.</p>
            
            <p>Welcome aboard!<br>
            <strong>The EnglEuphoria Team</strong></p>
          </div>
        `;
        break;

      case 'rejection':
        subject = "Update on Your EnglEuphoria Teaching Application";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #ef4444; text-align: center;">Application Update</h1>
            <p>Dear ${teacherName},</p>
            <p>Thank you for your interest in becoming a teacher at EnglEuphoria and for taking the time to submit your application.</p>
            
            <p>After careful review, we regret to inform you that we are unable to move forward with your application at this time.</p>
            
            ${rejectionReason ? `
              <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #dc2626; margin-top: 0;">Feedback:</h3>
                <p>${rejectionReason}</p>
              </div>
            ` : ''}
            
            <p>We encourage you to continue developing your teaching skills and consider reapplying in the future. We appreciate your interest in our platform and wish you the best in your teaching endeavors.</p>
            
            <p>Thank you for your understanding.</p>
            
            <p>Best regards,<br>
            <strong>The EnglEuphoria Team</strong></p>
          </div>
        `;
        break;

      case 'interview_invite':
        subject = "Interview Invitation - EnglEuphoria Teaching Position";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #6366f1; text-align: center;">Interview Invitation</h1>
            <p>Dear ${teacherName},</p>
            <p>Great news! We were impressed with your teaching application and would like to invite you for an interview.</p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0369a1; margin-top: 0;">Interview Details:</h3>
              <p><strong>Date:</strong> ${interviewDate}</p>
              <p><strong>Time:</strong> ${interviewTime}</p>
              <p><strong>Duration:</strong> Approximately 20 minutes</p>
              <p><strong>Format:</strong> Video call via our platform</p>
            </div>
            
            <p>During the interview, we'll discuss:</p>
            <ul>
              <li>Your teaching experience and methodology</li>
              <li>Your approach to student engagement</li>
              <li>Platform features and teaching tools</li>
              <li>Any questions you may have about EnglEuphoria</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://engleuphoria.lovable.app/teacher-onboarding" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Confirm Interview</a>
            </div>
            
            <p>Please confirm your attendance by clicking the link above. If you need to reschedule, please contact us as soon as possible.</p>
            
            <p>We look forward to speaking with you!</p>
            
            <p>Best regards,<br>
            <strong>The EnglEuphoria Team</strong></p>
          </div>
        `;
        break;

      default:
        throw new Error('Invalid email type');
    }

    const emailResponse = await resend.emails.send({
      from: "EnglEuphoria <onboarding@resend.dev>",
      to: [teacherEmail],
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-teacher-emails function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);