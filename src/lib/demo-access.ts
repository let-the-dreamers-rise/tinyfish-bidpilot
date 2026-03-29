import "server-only";

const DEMO_CODE_HEADER = "x-bidpilot-demo-code";

export const BIDPILOT_DEMO_CODE_ERROR =
  "Live TinyFish runs are protected. Enter the BidPilot demo access code to continue.";

function getConfiguredDemoCode() {
  const demoCode = process.env.BIDPILOT_DEMO_CODE?.trim();

  return demoCode ? demoCode : null;
}

export function requiresBidPilotDemoCode() {
  return getConfiguredDemoCode() !== null;
}

export function requestHasValidBidPilotDemoCode(request: Request) {
  const configuredDemoCode = getConfiguredDemoCode();

  if (!configuredDemoCode) {
    return true;
  }

  return request.headers.get(DEMO_CODE_HEADER) === configuredDemoCode;
}
