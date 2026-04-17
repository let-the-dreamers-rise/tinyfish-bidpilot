import { NextResponse } from "next/server";

import {
  BIDPILOT_DEMO_CODE_ERROR,
  requestHasValidBidPilotDemoCode,
} from "@/lib/demo-access";
import { createClient } from "@/lib/supabase/server";
import {
  launchTinyFishRun,
  type BrowserProfile,
  type TinyFishLaunchInput,
} from "@/lib/tinyfish";

type SafetyMode = "read-only" | "draft-save";

type TinyFishLaunchRequest = Partial<TinyFishLaunchInput> & {
  safetyMode?: SafetyMode;
  packetId?: string;
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
  if (!requestHasValidBidPilotDemoCode(request)) {
    return NextResponse.json(
      { error: BIDPILOT_DEMO_CODE_ERROR },
      { status: 401 },
    );
  }

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

    // Persist run to database if user is authenticated
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: runRecord } = (await (supabase
          .from("tinyfish_runs") as any)
          .insert({
            team_id: profile.team_id,
            packet_id: body.packetId || null,
            tf_run_id: response.run_id,
            goal: body.goal,
            url: body.url,
            safety_mode: safetyMode,
            browser_profile: browserProfile,
            status: "pending",
            started_by: user.id,
          })
          .select()
          .single()) as { data: any };

        // Audit log
        await (supabase.from("audit_entries") as any).insert({
          team_id: profile.team_id,
          packet_id: body.packetId || null,
          run_id: runRecord?.id || null,
          action: "TinyFish run launched",
          detail: `${safetyMode} run started targeting ${body.url}`,
          actor_id: user.id,
          actor_name: profile.full_name || user.email,
        });

        // Update packet status if linked
        if (body.packetId) {
          await (supabase
            .from("vendor_packets") as any)
            .update({
              status: "running",
              updated_at: new Date().toISOString(),
            })
            .eq("id", body.packetId);
        }
      }
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
