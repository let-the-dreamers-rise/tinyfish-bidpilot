import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await context.params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: packet, error } = (await supabase
    .from("vendor_packets")
    .select(
      `
      *,
      documents(id, file_name, file_size, file_type, status, storage_path, created_at),
      tinyfish_runs(id, tf_run_id, goal, url, safety_mode, browser_profile, status, steps, result, error_message, created_at, finished_at),
      audit_entries(id, action, detail, actor_name, created_at)
    `,
    )
    .eq("id", id)
    .single()) as { data: any; error: any };

  if (error || !packet) {
    return NextResponse.json(
      { error: "Packet not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ packet });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await context.params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { data: profile } = (await supabase
    .from("profiles")
    .select("team_id, full_name")
    .eq("id", user.id)
    .single()) as { data: { team_id: string; full_name: string | null } | null };

  // Build update fields (only allow safe fields)
  const allowedFields = [
    "vendor_name",
    "portal_url",
    "portal_name",
    "owner_name",
    "status",
    "progress",
    "due_date",
    "summary",
    "field_mappings",
    "checklist",
  ];
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: packet, error } = (await (supabase
    .from("vendor_packets") as any)
    .update(updateData)
    .eq("id", id)
    .select()
    .single()) as { data: any; error: any };

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Audit the update
  if (profile?.team_id) {
    const changes = Object.keys(updateData)
      .filter((k) => k !== "updated_at")
      .join(", ");
    await (supabase.from("audit_entries") as any).insert({
      team_id: profile.team_id,
      packet_id: id,
      action: "Packet updated",
      detail: `Fields updated: ${changes}`,
      actor_id: user.id,
      actor_name: profile.full_name || user.email,
    });
  }

  return NextResponse.json({ packet });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await context.params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("vendor_packets")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}
