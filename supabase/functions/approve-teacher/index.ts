import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const SITE_URL = "https://engleuphoria.lovable.app";
const LOGO_URL = "https://dcoxpyzoqjvmuuygvlme.supabase.co/storage/v1/object/public/email-assets/logo-black.png";

function buildWelcomeHtml(name: string, setPasswordUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Inter','Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <!-- Navy Header -->
  <div style="background:#0047AB;padding:28px 32px;text-align:center;">
    <img src="${LOGO_URL}" width="160" height="44" alt="EnglEuphoria" style="filter:brightness(0) invert(1);margin:0 auto;display:block;" />
  </div>
  <!-- Gold Seal -->
  <div style="background:#FFF8E1;padding:12px 32px;text-align:center;border-bottom:2px solid #F9A825;">
    <p style="font-size:14px;font-weight:700;color:#F57F17;letter-spacing:2px;text-transform:uppercase;margin:0;">🌟 WELCOME TO THE FAMILY</p>
  </div>
  <!-- Content -->
  <div style="padding:32px;">
    <p style="font-size:18px;font-weight:700;color:#0047AB;margin:0 0 16px;">Congratulations, ${name}! 🎓</p>
    <p style="font-size:15px;color:#37474F;line-height:1.7;margin:0 0 16px;">
      Your application stands out among many talented educators. After careful review, our Academic Committee has selected you to join the <strong>EnglEuphoria Pedagogical Team</strong>.
    </p>
    <p style="font-size:15px;color:#37474F;line-height:1.7;margin:0 0 24px;">
      Click below to create your account and begin your onboarding journey. You'll gain access to your <strong>Professional Hub</strong>, the <strong>II Wizard ecosystem</strong>, and your personal interview room.
    </p>
    <!-- CTA Button -->
    <div style="text-align:center;margin:24px 0;">
      <a href="${setPasswordUrl}" style="background:#0047AB;color:#ffffff;font-size:16px;font-weight:600;border-radius:8px;padding:16px 36px;text-decoration:none;display:inline-block;">
        Accept Invitation & Set Password
      </a>
    </div>
    <!-- Roadmap -->
    <div style="background:#F5F5F5;border-radius:10px;padding:20px 24px;margin:24px 0;border:1px solid #E0E0E0;">
      <p style="font-size:16px;font-weight:700;color:#0047AB;margin:0 0 12px;">📋 Your Onboarding Roadmap</p>
      <p style="font-size:14px;color:#455A64;line-height:1.6;margin:0 0 6px;">✅ <strong>Step 1:</strong> Set your password (click the button above)</p>
      <p style="font-size:14px;color:#455A64;line-height:1.6;margin:0 0 6px;">📝 <strong>Step 2:</strong> Complete your professional profile</p>
      <p style="font-size:14px;color:#455A64;line-height:1.6;margin:0 0 6px;">🎥 <strong>Step 3:</strong> Upload your intro video</p>
      <p style="font-size:14px;color:#455A64;line-height:1.6;margin:0;">🚀 <strong>Step 4:</strong> Final review & activation</p>
    </div>
    <p style="font-size:15px;color:#37474F;line-height:1.7;margin:24px 0 4px;">Warm regards,</p>
    <p style="font-size:14px;color:#0047AB;font-weight:600;margin:0 0 4px;">The EnglEuphoria Academic Committee</p>
    <p style="font-size:12px;color:#78909C;font-style:italic;margin:0;">Precision in Phonics. Excellence in Education.</p>
  </div>
  <!-- Dark Footer -->
  <div style="background:#0D1642;padding:24px 32px;text-align:center;">
    <p style="font-size:12px;color:#9CA3AF;margin:0 0 8px;">© 2026 EnglEuphoria. The Future of Learning.</p>
    <p style="font-size:11px;color:#6B7280;margin:0;line-height:1.5;font-style:italic;">"Progress is a marathon, not a sprint. We celebrate every sound, every word, and every step."</p>
  </div>
</div>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the caller is an admin
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: claimsData, error: claimsError } = await callerClient.auth.getClaims(
      authHeader.replace("Bearer ", "")
    );
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", claimsData.claims.sub)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden: admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { applicationId, email, firstName, lastName } = await req.json();
    if (!applicationId || !email) {
      return new Response(JSON.stringify({ error: "applicationId and email are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fullName = `${firstName || ""} ${lastName || ""}`.trim() || email.split("@")[0];

    // Step 1: Check if user already exists
    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    let authUserId: string;
    let setPasswordUrl = `${SITE_URL}/set-password`;

    if (existingUser) {
      authUserId = existingUser.id;
      console.log(`User already exists in auth: ${authUserId}`);
      // Generate a password reset link for existing user
      const { data: linkData } = await adminClient.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: { redirectTo: `${SITE_URL}/set-password` },
      });
      if (linkData?.properties?.action_link) {
        setPasswordUrl = linkData.properties.action_link;
      }
    } else {
      // Step 2: Create user account (no default invite email)
      const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
        email,
        email_confirm: false,
        user_metadata: { full_name: fullName, role: "teacher" },
      });

      if (createError) {
        console.error("Create user error:", createError);
        return new Response(JSON.stringify({ error: `Failed to create auth account: ${createError.message}` }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      authUserId = createData.user.id;
      console.log(`Created auth user: ${authUserId}`);

      // Generate invite link for the new user
      const { data: linkData } = await adminClient.auth.admin.generateLink({
        type: "invite",
        email,
        options: { redirectTo: `${SITE_URL}/set-password` },
      });
      if (linkData?.properties?.action_link) {
        setPasswordUrl = linkData.properties.action_link;
      }
    }

    // Step 3: Upsert into public.users
    const { error: usersError } = await adminClient.from("users").upsert(
      { id: authUserId, email, full_name: fullName, role: "teacher" },
      { onConflict: "id" }
    );
    if (usersError) console.error("Users upsert error:", usersError);

    // Step 4: Insert user_roles
    const { error: roleInsertError } = await adminClient.from("user_roles").upsert(
      { user_id: authUserId, role: "teacher" },
      { onConflict: "user_id,role" }
    );
    if (roleInsertError) console.error("Role insert error:", roleInsertError);

    // Step 5: Fetch application data
    const { data: appData } = await adminClient
      .from("teacher_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    // Step 6: Create teacher profile
    const { error: profileError } = await adminClient.from("teacher_profiles").upsert(
      {
        user_id: authUserId,
        bio: appData?.bio || "",
        video_url: appData?.video_url || "",
        specializations: appData?.preferred_age_groups || [],
        languages_spoken: appData?.languages_spoken || ["English"],
        years_experience: appData?.teaching_experience_years || 0,
        profile_image_url: appData?.professional_photo_url || "",
        profile_complete: false,
        can_teach: false,
        is_available: false,
        profile_approved_by_admin: false,
      },
      { onConflict: "user_id" }
    );
    if (profileError) console.error("Profile upsert error:", profileError);

    // Step 7: Update application status
    const { error: appUpdateError } = await adminClient
      .from("teacher_applications")
      .update({
        current_stage: "interview_completed",
        status: "accepted",
        user_id: authUserId,
      })
      .eq("id", applicationId);

    if (appUpdateError) {
      console.error("Application update error:", appUpdateError);
      return new Response(JSON.stringify({ error: `Failed to update application: ${appUpdateError.message}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 8: Send branded welcome email via Resend
    const emailHtml = buildWelcomeHtml(fullName, setPasswordUrl);

    const resendResponse = await fetch(`${RESEND_GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${lovableApiKey}`,
        "X-Connection-Api-Key": resendApiKey,
      },
      body: JSON.stringify({
        from: "EnglEuphoria <onboarding@notify.engleuphoria.com>",
        to: [email],
        subject: "Welcome to the EnglEuphoria Family! 🌟",
        html: emailHtml,
      }),
    });

    const resendResult = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend error:", resendResult);
      // Log failure but don't block — account was already created
      await adminClient.from("system_emails").insert({
        email_type: "teacher_welcome",
        recipient_email: email,
        recipient_name: fullName,
        subject: "Welcome to the EnglEuphoria Family! 🌟",
        delivery_status: "failed",
        error_message: JSON.stringify(resendResult),
        related_entity_id: applicationId,
        related_entity_type: "teacher_application",
      });
    } else {
      console.log(`✅ Welcome email sent to ${email} via Resend`);
      await adminClient.from("system_emails").insert({
        email_type: "teacher_welcome",
        recipient_email: email,
        recipient_name: fullName,
        subject: "Welcome to the EnglEuphoria Family! 🌟",
        delivery_status: "sent",
        sent_at: new Date().toISOString(),
        related_entity_id: applicationId,
        related_entity_type: "teacher_application",
        metadata: { resend_id: resendResult.id },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        userId: authUserId,
        message: `Teacher ${fullName} approved. Branded welcome email sent to ${email}.`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
