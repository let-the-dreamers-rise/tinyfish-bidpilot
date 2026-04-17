import crypto from "crypto";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/payments/razorpay/verify
 *
 * Verifies the Razorpay payment signature and upgrades the team plan.
 */
export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return NextResponse.json(
      { error: "Payment gateway is not configured." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);

  const orderId = body?.razorpay_order_id as string | undefined;
  const paymentId = body?.razorpay_payment_id as string | undefined;
  const signature = body?.razorpay_signature as string | undefined;
  const plan = body?.plan as string | undefined;

  if (!orderId || !paymentId || !signature || !plan) {
    return NextResponse.json(
      { error: "Missing payment verification fields." },
      { status: 400 },
    );
  }

  // Verify signature: HMAC SHA256 of "orderId|paymentId" with key_secret
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json(
      { error: "Payment signature verification failed." },
      { status: 400 },
    );
  }

  // Upgrade team plan in Supabase
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = (await supabase
        .from("profiles")
        .select("team_id, full_name")
        .eq("id", user.id)
        .single()) as { data: { team_id: string; full_name: string | null } | null };

      if (profile?.team_id) {
        // Upgrade the team's plan
        await (supabase.from("teams") as any).update({
          plan,
          updated_at: new Date().toISOString(),
        }).eq("id", profile.team_id);

        // Audit log
        await (supabase.from("audit_entries") as any).insert({
          team_id: profile.team_id,
          action: "Plan upgraded",
          detail: `Upgraded to ${plan} plan. Payment: ${paymentId}`,
          actor_id: user.id,
          actor_name: profile.full_name || user.email,
        });
      }
    }

    return NextResponse.json({
      verified: true,
      paymentId,
      plan,
    });
  } catch (error) {
    console.error("[Razorpay] Verification post-processing failed:", error);
    return NextResponse.json(
      { error: "Payment verified but post-processing failed." },
      { status: 500 },
    );
  }
}
