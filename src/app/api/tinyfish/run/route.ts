import { NextResponse } from "next/server";

import {
  launchTinyFishRun,
  type BrowserProfile,
  type TinyFishLaunchInput,
} from "@/lib/tinyfish";

const isBrowserProfile = (value: string): value is BrowserProfile =>
  value === "lite" || value === "stealth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | Partial<TinyFishLaunchInput>
    | null;

  if (!body?.url || !body?.goal) {
    return NextResponse.json(
      { error: "Both url and goal are required." },
      { status: 400 },
    );
  }

  if (!body.browserProfile || !isBrowserProfile(body.browserProfile)) {
    return NextResponse.json(
      { error: "browserProfile must be either 'lite' or 'stealth'." },
      { status: 400 },
    );
  }

  const browserProfile: BrowserProfile = body.browserProfile;

  try {
    const response = await launchTinyFishRun({
      url: body.url,
      goal: body.goal,
      browserProfile,
      useVault: Boolean(body.useVault),
      proxyEnabled: Boolean(body.proxyEnabled),
      proxyCountryCode: body.proxyCountryCode,
      credentialItemIds: body.credentialItemIds,
    });

    if (!response.run_id) {
      return NextResponse.json(
        { error: "TinyFish did not return a run_id." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      runId: response.run_id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to start the TinyFish run.",
      },
      { status: 503 },
    );
  }
}
