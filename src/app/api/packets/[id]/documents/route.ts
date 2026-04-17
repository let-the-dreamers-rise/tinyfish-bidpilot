import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id: packetId } = await context.params;

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

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Upload to Supabase Storage
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${profile.team_id}/${packetId}/${timestamp}_${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("packet-documents")
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: `Upload failed: ${uploadError.message}` },
      { status: 500 },
    );
  }

  // Create document record in DB
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: document, error: dbError } = (await (supabase
    .from("documents") as any)
    .insert({
      packet_id: packetId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      storage_path: storagePath,
      status: "uploaded",
      uploaded_by: user.id,
    })
    .select()
    .single()) as { data: any; error: any };

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Audit log
  await (supabase.from("audit_entries") as any).insert({
    team_id: profile.team_id,
    packet_id: packetId,
    action: "Document uploaded",
    detail: `${file.name} (${(file.size / 1024).toFixed(1)} KB) uploaded to packet.`,
    actor_id: user.id,
    actor_name: profile.full_name || user.email,
  });

  // Update packet progress
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: docs } = (await supabase
    .from("documents")
    .select("id")
    .eq("packet_id", packetId)) as { data: any[] | null };

  const docCount = docs?.length || 0;
  const progress = Math.min(docCount * 20, 80); // Each doc = 20% up to 80%

  await (supabase
    .from("vendor_packets") as any)
    .update({
      progress,
      status: progress >= 60 ? "ready" : "draft",
      updated_at: new Date().toISOString(),
    })
    .eq("id", packetId);

  return NextResponse.json({ document }, { status: 201 });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id: packetId } = await context.params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: documents, error } = await supabase
    .from("documents")
    .select("*")
    .eq("packet_id", packetId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ documents: documents || [] });
}
