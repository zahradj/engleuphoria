
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const { planId, paymentType } = await req.json();
    if (!planId) throw new Error("Plan ID is required");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Authorization required");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user?.email) {
      throw new Error("User authentication failed");
    }

    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get payment plan details
    const { data: plan, error: planError } = await supabaseClient
      .from('payment_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) throw new Error("Payment plan not found");
    logStep("Payment plan found", { planName: plan.name, price: plan.price });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check for existing Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
      logStep("New customer created", { customerId });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    // Create checkout session based on payment type
    const sessionConfig: any = {
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: plan.currency.toLowerCase(),
            product_data: { 
              name: plan.name,
              description: `${plan.name} - English Learning Platform`
            },
            unit_amount: Math.round(plan.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-canceled`,
      metadata: {
        user_id: user.id,
        plan_id: planId,
      }
    };

    if (plan.type === 'subscription' && plan.interval) {
      sessionConfig.mode = 'subscription';
      sessionConfig.line_items[0].price_data.recurring = { interval: plan.interval };
    } else {
      sessionConfig.mode = 'payment';
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    // Create pending payment record
    const { error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        student_id: user.id,
        amount: plan.price,
        currency: plan.currency,
        status: 'pending',
        payment_method: 'stripe',
        payment_gateway: 'stripe',
        gateway_transaction_id: session.id,
        plan_id: planId,
        metadata: { checkout_session_id: session.id }
      });

    if (paymentError) {
      logStep("Error creating payment record", { error: paymentError });
    } else {
      logStep("Payment record created");
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
