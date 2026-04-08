import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate auth
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

    // Check caller is admin
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

    // Step 1: Check if user already exists in auth
    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    let authUserId: string;

    if (existingUser) {
      authUserId = existingUser.id;
      console.log(`User already exists in auth: ${authUserId}`);
    } else {
      // Step 2: Invite user by email (creates auth account + sends invite email)
      const siteUrl = Deno.env.get("SITE_URL") || "https://engleuphoria.lovable.app";
      const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
        email,
        {
          data: { full_name: fullName, role: "teacher" },
          redirectTo: `${siteUrl}/set-password`,
        }
      );

      if (inviteError) {
        console.error("Invite error:", inviteError);
        return new Response(JSON.stringify({ error: `Failed to create auth account: ${inviteError.message}` }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      authUserId = inviteData.user.id;
      console.log(`Created auth user via invite: ${authUserId}`);
    }

    // Step 3: Upsert into public.users
    const { error: usersError } = await adminClient.from("users").upsert(
      {
        id: authUserId,
        email,
        full_name: fullName,
        role: "teacher",
        status: "active",
      },
      { onConflict: "id" }
    );
    if (usersError) {
      console.error("Users upsert error:", usersError);
    }

    // Step 4: Insert user_roles (ignore conflict)
    const { error: roleInsertError } = await adminClient.from("user_roles").upsert(
      {
        user_id: authUserId,
        role: "teacher",
      },
      { onConflict: "user_id,role" }
    );
    if (roleInsertError) {
      console.error("Role insert error:", roleInsertError);
    }

    // Step 5: Fetch application data to populate teacher profile
    const { data: appData } = await adminClient
      .from("teacher_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    // Step 6: Create/update teacher_profiles with visibility flags
    const { error: profileError } = await adminClient.from("teacher_profiles").upsert(
      {
        user_id: authUserId,
        bio: appData?.bio || "",
        video_url: appData?.video_url || "",
        specializations: appData?.preferred_age_groups || [],
        languages_spoken: appData?.languages_spoken || ["English"],
        years_experience: appData?.teaching_experience_years || 0,
        profile_image_url: appData?.professional_photo_url || "",
        profile_complete: true,
        can_teach: true,
        profile_approved_by_admin: true,
      },
      { onConflict: "user_id" }
    );
    if (profileError) {
      console.error("Profile upsert error:", profileError);
    }

    // Step 7: Update teacher_applications status
    const { error: appUpdateError } = await adminClient
      .from("teacher_applications")
      .update({
        current_stage: "approved",
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

    return new Response(
      JSON.stringify({
        success: true,
        userId: authUserId,
        message: `Teacher ${fullName} approved. Invite email sent to ${email}.`,
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
