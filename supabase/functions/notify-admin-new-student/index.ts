import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const payload = await req.json();
    
    const studentId = payload.record?.id;
    const studentEmail = payload.record?.email;
    const studentName = payload.record?.full_name;

    if (!studentId || !studentEmail || !studentName) {
      throw new Error("Missing student information");
    }

    // Fetch all admin users
    const { data: admins, error: adminError } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('role', 'admin');

    if (adminError) {
      throw new Error(`Failed to fetch admins: ${adminError.message}`);
    }

    if (!admins || admins.length === 0) {
      console.log("No admin users found to notify");
      return new Response(
        JSON.stringify({ success: true, message: "No admins to notify" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const registrationDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Send email to all admins
    const emailPromises = admins.map(async (admin) => {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "EnglEuphoria <notifications@engleuphoria.com>",
          to: [admin.email],
          subject: `New Student Registration: ${studentName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #7c3aed;">New Student Registered! 🎉</h2>
              <p>Hi ${admin.full_name},</p>
              <p>A new student has registered on the platform.</p>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #7c3aed;">Student Details</h3>
                <p><strong>Name:</strong> ${studentName}</p>
                <p><strong>Email:</strong> ${studentEmail}</p>
                <p><strong>Registration Date:</strong> ${registrationDate}</p>
              </div>
              
              <p>
                <a href="https://engleuphoria.lovable.app/admin?tab=students&student_id=${studentId}" 
                   style="display: inline-block; background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
                  View Student Profile
                </a>
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="color: #9ca3af; font-size: 12px;">
                This is an automated notification from EngLeuphoria. Please do not reply to this email.
              </p>
            </div>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const error = await emailResponse.text();
        console.error(`Failed to send email to ${admin.email}:`, error);
        throw new Error(`Email send failed for ${admin.email}: ${error}`);
      }

      return emailResponse.json();
    });

    const results = await Promise.all(emailPromises);
    console.log(`Successfully sent ${results.length} admin notification emails`);

    return new Response(
      JSON.stringify({ success: true, emails_sent: results.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in notify-admin-new-student:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
