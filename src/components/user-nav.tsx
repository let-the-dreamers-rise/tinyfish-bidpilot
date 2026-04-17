"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

export function UserNav({ collapsed = false }: { collapsed?: boolean }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data);
      }
    }

    loadProfile();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!profile) {
    return (
      <div className={`animate-pulse rounded-full bg-white/10 ${collapsed ? "mx-auto h-9 w-9" : "h-9 w-full"}`} />
    );
  }

  const initials =
    profile.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "BP";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2.5 rounded-xl transition-colors hover:bg-white/5 ${
          collapsed ? "justify-center p-2" : "w-full px-3 py-2"
        }`}
      >
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name || ""}
            className="h-7 w-7 flex-shrink-0 rounded-full"
          />
        ) : (
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[10px] font-semibold text-[var(--accent)]">
            {initials}
          </span>
        )}
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-xs text-white/70">{profile.full_name || profile.email}</p>
              <p className="truncate text-[10px] text-white/30">{profile.email}</p>
            </div>
            <svg
              className={`h-3.5 w-3.5 flex-shrink-0 text-white/30 transition-transform ${open ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {open && (
        <div className={`absolute z-50 w-56 rounded-xl border border-white/10 bg-[#0d1117] p-1.5 shadow-2xl backdrop-blur-xl ${
          collapsed ? "bottom-0 left-full ml-2" : "bottom-full left-0 mb-2"
        }`}>
          <div className="border-b border-white/10 px-3 py-2.5">
            <p className="text-sm font-medium text-white">{profile.full_name}</p>
            <p className="text-xs text-white/40">{profile.email}</p>
          </div>

          <div className="mt-1 space-y-0.5">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <span className="text-xs">📋</span> Dashboard
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <span className="text-xs">⚙️</span> Settings
            </Link>
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <span className="text-xs">💎</span> Plans
            </Link>
          </div>

          <div className="mt-1 border-t border-white/10 pt-1">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400/70 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <span className="text-xs">🚪</span> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
