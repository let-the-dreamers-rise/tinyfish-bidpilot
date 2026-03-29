import { NextResponse } from "next/server";

import { getTinyFishRun } from "@/lib/tinyfish";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/tinyfish/run/[id]">,
) {
  const { id } = await context.params;

  try {
    const run = await getTinyFishRun(id);

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
