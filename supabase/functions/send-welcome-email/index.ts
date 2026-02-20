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
  studentLevel?: "playground" | "academy" | "professional";
  interests?: string[];
  mainGoal?: string;
}

const generateEmailContent = (
  name: string,
  role: string,
  studentLevel?: string,
  interests?: string[],
  mainGoal?: string
) => {
  const baseUrl = 'https://engleuphoria.lovable.app';
  
  const purplePrimary = '#7c3aed';
  const purpleSecondary = '#8b5cf6';
  const purpleBackground = '#f5f3ff';
  
  const emailTemplate = (title: string, content: string, ctaText: string, ctaLink: string, headerColor?: string, headerSecondary?: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, ${purpleBackground} 0%, #ede9fe 100%); padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.1);">
          <div style="text-align: center; padding: 40px 32px 24px; background: linear-gradient(135deg, ${headerColor || purplePrimary} 0%, ${headerSecondary || purpleSecondary} 100%);">
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
            <a href="${ctaLink}" style="display: inline-block; background: linear-gradient(135deg, ${headerColor || purplePrimary} 0%, ${headerSecondary || purpleSecondary} 100%); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);">
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
  } else if (role === 'student' && studentLevel === 'playground') {
    // 🌈 Playground Welcome (Kids < 12)
    return {
      subject: `Welcome to the Adventure, ${name}! 🚀`,
      html: emailTemplate(
        'Welcome Explorer',
        `
          <h2 style="color: #f59e0b; margin: 0 0 16px; font-size: 24px;">Welcome, ${name}! 🌟</h2>
          <p style="margin: 0 0 16px; font-size: 16px;">Your AI guide is ready! We've unlocked the <strong>First Island</strong> for you.</p>
          <div style="background: #fffbeb; padding: 20px; border-radius: 12px; margin: 24px 0; border: 2px dashed #f59e0b;">
            <h3 style="color: #d97706; margin: 0 0 12px; font-size: 18px;">🏝️ Your First Quest Awaits!</h3>
            <ul style="margin: 0; padding-left: 20px; color: #78350f;">
              <li style="margin-bottom: 8px;">⭐ Log in to start your first quest</li>
              <li style="margin-bottom: 8px;">🎯 Earn your first <strong>50 Stars</strong></li>
              <li style="margin-bottom: 8px;">🗺️ Explore the Playground world</li>
              <li>🏆 Unlock badges as you learn!</li>
            </ul>
          </div>
          <p style="margin: 0; font-size: 15px;">Let the adventure begin! 🎮</p>
        `,
        'Start Your Quest! 🚀',
        `${baseUrl}/student-dashboard`,
        '#f59e0b',
        '#ef4444'
      )
    };
  } else if (role === 'student' && studentLevel === 'academy') {
    // ⚡ Academy Welcome (Teens 12-17)
    const interestsText = interests?.length ? interests.join(', ') : 'your unique learning goals';
    return {
      subject: `Level Up: Your Academy Access is Live ⚡`,
      html: emailTemplate(
        'Welcome to the Academy',
        `
          <h2 style="color: #7c3aed; margin: 0 0 16px; font-size: 24px;">Hey ${name}! ⚡</h2>
          <p style="margin: 0 0 16px; font-size: 16px;">You've been placed in the <strong>Academy</strong>. We've analyzed your interests in <em>${interestsText}</em> and built your 4-week roadmap.</p>
          <div style="background: #f5f3ff; padding: 20px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #7c3aed;">
            <h3 style="color: #7c3aed; margin: 0 0 12px; font-size: 18px;">🎯 Your Roadmap Is Ready</h3>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
              <li style="margin-bottom: 8px;">📱 Check your <strong>Daily Feed</strong> for today's challenge</li>
              <li style="margin-bottom: 8px;">🏆 Complete challenges to earn XP and level up</li>
              <li style="margin-bottom: 8px;">👥 Join your Academy community</li>
              <li>📈 Track your progress on the leaderboard</li>
            </ul>
          </div>
          <p style="margin: 0; font-size: 15px;">Your journey to fluency starts now!</p>
        `,
        'Open Your Dashboard ⚡',
        `${baseUrl}/student-dashboard`,
        '#7c3aed',
        '#06b6d4'
      )
    };
  } else if (role === 'student' && studentLevel === 'professional') {
    // 📈 Professional Welcome (Adults 18+)
    const goalText = mainGoal || 'professional English fluency';
    return {
      subject: `Engleuphoria: Your Executive Learning Path is Ready 📈`,
      html: emailTemplate(
        'Welcome Professional',
        `
          <h2 style="color: #059669; margin: 0 0 16px; font-size: 24px;">Welcome, ${name} 📈</h2>
          <p style="margin: 0 0 16px; font-size: 16px;">Based on your assessment, we have tailored a high-efficiency curriculum focusing on <strong>${goalText}</strong>.</p>
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #059669;">
            <h3 style="color: #059669; margin: 0 0 12px; font-size: 18px;">📋 Your Executive Path</h3>
            <ul style="margin: 0; padding-left: 20px; color: #374151;">
              <li style="margin-bottom: 8px;">📊 Your ROI charts are now live on your dashboard</li>
              <li style="margin-bottom: 8px;">🗓️ Schedule your first 1-on-1 briefing with your coach today</li>
              <li style="margin-bottom: 8px;">📚 Access your personalized curriculum materials</li>
              <li>🎯 Track measurable progress toward your goals</li>
            </ul>
          </div>
          <p style="margin: 0; font-size: 15px;">Let's make every session count.</p>
        `,
        'Schedule Your First Session',
        `${baseUrl}/student-dashboard`,
        '#059669',
        '#0d9488'
      )
    };
  } else {
    // Generic student (fallback)
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
    const { email, name, role, studentLevel, interests, mainGoal }: WelcomeEmailRequest = await req.json();
    
    console.log(`Sending welcome email to ${role}: ${name} (${email}), level: ${studentLevel || 'none'}`);

    const emailContent = generateEmailContent(name, role, studentLevel, interests, mainGoal);

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
