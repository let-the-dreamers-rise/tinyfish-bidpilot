import { NextResponse } from "next/server";

import {
  launchTinyFishRun,
  type BrowserProfile,
  type TinyFishLaunchInput,
} from "@/lib/tinyfish";

type SafetyMode = "read-only" | "draft-save";

type TinyFishLaunchRequest = Partial<TinyFishLaunchInput> & {
  safetyMode?: SafetyMode;
};

const isBrowserProfile = (value: string): value is BrowserProfile =>
  value === "lite" || value === "stealth";

const isSafetyMode = (value: string): value is SafetyMode =>
  value === "read-only" || value === "draft-save";

function withSafetyGuardrails(goal: string, safetyMode: SafetyMode) {
  if (safetyMode === "draft-save") {
    return `${goal}\n\nHard boundary: You may log in, navigate authenticated pages, fill fields, and upload supporting documents if needed. Never click any final irreversible submit, confirm, activate, pay, or send action. Stop on the last review or draft-saved screen and return an approval-ready summary with any remaining human decisions.`;
  }

  return `${goal}\n\nHard boundary: Stay read-only. Do not log in, upload files, submit forms, modify records, or change portal state. Stop after collecting the requested information and return a structured summary.`;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | TinyFishLaunchRequest
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
  const safetyMode: SafetyMode =
    body.safetyMode && isSafetyMode(body.safetyMode)
      ? body.safetyMode
      : "read-only";

  try {
    const response = await launchTinyFishRun({
      url: body.url,
      goal: withSafetyGuardrails(body.goal, safetyMode),
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
