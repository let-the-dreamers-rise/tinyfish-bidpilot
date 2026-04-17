import { NextRequest, NextResponse } from "next/server";

import { hasTinyFishApiKey, createBrowserSession } from "@/lib/tinyfish";

export async function POST(req: NextRequest) {
  if (!hasTinyFishApiKey()) {
    return NextResponse.json(
      { error: "TinyFish API key not configured." },
      { status: 503 },
    );
  }

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  if (!body.url || typeof body.url !== "string") {
    return NextResponse.json(
      { error: "Missing required field: url" },
      { status: 400 },
    );
  }

  try {
    const session = await createBrowserSession(body.url);
    // Return session_id and base_url but NOT cdp_url (security — keep WebSocket URL server-side)
    return NextResponse.json({
      session_id: session.session_id,
      base_url: session.base_url,
      status: "active",
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Browser session creation failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
