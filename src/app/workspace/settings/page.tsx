"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Profile, Team } from "@/lib/supabase/types";

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: prof } = (await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()) as { data: Profile | null };

      if (prof) {
        setProfile(prof);

        if (prof.team_id) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: t } = (await supabase
            .from("teams")
            .select("*")
            .eq("id", prof.team_id)
            .single()) as { data: Team | null };
          if (t) {
            setTeam(t);
            setTeamName(t.name);
          }
        }
      }
    }

    load();
  }, []);

  async function handleSaveTeam() {
    if (!team) return;
    setSaving(true);

    const supabase = createClient();
    await (supabase
      .from("teams") as any)
      .update({ name: teamName })
      .eq("id", team.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!profile) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[var(--accent)]" />
      </main>
    );
  }

  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <p className="section-label">settings</p>
        <h1 className="mt-4 text-4xl font-medium tracking-[-0.04em] text-white">
          Workspace settings
        </h1>

        <div className="mt-10 space-y-8">
          {/* Profile */}
          <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/60">
              Profile
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-white/40">Name</p>
                <p className="mt-1 text-sm text-white">{profile.full_name || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-white/40">Email</p>
                <p className="mt-1 text-sm text-white">{profile.email}</p>
              </div>
              <div>
                <p className="text-xs text-white/40">Role</p>
                <p className="mt-1 text-sm capitalize text-white">
                  {profile.role}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40">Onboarded</p>
                <p className="mt-1 text-sm text-white">
                  {profile.onboarded ? "✓ Yes" : "Not yet"}
                </p>
              </div>
            </div>
          </section>

          {/* Team */}
          <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/60">
              Team
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="team-name"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-white/40"
                >
                  Team name
                </label>
                <div className="flex gap-3">
                  <input
                    id="team-name"
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--accent)]/50"
                  />
                  <button
                    type="button"
                    onClick={handleSaveTeam}
                    disabled={saving}
                    className="ghost-button disabled:opacity-50"
                  >
                    {saved ? "✓ saved" : saving ? "saving..." : "save"}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-white/40">Plan</p>
                <p className="mt-1 text-sm capitalize text-white">
                  {team?.plan || "starter"}{" "}
                  <a
                    href="/pricing"
                    className="text-[var(--accent)] hover:underline"
                  >
                    (upgrade)
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* API & Integrations */}
          <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/60">
              API & Integrations
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-white/40">TinyFish API</p>
                <p className="mt-1 text-sm text-white/60">
                  Configured via environment variable. Contact your admin to
                  update.
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40">Supabase project</p>
                <p className="mt-1 signal-face text-xs text-white/40">
                  Connected — real-time data persistence active
                </p>
              </div>
            </div>
          </section>

          {/* Portals */}
          {profile.portals_used && profile.portals_used.length > 0 && (
            <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/60">
                Configured portals
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.portals_used.map((portal) => (
                  <span
                    key={portal}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs capitalize text-white/70"
                  >
                    {portal}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
