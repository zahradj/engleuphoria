import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  name: string;
  email: string;
  role: "student" | "teacher";
  registeredAt?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("notify-admin-new-registration function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, role, registeredAt }: NotificationRequest = await req.json();
    
    console.log(`New ${role} registration: ${name} (${email})`);

    const roleEmoji = role === "teacher" ? "👩‍🏫" : "👨‍🎓";
    const roleLabel = role === "teacher" ? "Teacher" : "Student";
    const formattedDate = registeredAt 
      ? new Date(registeredAt).toLocaleString("en-US", { 
          dateStyle: "full", 
          timeStyle: "short" 
        })
      : new Date().toLocaleString("en-US", { 
          dateStyle: "full", 
          timeStyle: "short" 
        });

    const emailResponse = await resend.emails.send({
      from: "EnglEuphoria <notifications@engleuphoria.com>",
      to: ["f.zahra.Djaanine@engleuphoria.com"],
      subject: `${roleEmoji} New ${roleLabel} Registration - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f7; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .header .emoji { font-size: 48px; margin-bottom: 10px; }
            .content { padding: 30px; }
            .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 14px; margin-bottom: 20px; }
            .badge.teacher { background: #dbeafe; color: #1e40af; }
            .badge.student { background: #dcfce7; color: #166534; }
            .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
            .info-label { font-weight: 600; color: #6b7280; width: 120px; }
            .info-value { color: #111827; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="emoji">${roleEmoji}</div>
              <h1>New ${roleLabel} Registration</h1>
            </div>
            <div class="content">
              <span class="badge ${role}">${roleLabel}</span>
              
              <div class="info-row">
                <span class="info-label">Name</span>
                <span class="info-value">${name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email</span>
                <span class="info-value">${email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Registered</span>
                <span class="info-value">${formattedDate}</span>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated notification from EnglEuphoria</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Admin notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending admin notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
