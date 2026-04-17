import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/workspace";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${redirect}`);
    }
    
    // Pass the actual error message back to the sign-in page so we can debug it
    const errorMessage = error?.message ? encodeURIComponent(error.message) : "auth_callback_failed";
    return NextResponse.redirect(`${origin}/sign-in?error=${errorMessage}`);
  }

  return NextResponse.redirect(`${origin}/sign-in?error=no_code_provided`);
}
