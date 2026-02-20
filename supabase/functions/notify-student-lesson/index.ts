import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LessonNotificationRequest {
  student_email: string;
  student_name: string;
  student_level: "playground" | "academy" | "professional";
  lesson_title: string;
}

const getLevelConfig = (level: string) => {
  switch (level) {
    case "playground":
      return {
        emoji: "🌟",
        tagline: "Your adventure lesson for today is ready!",
        dashboardLabel: "Playground",
        accentColor: "#ec4899",
        gradientStart: "#f472b6",
        gradientEnd: "#a855f7",
        ctaText: "Start My Adventure! 🚀",
        dashboardPath: "/student-dashboard?tab=playground",
      };
    case "professional":
      return {
        emoji: "📊",
        tagline: "Your personalized business English briefing is ready.",
        dashboardLabel: "Professional Hub",
        accentColor: "#059669",
        gradientStart: "#10b981",
        gradientEnd: "#0d9488",
        ctaText: "View My Briefing →",
        dashboardPath: "/student-dashboard?tab=hub",
      };
    case "academy":
    default:
      return {
        emoji: "🔥",
        tagline: "Your daily challenge just dropped. Don't miss it!",
        dashboardLabel: "Academy",
        accentColor: "#7c3aed",
        gradientStart: "#8b5cf6",
        gradientEnd: "#06b6d4",
        ctaText: "Start My Challenge ⚡",
        dashboardPath: "/student-dashboard?tab=academy",
      };
  }
};

const generateLessonReadyEmail = (
  studentName: string,
  lessonTitle: string,
  level: string
) => {
  const config = getLevelConfig(level);
  const baseUrl = "https://engleuphoria.lovable.app";
  const ctaLink = `${baseUrl}${config.dashboardPath}`;

  const firstName = studentName.split(" ")[0] || studentName;

  return {
    subject: `${config.emoji} Your lesson is ready — ${lessonTitle}`,
    html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Lesson is Ready!</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(124, 58, 237, 0.15);">
      
      <!-- Header -->
      <div style="text-align: center; padding: 48px 32px 32px; background: linear-gradient(135deg, ${config.gradientStart} 0%, ${config.gradientEnd} 100%);">
        <div style="width: 80px; height: 80px; margin: 0 auto 16px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; line-height: 80px;">
          ${config.emoji}
        </div>
        <h1 style="color: white; margin: 0 0 8px; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">EnglEuphoria</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 0; font-size: 15px; font-weight: 500;">${config.dashboardLabel}</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px 32px; color: #374151; line-height: 1.7;">
        <h2 style="color: #111827; margin: 0 0 12px; font-size: 22px; font-weight: 700;">
          Hi ${firstName}! ${config.emoji}
        </h2>
        <p style="margin: 0 0 24px; font-size: 16px; color: #4b5563;">
          ${config.tagline}
        </p>

        <!-- Lesson Card -->
        <div style="background: linear-gradient(135deg, #faf5ff 0%, #eff6ff 100%); border: 1px solid #e9d5ff; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 6px; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: ${config.accentColor};">Today's Lesson</p>
          <p style="margin: 0; font-size: 18px; font-weight: 700; color: #111827; line-height: 1.4;">${lessonTitle}</p>
          <p style="margin: 12px 0 0; font-size: 14px; color: #6b7280;">✨ AI-generated just for you based on your level and interests</p>
        </div>

        <p style="margin: 0 0 8px; font-size: 15px; color: #4b5563;">
          Your personalized lesson includes:
        </p>
        <ul style="margin: 0 0 28px; padding-left: 0; list-style: none; color: #4b5563;">
          <li style="padding: 6px 0; font-size: 15px;">📚 <strong>Vocabulary Spotlight</strong> — 5 words with IPA pronunciation</li>
          <li style="padding: 6px 0; font-size: 15px;">🎯 <strong>Quick Quiz</strong> — Test your understanding</li>
          <li style="padding: 6px 0; font-size: 15px;">🤖 <strong>AI Tutor</strong> — Practice with your personal coach</li>
        </ul>

        <p style="margin: 0 0 28px; font-size: 14px; color: #9ca3af; font-style: italic;">
          ⏰ Lessons refresh every morning. Don't let today's go to waste!
        </p>
      </div>

      <!-- CTA -->
      <div style="text-align: center; padding: 0 32px 40px;">
        <a href="${ctaLink}" style="display: inline-block; background: linear-gradient(135deg, ${config.gradientStart} 0%, ${config.gradientEnd} 100%); color: white; padding: 16px 48px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 17px; box-shadow: 0 6px 20px rgba(124, 58, 237, 0.35); letter-spacing: -0.2px;">
          ${config.ctaText}
        </a>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 24px 32px 32px; border-top: 1px solid #f3f4f6; color: #9ca3af; font-size: 13px;">
        <p style="margin: 0 0 4px; font-weight: 600; color: #6b7280;">EnglEuphoria</p>
        <p style="margin: 0;">Your English Learning Journey</p>
        <p style="margin: 8px 0 0; font-size: 12px;">© 2025 EnglEuphoria. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
    `.trim(),
  };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: LessonNotificationRequest = await req.json();
    const { student_email, student_name, student_level, lesson_title } = body;

    if (!student_email || !student_name || !lesson_title) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields: student_email, student_name, lesson_title" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const level = student_level || "academy";
    const emailContent = generateLessonReadyEmail(student_name, lesson_title, level);

    console.log(`Sending lesson-ready notification to ${student_email} for level: ${level}`);

    const emailResponse = await resend.emails.send({
      from: "EnglEuphoria <noreply@engleuphoria.com>",
      to: [student_email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("Lesson notification sent successfully:", emailResponse.id);

    return new Response(
      JSON.stringify({ success: true, emailId: emailResponse.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in notify-student-lesson function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
