import { NextRequest, NextResponse } from "next/server";

import { hasTinyFishApiKey, searchWeb } from "@/lib/tinyfish";

export async function GET(req: NextRequest) {
  if (!hasTinyFishApiKey()) {
    return NextResponse.json(
      { error: "TinyFish API key not configured." },
      { status: 503 },
    );
  }

  const query = req.nextUrl.searchParams.get("query");
  if (!query) {
    return NextResponse.json(
      { error: "Missing required parameter: query" },
      { status: 400 },
    );
  }

  const location = req.nextUrl.searchParams.get("location") ?? undefined;
  const language = req.nextUrl.searchParams.get("language") ?? undefined;

  try {
    const data = await searchWeb(query, { location, language });
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Search failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
