import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'email-confirmation' | 'login-notification' | 'password-reset' | 'unusual-login-attempt';
  email: string;
  userName?: string;
  confirmationLink?: string;
  resetLink?: string;
  loginDetails?: {
    date: string;
    device: string;
    location: string;
  };
  verifyLink?: string;
}

const generateEmailContent = (type: string, data: any) => {
  const platformName = "EnglEuphoria";
  
  switch (type) {
    case 'email-confirmation':
      return {
        subject: "Confirm Your Email to Get Started",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb; text-align: center;">Welcome to ${platformName}!</h1>
            
            <p style="font-size: 16px; line-height: 1.5;">
              Please confirm your email address to activate your account:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.confirmationLink}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                👉 Confirm My Email
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If you didn't create an account, please ignore this email.
            </p>
          </div>
        `
      };

    case 'login-notification':
      return {
        subject: "New Login to Your Account",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Hi ${data.userName || 'there'},</h1>
            
            <p style="font-size: 16px; line-height: 1.5;">
              We noticed a login to your ${platformName} account:
            </p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Date:</strong> ${data.loginDetails?.date}</p>
              <p><strong>Device:</strong> ${data.loginDetails?.device}</p>
              <p><strong>Location:</strong> ${data.loginDetails?.location}</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.5;">
              If this was you, no action is needed.
            </p>
            
            <p style="color: #dc2626; font-size: 16px; line-height: 1.5;">
              If not, please reset your password immediately.
            </p>
          </div>
        `
      };

    case 'password-reset':
      return {
        subject: "Reset Your Password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Reset Your Password</h1>
            
            <p style="font-size: 16px; line-height: 1.5;">
              We received a request to reset your password.
              Click the link below to set a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.resetLink}" 
                 style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                👉 Reset Password
              </a>
            </div>
            
            <p style="color: #dc2626; font-size: 14px;">
              This link will expire in 30 minutes.
            </p>
            
            <p style="color: #666; font-size: 14px;">
              If you didn't request this, you can ignore this email.
            </p>
          </div>
        `
      };

    case 'unusual-login-attempt':
      return {
        subject: "Unusual Login Attempt Blocked",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #dc2626;">⚠️ Security Alert</h1>
            
            <p style="font-size: 16px; line-height: 1.5;">
              We detected a suspicious login attempt to your account from a new device or location.
            </p>
            
            <p style="font-size: 16px; line-height: 1.5;">
              For your security, we've blocked the attempt.
            </p>
            
            <p style="font-size: 16px; line-height: 1.5;">
              If this was you, please verify your identity:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.verifyLink}" 
                 style="background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                👉 Verify My Account
              </a>
            </div>
          </div>
        `
      };

    default:
      throw new Error(`Unknown email type: ${type}`);
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, userName, confirmationLink, resetLink, loginDetails, verifyLink }: EmailRequest = await req.json();

    console.log(`Sending ${type} email to ${email}`);

    const emailContent = generateEmailContent(type, {
      userName,
      confirmationLink,
      resetLink,
      loginDetails,
      verifyLink
    });

    const emailResponse = await resend.emails.send({
      from: "EnglEuphoria <noreply@resend.dev>",
      to: [email],
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