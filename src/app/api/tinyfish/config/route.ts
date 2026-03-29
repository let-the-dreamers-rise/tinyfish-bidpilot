import { NextResponse } from "next/server";

import { requiresBidPilotDemoCode } from "@/lib/demo-access";
import { hasTinyFishApiKey } from "@/lib/tinyfish";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    enabled: hasTinyFishApiKey(),
    defaultBrowserProfile: "stealth",
    defaultProxyCountryCode: "US",
    defaultSafetyMode: "read-only",
    requiresDemoCode: requiresBidPilotDemoCode(),
  });
}
