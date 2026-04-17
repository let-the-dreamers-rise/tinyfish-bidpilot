import { NextRequest, NextResponse } from "next/server";

import { hasTinyFishApiKey, fetchUrls, type FetchFormat } from "@/lib/tinyfish";

export async function POST(req: NextRequest) {
  if (!hasTinyFishApiKey()) {
    return NextResponse.json(
      { error: "TinyFish API key not configured." },
      { status: 503 },
    );
  }

  let body: { urls?: string[]; format?: FetchFormat };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  if (!body.urls || !Array.isArray(body.urls) || body.urls.length === 0) {
    return NextResponse.json(
      { error: "Missing required field: urls (array of strings)" },
      { status: 400 },
    );
  }

  // Cap to 5 URLs per request for safety
  const urls = body.urls.slice(0, 5);
  const format = body.format ?? "markdown";

  try {
    const data = await fetchUrls(urls, format);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Fetch failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
