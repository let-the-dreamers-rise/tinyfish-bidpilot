import { NextResponse } from "next/server";

import {
  BIDPILOT_DEMO_CODE_ERROR,
  requestHasValidBidPilotDemoCode,
} from "@/lib/demo-access";
import { createClient } from "@/lib/supabase/server";
import { getTinyFishRun } from "@/lib/tinyfish";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!requestHasValidBidPilotDemoCode(request)) {
    return NextResponse.json(
      { error: BIDPILOT_DEMO_CODE_ERROR },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  try {
    const run = await getTinyFishRun(id);

    // Persist status updates to database if authenticated
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const isTerminal = ["COMPLETED", "FAILED", "CANCELLED"].includes(
        run.status,
      );

      const { data: profile } = (await supabase
        .from("profiles")
        .select("team_id, full_name")
        .eq("id", user.id)
        .single()) as { data: { team_id: string; full_name: string | null } | null };

      // Update the run record
      await (supabase
        .from("tinyfish_runs") as any)
        .update({
          status: run.status.toLowerCase(),
          steps: (run.steps as unknown[]) || [],
          result: (run.result as Record<string, unknown>) || {},
          error_message: run.error?.message || null,
          ...(isTerminal
            ? { finished_at: run.finished_at || new Date().toISOString() }
            : {}),
        })
        .eq("tf_run_id", id);

      // If completed, update portal intelligence
      if (
        run.status === "COMPLETED" &&
        profile?.team_id &&
        run.result
      ) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const runUrlData = (await supabase
            .from("tinyfish_runs")
            .select("url")
            .eq("tf_run_id", id)
            .single()) as { data: { url: string } | null };

          const url = new URL(runUrlData.data?.url || "");
          const domain = url.hostname;

          // Upsert portal intelligence
          await (supabase.from("portal_intelligence") as any).upsert(
            {
              portal_domain: domain,
              portal_name: domain
                .replace("www.", "")
                .split(".")[0]
                .replace(/^\w/, (c: string) => c.toUpperCase()),
              runs_completed: 1,
              last_run_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "portal_domain" },
          );

          // Increment runs_completed
          const { data: existing } = (await supabase
            .from("portal_intelligence")
            .select("runs_completed")
            .eq("portal_domain", domain)
            .single()) as { data: { runs_completed: number } | null };

          if (existing) {
            await (supabase
              .from("portal_intelligence") as any)
              .update({
                runs_completed: (existing.runs_completed || 0) + 1,
                last_run_at: new Date().toISOString(),
              })
              .eq("portal_domain", domain);
          }

          // Audit the completion
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: runRecord } = (await supabase
            .from("tinyfish_runs")
            .select("id, packet_id")
            .eq("tf_run_id", id)
            .single()) as { data: { id: string; packet_id: string | null } | null };

          if (runRecord) {
            await (supabase.from("audit_entries") as any).insert({
              team_id: profile.team_id,
              packet_id: runRecord.packet_id,
              run_id: runRecord.id,
              action: `Run ${run.status.toLowerCase()}`,
              detail: `TinyFish run ${id} ${run.status.toLowerCase()} with ${run.num_of_steps || 0} steps.`,
              actor_id: user.id,
              actor_name: profile.full_name || user.email,
            });

            // Update packet status on completion
            if (runRecord.packet_id && isTerminal) {
              const newStatus = run.status === "COMPLETED" ? "review" : "blocked";
              await (supabase
                .from("vendor_packets") as any)
                .update({
                  status: newStatus,
                  progress: run.status === "COMPLETED" ? 90 : undefined,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", runRecord.packet_id);
            }
          }
        } catch {
          // Non-critical — don't fail the response
        }
      }
    }

    return NextResponse.json(run);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to fetch the TinyFish run.",
      },
      { status: 503 },
    );
  }
}
