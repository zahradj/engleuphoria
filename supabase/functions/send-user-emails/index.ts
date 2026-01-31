import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  type: 'email-confirmation' | 'login-notification' | 'password-reset' | 'unusual-login-attempt' | 'student-welcome' | 'teacher-welcome';
  data: {
    userName?: string;
    confirmationUrl?: string;
    resetUrl?: string;
    loginTime?: string;
    location?: string;
    device?: string;
    baseUrl?: string;
  };
}

const generateEmailContent = (type: string, data: any) => {
  const baseUrl = data.baseUrl || 'https://engleuphoria.lovable.app';
  
  // Purple theme colors
  const purplePrimary = '#7c3aed';
  const purpleSecondary = '#8b5cf6';
  const purpleLight = '#a78bfa';
  const purpleBackground = '#f5f3ff';
  
  const emailTemplate = (title: string, content: string, ctaText?: string, ctaLink?: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, ${purpleBackground} 0%, #ede9fe 100%); padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.1);">
          <!-- Header with Logo -->
          <div style="text-align: center; padding: 40px 32px 24px; background: linear-gradient(135deg, ${purplePrimary} 0%, ${purpleSecondary} 100%);">
            <div style="width: 80px; height: 80px; margin: 0 auto 16px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <span style="font-size: 48px;">📚</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">EnglEuphoria</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Your English Learning Journey</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px; color: #374151; line-height: 1.6;">
            ${content}
          </div>
          
          ${ctaText && ctaLink ? `
          <!-- CTA Button -->
          <div style="text-align: center; padding: 0 32px 32px;">
            <a href="${ctaLink}" style="display: inline-block; background: linear-gradient(135deg, ${purplePrimary} 0%, ${purpleSecondary} 100%); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);">
              ${ctaText}
            </a>
          </div>
          ` : ''}
          
          <!-- Footer -->
          <div style="text-align: center; padding: 24px 32px 32px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 14px;">
            <p style="margin: 0 0 8px;">EnglEuphoria - Your English Learning Journey</p>
            <p style="margin: 0; font-size: 12px;">© 2025 EnglEuphoria. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  
  switch (type) {
    case 'email-confirmation':
      return {
        subject: '✨ Confirm Your Email - EnglEuphoria',
        html: emailTemplate(
          'Confirm Your Email',
          `
            <h2 style="color: ${purplePrimary}; margin: 0 0 16px; font-size: 24px;">Welcome to EnglEuphoria! 🎉</h2>
            <p style="margin: 0 0 16px;">Thank you for joining our learning community! We're excited to have you start your English learning adventure.</p>
            <p style="margin: 0 0 24px;">Please confirm your email address by clicking the button below:</p>
          `,
          'Confirm Email Address',
          data.confirmationUrl || `${baseUrl}/email-verification`
        )
      };

    case 'student-welcome':
      return {
        subject: '🎓 Welcome to EnglEuphoria, Young Learner!',
        html: emailTemplate(
          'Welcome Student',
          `
            <h2 style="color: ${purplePrimary}; margin: 0 0 16px; font-size: 24px;">Welcome, ${data.userName || 'Student'}! 🌟</h2>
            <p style="margin: 0 0 16px;">Your English learning adventure starts now! We're so excited to help you become confident in English.</p>
            <div style="background: ${purpleBackground}; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <h3 style="color: ${purplePrimary}; margin: 0 0 12px; font-size: 18px;">What's Next?</h3>
              <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                <li style="margin-bottom: 8px;">Complete your learning profile</li>
                <li style="margin-bottom: 8px;">Take a placement test to find your level</li>
                <li style="margin-bottom: 8px;">Start your first lesson</li>
                <li>Connect with amazing teachers</li>
              </ul>
            </div>
            <p style="margin: 0;">If you have any questions, our support team is always here to help!</p>
          `,
          'Get Started',
          `${baseUrl}/student-application`
        )
      };

    case 'teacher-welcome':
      return {
        subject: '👨‍🏫 Welcome to EnglEuphoria Teaching Team!',
        html: emailTemplate(
          'Welcome Teacher',
          `
            <h2 style="color: ${purplePrimary}; margin: 0 0 16px; font-size: 24px;">Welcome, ${data.userName || 'Teacher'}! 🎓</h2>
            <p style="margin: 0 0 16px;">Thank you for joining our teaching community! We're thrilled to have you on board to make a difference in students' lives.</p>
            <div style="background: ${purpleBackground}; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <h3 style="color: ${purplePrimary}; margin: 0 0 12px; font-size: 18px;">Next Steps:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                <li style="margin-bottom: 8px;">Complete your teacher application</li>
                <li style="margin-bottom: 8px;">Set up your teaching profile</li>
                <li style="margin-bottom: 8px;">Add your availability</li>
                <li>Start connecting with students</li>
              </ul>
            </div>
            <p style="margin: 0;">We'll review your application and get back to you shortly!</p>
          `,
          'Complete Application',
          `${baseUrl}/teacher-application`
        )
      };

    case 'password-reset':
      return {
        subject: '🔐 Reset Your Password - EnglEuphoria',
        html: emailTemplate(
          'Reset Your Password',
          `
            <h2 style="color: ${purplePrimary}; margin: 0 0 16px; font-size: 24px;">Password Reset Request</h2>
            <p style="margin: 0 0 16px;">We received a request to reset your password. Click the button below to create a new password:</p>
            <p style="margin: 24px 0; padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; color: #92400e; font-size: 14px;">
              ⚠️ This link will expire in 30 minutes for security reasons.
            </p>
            <p style="margin: 24px 0 0; font-size: 14px; color: #6b7280;">
              If you didn't request this password reset, you can safely ignore this email.
            </p>
          `,
          'Reset Password',
          data.resetUrl || `${baseUrl}/reset-password`
        )
      };

    case 'login-notification':
      return {
        subject: '🔔 New Login Detected - EnglEuphoria',
        html: emailTemplate(
          'Login Notification',
          `
            <h2 style="color: ${purplePrimary}; margin: 0 0 16px; font-size: 24px;">New Login Detected</h2>
            <p style="margin: 0 0 16px;">We noticed a new login to your EnglEuphoria account:</p>
            <div style="background: ${purpleBackground}; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <p style="margin: 0 0 8px; color: #4b5563;"><strong>Time:</strong> ${data.loginTime || 'Just now'}</p>
              <p style="margin: 0 0 8px; color: #4b5563;"><strong>Location:</strong> ${data.location || 'Unknown'}</p>
              <p style="margin: 0; color: #4b5563;"><strong>Device:</strong> ${data.device || 'Unknown'}</p>
            </div>
            <p style="margin: 0 0 16px;">If this was you, you can safely ignore this email.</p>
            <p style="margin: 0; padding: 16px; background: #fee2e2; border-left: 4px solid #ef4444; border-radius: 4px; color: #991b1b; font-size: 14px;">
              ⚠️ If this wasn't you, please reset your password immediately.
            </p>
          `,
          'Secure My Account',
          `${baseUrl}/login`
        )
      };

    default:
      return {
        subject: 'Notification from EnglEuphoria',
        html: emailTemplate(
          'Notification',
          `<p>You have a new notification from EnglEuphoria.</p>`,
          'View Dashboard',
          baseUrl
        )
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, type, data }: EmailRequest = await req.json();

    console.log(`Sending ${type} email to ${to}`);

    const emailContent = generateEmailContent(type, data);

    const emailResponse = await resend.emails.send({
      from: "EnglEuphoria <noreply@engleuphoria.com>",
      to: [to],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-user-emails function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);