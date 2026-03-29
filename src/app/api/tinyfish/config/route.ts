import { NextResponse } from "next/server";

import { hasTinyFishApiKey } from "@/lib/tinyfish";

export async function GET() {
  return NextResponse.json({
    enabled: hasTinyFishApiKey(),
    defaultBrowserProfile: "stealth",
    defaultProxyCountryCode: "US",
    defaultSafetyMode: "read-only",
  });
}
