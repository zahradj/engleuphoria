import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
  role: "student" | "teacher" | "parent";
}

const generateEmailContent = (name: string, role: string) => {
  const baseUrl = 'https://engleuphoria.lovable.app';
  
  const purplePrimary = '#7c3aed';
  const purpleSecondary = '#8b5cf6';
  const purpleBackground = '#f5f3ff';
  
  const emailTemplate = (title: string, content: string, ctaText: string, ctaLink: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, ${purpleBackground} 0%, #ede9fe 100%); padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.1);">
          <div style="text-align: center; padding: 40px 32px 24px; background: linear-gradient(135deg, ${purplePrimary} 0%, ${purpleSecondary} 100%);">
            <div style="width: 80px; height: 80px; margin: 0 auto 16px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <span style="font-size: 48px;">📚</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">EnglEuphoria</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Your English Learning Journey</p>
          </div>
          
          <div style="padding: 32px; color: #374151; line-height: 1.6;">
            ${content}
          </div>
          
          <div style="text-align: center; padding: 0 32px 32px;">
            <a href="${ctaLink}" style="display: inline-block; background: linear-gradient(135deg, ${purplePrimary} 0%, ${purpleSecondary} 100%); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);">
              ${ctaText}
            </a>
          </div>
          
          <div style="text-align: center; padding: 24px 32px 32px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 14px;">
            <p style="margin: 0 0 8px;">EnglEuphoria - Your English Learning Journey</p>
            <p style="margin: 0; font-size: 12px;">© 2025 EnglEuphoria. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  
  if (role === 'teacher') {
    return {
      subject: '👨‍🏫 Welcome to EnglEuphoria Teaching Team!',
      html: emailTemplate(
        'Welcome Teacher',
        `
          <h2 style="color: ${purplePrimary}; margin: 0 0 16px; font-size: 24px;">Welcome, ${name}! 🎓</h2>
          <p style="margin: 0 0 16px;">Thank you for joining our teaching community! We're thrilled to have you on board to make a difference in students' lives.</p>
          <div style="background: ${purpleBackground}; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <h3 style="color: ${purplePrimary}; margin: 0 0 12px; font-size: 18px;">Next Steps:</h3>
            <ol style="margin: 0; padding-left: 20px; color: #4b5563;">
              <li style="margin-bottom: 8px;"><strong>Complete Your Profile</strong> - Add your photo, bio, and teaching experience</li>
              <li style="margin-bottom: 8px;"><strong>Equipment Test</strong> - Verify your camera, microphone, and internet</li>
              <li style="margin-bottom: 8px;"><strong>Interview</strong> - Schedule a quick interview with our team</li>
              <li><strong>Start Teaching</strong> - Once approved, you can begin accepting students!</li>
            </ol>
          </div>
          <p style="margin: 0;">Our team will review your application and get back to you shortly. If you have questions, reply to this email!</p>
        `,
        'Complete Your Profile',
        `${baseUrl}/teacher-application`
      )
    };
  } else if (role === 'parent') {
    return {
      subject: '👨‍👩‍👧 Welcome to EnglEuphoria, Parent!',
      html: emailTemplate(
        'Welcome Parent',
        `
          <h2 style="color: ${purplePrimary}; margin: 0 0 16px; font-size: 24px;">Welcome, ${name}! 👋</h2>
          <p style="margin: 0 0 16px;">Thank you for trusting EnglEuphoria with your child's English education!</p>
          <div style="background: ${purpleBackground}; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <h3 style="color: ${purplePrimary}; margin: 0 0 12px; font-size: 18px;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
              <li style="margin-bottom: 8px;">Complete your child's learning profile</li>
              <li style="margin-bottom: 8px;">Book a free trial lesson</li>
              <li style="margin-bottom: 8px;">Track progress through your parent dashboard</li>
              <li>Communicate directly with teachers</li>
            </ul>
          </div>
          <p style="margin: 0;">We're excited to help your child succeed in English!</p>
        `,
        'Set Up Your Account',
        `${baseUrl}/parent-dashboard`
      )
    };
  } else {
    // Student (default)
    return {
      subject: '🎓 Welcome to EnglEuphoria, Young Learner!',
      html: emailTemplate(
        'Welcome Student',
        `
          <h2 style="color: ${purplePrimary}; margin: 0 0 16px; font-size: 24px;">Welcome, ${name}! 🌟</h2>
          <p style="margin: 0 0 16px;">Your English learning adventure starts now! We're so excited to help you become confident in English.</p>
          <div style="background: ${purpleBackground}; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <h3 style="color: ${purplePrimary}; margin: 0 0 12px; font-size: 18px;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
              <li style="margin-bottom: 8px;">Complete your learning profile</li>
              <li style="margin-bottom: 8px;">Take a quick placement test to find your level</li>
              <li style="margin-bottom: 8px;">Start your first interactive lesson</li>
              <li>Connect with amazing teachers</li>
            </ul>
          </div>
          <p style="margin: 0;">If you have any questions, our support team is always here to help!</p>
        `,
        'Get Started',
        `${baseUrl}/student-application`
      )
    };
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-welcome-email function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, role }: WelcomeEmailRequest = await req.json();
    
    console.log(`Sending welcome email to ${role}: ${name} (${email})`);

    const emailContent = generateEmailContent(name, role);

    const emailResponse = await resend.emails.send({
      from: "EnglEuphoria <welcome@engleuphoria.com>",
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
