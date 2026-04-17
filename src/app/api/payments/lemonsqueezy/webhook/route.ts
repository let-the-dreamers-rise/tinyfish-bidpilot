import { createHmac } from "crypto";
import { NextResponse, type NextRequest } from "next/server";

/* -------------------------------------------------------------------------- */
/*  Lemon Squeezy Webhook Handler                                             */
/*  Verifies signature, then upgrades the user's plan in Supabase.            */
/* -------------------------------------------------------------------------- */

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature");
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    /* Verify signature if we have a secret configured */
    if (secret && signature) {
      const hmac = createHmac("sha256", secret);
      hmac.update(rawBody);
      const digest = hmac.digest("hex");

      if (digest !== signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload?.meta?.event_name;

    /* Only process successful subscription/order events */
    if (
      eventName !== "order_created" &&
      eventName !== "subscription_created" &&
      eventName !== "subscription_payment_success"
    ) {
      return NextResponse.json({ received: true });
    }

    /* Extract customer email from the payload */
    const customerEmail =
      payload?.data?.attributes?.user_email ||
      payload?.data?.attributes?.customer_email ||
      payload?.meta?.custom_data?.email;

    if (!customerEmail) {
      console.warn("[LemonSqueezy] No customer email in webhook payload");
      return NextResponse.json({ received: true });
    }

    /* Upgrade the user's team plan in Supabase */
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      /* Find the user's profile by email */
      const { data: profile } = await supabase
        .from("profiles")
        .select("team_id")
        .eq("email", customerEmail)
        .single();

      if (profile?.team_id) {
        /* Upgrade team to pro */
        await supabase
          .from("teams")
          .update({ plan: "pro" })
          .eq("id", profile.team_id);

        /* Audit log */
        await supabase.from("audit_entries").insert({
          team_id: profile.team_id,
          action: "plan_upgraded",
          detail: `Plan upgraded to Pro via Lemon Squeezy (event: ${eventName})`,
          actor_name: "system:lemonsqueezy",
        });
      }
    }

    return NextResponse.json({ received: true, upgraded: true });
  } catch (error) {
    console.error("[LemonSqueezy Webhook Error]", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
