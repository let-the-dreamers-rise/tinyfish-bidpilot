import { NextResponse } from "next/server";

import {
  BIDPILOT_DEMO_CODE_ERROR,
  requestHasValidBidPilotDemoCode,
} from "@/lib/demo-access";
import { getTinyFishRun } from "@/lib/tinyfish";

export async function GET(
  request: Request,
  context: RouteContext<"/api/tinyfish/run/[id]">,
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
