import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LiveWorkspace } from "@/components/live-workspace";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(
  props: { params: Promise<{ packetId: string }> },
): Promise<Metadata> {
  const { packetId } = await props.params;
  const supabase = await createClient();

  const { data: packet } = (await supabase
    .from("vendor_packets")
    .select("vendor_name, portal_name, owner_name")
    .eq("id", packetId)
    .single()) as { data: { vendor_name: string; portal_name: string | null; owner_name: string } | null };

  if (!packet) {
    return { title: "Packet Not Found | BidPilot Workspace" };
  }

  return {
    title: `${packet.vendor_name} | BidPilot Workspace`,
    description: `${packet.vendor_name} onboarding packet in ${packet.portal_name || "portal"}, owned by ${packet.owner_name}.`,
  };
}

export default async function PacketWorkspacePage(
  props: { params: Promise<{ packetId: string }> },
) {
  const { packetId } = await props.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = (await supabase
    .from("profiles")
    .select("team_id, full_name")
    .eq("id", user.id)
    .single()) as { data: { team_id: string | null; full_name: string | null } | null };

  // Verify this packet belongs to the user's team
  const { data: packet } = (await supabase
    .from("vendor_packets")
    .select("id, team_id")
    .eq("id", packetId)
    .eq("team_id", profile?.team_id || "")
    .single()) as { data: { id: string; team_id: string } | null };

  if (!packet) {
    notFound();
  }

  // Fetch all team packets so the queue sidebar works
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: packets } = (await supabase
    .from("vendor_packets")
    .select(
      `
      *,
      documents(id, file_name, file_size, file_type, status),
      tinyfish_runs(id, tf_run_id, status, safety_mode, created_at),
      audit_entries(id, action, detail, actor_name, created_at)
    `,
    )
    .eq("team_id", profile?.team_id || "")
    .order("created_at", { ascending: false })) as { data: any[] | null };

  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="section-label">packet detail</p>
          <h1 className="mt-4 text-5xl font-medium tracking-[-0.05em] text-white">
            Vendor ops workspace
          </h1>
          <p className="mt-5 text-lg leading-8 text-white/58">
            Real packets, real documents, real audit trail. Everything persists
            across sessions.
          </p>
        </div>

        <LiveWorkspace
          initialPackets={packets || []}
          userName={profile?.full_name || user.email || "User"}
        />
      </div>
    </main>
  );
}
