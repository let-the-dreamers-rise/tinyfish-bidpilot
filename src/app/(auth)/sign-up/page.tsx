"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // If email confirmation is disabled in Supabase, redirect immediately
    setTimeout(() => {
      router.push("/onboarding");
      router.refresh();
    }, 1000);
  }

  async function handleGitHubSignUp() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=/onboarding`,
      },
    });
  }

  if (success) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-black/25 p-8 text-center backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--success)]/30 bg-[var(--success)]/10">
          <svg className="h-6 w-6 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-medium text-white">Account created!</h1>
        <p className="mt-2 text-sm text-white/50">Redirecting to onboarding...</p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/25 p-8 backdrop-blur-xl">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(245,166,95,0.35)] bg-[rgba(245,166,95,0.08)]">
          <span className="text-lg font-semibold text-[var(--accent)]">BP</span>
        </div>
        <h1 className="text-3xl font-medium tracking-[-0.03em] text-white">
          Start automating
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Create your BidPilot account — free to start
        </p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label
            htmlFor="full-name"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-white/40"
          >
            Full name
          </label>
          <input
            id="full-name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ashwin Goyal"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-[var(--accent)]/50 focus:bg-white/[0.07]"
          />
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-white/40"
          >
            Work email
          </label>
          <input
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-[var(--accent)]/50 focus:bg-white/[0.07]"
          />
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-white/40"
          >
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-[var(--accent)]/50 focus:bg-white/[0.07]"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="halo-button w-full justify-center disabled:opacity-50"
        >
          {loading ? "creating account..." : "create account"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-widest text-white/30">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <button
        type="button"
        onClick={handleGitHubSignUp}
        className="ghost-button w-full justify-center gap-3"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
        continue with github
      </button>

      <p className="mt-6 text-center text-sm text-white/40">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-[var(--accent)] transition-colors hover:text-[var(--accent)]/80"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
