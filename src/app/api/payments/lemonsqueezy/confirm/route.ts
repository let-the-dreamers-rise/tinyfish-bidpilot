import { NextResponse, type NextRequest } from "next/server";

/* -------------------------------------------------------------------------- */
/*  Client-side confirmation endpoint                                         */
/*  Called by the checkout overlay on success. This is a backup to the         */
/*  webhook — the webhook is the primary source of truth.                     */
/* -------------------------------------------------------------------------- */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    /* Log the event for debugging */
    console.log("[LemonSqueezy Confirm]", JSON.stringify(body).slice(0, 500));

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: true });
  }
}
