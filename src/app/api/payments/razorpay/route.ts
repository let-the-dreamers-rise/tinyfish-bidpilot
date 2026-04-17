import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const PLAN_AMOUNTS: Record<string, { amount: number; currency: string; name: string }> = {
  pro: {
    amount: 649900, // ₹6,499 in paise (≈ $79)
    currency: "INR",
    name: "BidPilot Pro — Monthly",
  },
  enterprise: {
    amount: 2499900, // ₹24,999 in paise — placeholder for custom
    currency: "INR",
    name: "BidPilot Enterprise — Monthly",
  },
};

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Payment gateway is not configured." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const planId = body?.plan as string | undefined;

  if (!planId || !PLAN_AMOUNTS[planId]) {
    return NextResponse.json(
      { error: "Invalid plan. Must be 'pro' or 'enterprise'." },
      { status: 400 },
    );
  }

  const plan = PLAN_AMOUNTS[planId];

  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: plan.currency,
      receipt: `bidpilot_${planId}_${Date.now()}`,
      notes: {
        plan: planId,
        product: "BidPilot",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planName: plan.name,
      keyId,
    });
  } catch (error) {
    console.error("[Razorpay] Order creation failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create payment order.",
      },
      { status: 500 },
    );
  }
}
