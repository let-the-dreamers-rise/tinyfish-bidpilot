import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = (await supabase
    .from("profiles")
    .select("team_id")
    .eq("id", user.id)
    .single()) as { data: { team_id: string } | null };

  if (!profile?.team_id) {
    return NextResponse.json({ error: "No team found" }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: packets, error } = (await supabase
    .from("vendor_packets")
    .select(
      `
      *,
      documents(id, file_name, file_size, file_type, status),
      tinyfish_runs(id, tf_run_id, status, safety_mode, created_at),
      audit_entries(id, action, detail, actor_name, created_at)
    `,
    )
    .eq("team_id", profile.team_id)
    .order("created_at", { ascending: false })) as { data: any[] | null; error: any };

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Compute real metrics
  const totalPackets = packets?.length || 0;
  const awaitingApproval =
    packets?.filter((p: any) => p.status === "review").length || 0;
  const totalRuns =
    packets?.reduce((acc: number, p: any) => acc + (p.tinyfish_runs?.length || 0), 0) || 0;

  return NextResponse.json({
    packets: packets || [],
    metrics: {
      openPackets: totalPackets,
      awaitingApproval,
      totalRuns,
      pattern: "Packet → run → review",
    },
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = (await supabase
    .from("profiles")
    .select("team_id, full_name")
    .eq("id", user.id)
    .single()) as { data: { team_id: string; full_name: string | null } | null };

  if (!profile?.team_id) {
    return NextResponse.json({ error: "No team found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.vendor_name || !body?.portal_url || !body?.owner_name) {
    return NextResponse.json(
      { error: "vendor_name, portal_url, and owner_name are required." },
      { status: 400 },
    );
  }

  const { data: packet, error } = (await (supabase
    .from("vendor_packets") as any)
    .insert({
      team_id: profile.team_id,
      vendor_name: body.vendor_name,
      portal_url: body.portal_url,
      portal_name: body.portal_name || null,
      owner_name: body.owner_name,
      due_date: body.due_date || null,
      summary: body.summary || null,
      field_mappings: body.field_mappings || [],
      checklist: body.checklist || [],
      created_by: user.id,
    })
    .select()
    .single()) as { data: any; error: any };

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create audit entry
  await (supabase.from("audit_entries") as any).insert({
    team_id: profile.team_id,
    packet_id: packet.id,
    action: "Packet created",
    detail: `${body.vendor_name} onboarding packet created for ${body.portal_name || body.portal_url}.`,
    actor_id: user.id,
    actor_name: profile.full_name || user.email,
  });

  return NextResponse.json({ packet }, { status: 201 });
}
