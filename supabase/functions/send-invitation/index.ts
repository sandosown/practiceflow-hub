import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create client with caller's JWT to verify identity
    const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
    } = await supabaseUser.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { first_name, last_name, email, role, intern_subtype, clinician_subtype, hat_id } = body;

    if (!first_name || !last_name || !email || !role) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service role client for DB operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Check caller's role for access control
    const { data: callerProfile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    const callerRole = callerProfile?.role;

    if (!callerRole || !["OWNER", "ADMIN"].includes(callerRole)) {
      return new Response(JSON.stringify({ error: "Only Owner and Admin can send invitations" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin cannot invite PARTNER or OWNER
    if (callerRole === "ADMIN" && (role === "PARTNER" || role === "OWNER")) {
      return new Response(
        JSON.stringify({ error: "Admin cannot invite Partner or Owner roles" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate unique token
    const token = crypto.randomUUID();

    // Insert invitation
    const { data: invitation, error: insertError } = await supabaseAdmin
      .from("invitations")
      .insert({
        hat_id: hat_id || "w1",
        invited_by: user.id,
        first_name,
        last_name,
        email,
        role,
        intern_subtype: role === "INTERN" ? intern_subtype : null,
        clinician_subtype: role === "CLINICIAN" ? clinician_subtype : null,
        token,
        status: "PENDING",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // In production, send email here. For now, return the token for the invitation link.
    return new Response(
      JSON.stringify({
        success: true,
        invitation_id: invitation.invitation_id,
        token,
        message: `Invitation sent to ${email}`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
