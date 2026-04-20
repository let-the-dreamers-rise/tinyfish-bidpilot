"use client";

import Link from "next/link";
import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

type PortalTab = "profile" | "documents" | "review";

type ActivityEntry = {
  id: number;
  label: string;
  detail: string;
};

const starterActivity: ActivityEntry[] = [
  {
    id: 1,
    label: "Workspace opened",
    detail: "Vendor profile created in draft mode with final submission locked.",
  },
  {
    id: 2,
    label: "Review boundary active",
    detail: "Any publish or submit action requires manual approval.",
  },
];

const sampleCapabilityStatement = "capability-statement.pdf";
const reviewSharePath = "/portal-demo?state=draft-saved&doc=capability-statement.pdf";

function updateDemoUrl(nextUrl: string) {
  window.history.replaceState(null, "", nextUrl);
}

function getInitialPortalState() {
  if (typeof window === "undefined") {
    return {
      isSignedIn: false,
      activeTab: "profile" as PortalTab,
      documents: [] as string[],
      lastSavedAt: null as string | null,
      restoredActivity: [] as ActivityEntry[],
    };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const state = searchParams.get("state");
  const documentParam = searchParams.get("doc");
  const restoredDocuments = documentParam ? [documentParam] : [];

  if (!state) {
    return {
      isSignedIn: false,
      activeTab: "profile" as PortalTab,
      documents: restoredDocuments,
      lastSavedAt: null as string | null,
      restoredActivity: [] as ActivityEntry[],
    };
  }

  if (state === "workspace") {
    return {
      isSignedIn: true,
      activeTab: "profile" as PortalTab,
      documents: restoredDocuments,
      lastSavedAt: null as string | null,
      restoredActivity: [] as ActivityEntry[],
    };
  }

  if (state === "documents") {
    return {
      isSignedIn: true,
      activeTab: "documents" as PortalTab,
      documents: restoredDocuments,
      lastSavedAt: null as string | null,
      restoredActivity: [] as ActivityEntry[],
    };
  }

  return {
    isSignedIn: true,
    activeTab: "review" as PortalTab,
    documents: restoredDocuments,
    lastSavedAt: "Draft state restored from shareable review URL",
    restoredActivity: [
      {
        id: 3,
        label: "Shareable review opened",
        detail:
          "Draft-saved state restored from the public review URL for demo playback.",
      },
    ],
  };
}

const tabs: { id: PortalTab; label: string }[] = [
  { id: "profile", label: "Company profile" },
  { id: "documents", label: "Documents" },
  { id: "review", label: "Review" },
];

export function VendorPortalDemo() {
  const initialPortalState = getInitialPortalState();
  const [isSignedIn, setIsSignedIn] = useState(initialPortalState.isSignedIn);
  const [activeTab, setActiveTab] = useState<PortalTab>(initialPortalState.activeTab);
  const [email, setEmail] = useState("ashgoyal1990@gmail.com");
  const [password, setPassword] = useState("");
  const [companyLegalName, setCompanyLegalName] = useState("Ashwin Goyal");
  const [displayName, setDisplayName] = useState("BidPilot");
  const [businessSummary, setBusinessSummary] = useState(
    "Independent software developer building approval-gated browser automation for supplier onboarding and proposal operations.",
  );
  const [website, setWebsite] = useState("https://tinyfish-bidpilot.vercel.app");
  const [primaryContact, setPrimaryContact] = useState("Ashwin Goyal");
  const [location, setLocation] = useState("Navi Mumbai, Maharashtra, India");
  const [documents, setDocuments] = useState<string[]>(initialPortalState.documents);
  const [activity, setActivity] = useState<ActivityEntry[]>([
    ...starterActivity,
    ...initialPortalState.restoredActivity,
  ]);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(
    initialPortalState.lastSavedAt,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSignedIn(true);
    updateDemoUrl("/portal-demo?state=workspace");
    setActivity((current) => [
      ...current,
      {
        id: Date.now(),
        label: "Portal sign-in complete",
        detail: `Authenticated workspace opened for ${email}.`,
      },
    ]);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []).map((file) => file.name);

    if (!nextFiles.length) {
      return;
    }

    setDocuments((current) => {
      const merged = [...current];

      for (const fileName of nextFiles) {
        if (!merged.includes(fileName)) {
          merged.push(fileName);
        }
      }

      return merged;
    });

    setActivity((current) => [
      ...current,
      {
        id: Date.now(),
        label: "Evidence attached",
        detail: `${nextFiles.join(", ")} added to the supplier profile.`,
      },
    ]);
  };

  const attachSampleCapabilityStatement = () => {
    setDocuments((current) =>
      current.includes(sampleCapabilityStatement)
        ? current
        : [...current, sampleCapabilityStatement],
    );
    updateDemoUrl("/portal-demo?state=documents&doc=capability-statement.pdf");

    setActivity((current) => [
      ...current,
      {
        id: Date.now(),
        label: "Sample evidence attached",
        detail:
          "Built-in capability statement attached to the draft workspace for review.",
      },
    ]);
  };

  const saveDraft = () => {
    const timestamp = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(new Date());

    setLastSavedAt(timestamp);
    setActiveTab("review");
    updateDemoUrl(reviewSharePath);
    setActivity((current) => [
      ...current,
      {
        id: Date.now(),
        label: "Draft saved",
        detail: `Profile draft parked for human review at ${timestamp}.`,
      },
    ]);
  };

  return (
    <main className="min-h-screen bg-[#eef3f8] px-4 py-6 text-[#0f1723] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[1.75rem] border border-[#d8e1ea] bg-white px-5 py-4 shadow-[0_18px_45px_rgba(15,23,35,0.08)] sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f3d75] text-sm font-semibold tracking-[0.16em] text-white">
                VP
              </span>
              <div>
                <p className="text-lg font-semibold text-[#102132]">
                  Northstar Vendor Portal
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#6b7a8c]">
                  demo environment | publish locked
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-[#d1dbe5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#445266] transition hover:border-[#9eb0c3] hover:text-[#152232]"
              >
                back to BidPilot
              </Link>
              <span className="inline-flex items-center justify-center rounded-full bg-[#e6f4ea] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[#23704a]">
                approval gate active
              </span>
            </div>
          </div>
        </div>

        {!isSignedIn ? (
          <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[2rem] bg-[#102132] p-8 text-white shadow-[0_30px_80px_rgba(15,23,35,0.25)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8fb6e8]">
                supplier workspace
              </p>
              <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em]">
                Sign in and park every change in draft mode.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/68">
                This self-hosted vendor portal gives you a stable
                <span className="mx-2 rounded-full border border-white/12 bg-white/8 px-3 py-1 font-mono text-sm text-white/84">
                  login -&gt; attach evidence -&gt; save draft
                </span>
                workflow for recording the BidPilot demo without risking a live
                procurement submission.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  "Profile completion",
                  "Document attachment",
                  "Review-only handoff",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-sm text-white/72"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#d8e1ea] bg-white p-7 shadow-[0_24px_55px_rgba(15,23,35,0.08)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#6b7a8c]">
                operator login
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#102132]">
                Open the supplier draft workspace
              </h2>

              <form onSubmit={handleLogin} className="mt-8 space-y-5">
                <label className="block">
                  <span className="text-sm font-medium text-[#445266]">Email</span>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-3 w-full rounded-[1rem] border border-[#d8e1ea] bg-[#f8fbff] px-4 py-3 text-sm text-[#102132] outline-none transition focus:border-[#0f3d75]"
                    placeholder="operator@vendor-portal.test"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-[#445266]">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-3 w-full rounded-[1rem] border border-[#d8e1ea] bg-[#f8fbff] px-4 py-3 text-sm text-[#102132] outline-none transition focus:border-[#0f3d75]"
                    placeholder="Any password works for demo mode"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#0f3d75] px-5 py-3 font-mono text-xs uppercase tracking-[0.28em] text-white transition hover:-translate-y-0.5 hover:bg-[#154b8d]"
                >
                  sign in to workspace
                </button>
              </form>

              <p className="mt-5 text-sm leading-7 text-[#6b7a8c]">
                This sandbox is intentionally stable for recording. Final
                publish is locked and every change is saved as a draft.
              </p>
            </div>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[250px_1fr_300px]">
            <aside className="rounded-[2rem] border border-[#d8e1ea] bg-white p-6 shadow-[0_22px_55px_rgba(15,23,35,0.08)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#6b7a8c]">
                workflow rail
              </p>

              <div className="mt-6 space-y-4">
                {[
                  {
                    title: "1. Legal profile",
                    detail: "Confirm truthful vendor identity and contact owner.",
                  },
                  {
                    title: "2. Evidence",
                    detail: "Attach capability statement and related proof files.",
                  },
                  {
                    title: "3. Review edge",
                    detail: "Save draft and wait for approval before publish.",
                  },
                ].map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-[1.4rem] border border-[#e3eaf2] bg-[#f8fbff] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white font-mono text-xs text-[#0f3d75] shadow-sm">
                        0{index + 1}
                      </span>
                      <p className="text-sm font-semibold text-[#102132]">
                        {step.title}
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[#607082]">
                      {step.detail}
                    </p>
                  </div>
                ))}
              </div>
            </aside>

            <div className="rounded-[2rem] border border-[#d8e1ea] bg-white p-6 shadow-[0_22px_55px_rgba(15,23,35,0.08)]">
              <div className="flex flex-col gap-4 border-b border-[#e6edf4] pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#6b7a8c]">
                    supplier profile
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#102132]">
                    {displayName || companyLegalName}
                  </h1>
                  <p className="mt-2 text-sm leading-7 text-[#607082]">
                    Logged in as {email}. Final publish is locked until a human
                    reviewer signs off.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition ${
                        activeTab === tab.id
                          ? "border-[#0f3d75] bg-[#eef5ff] text-[#0f3d75]"
                          : "border-[#d7e1eb] text-[#607082] hover:border-[#aebdcd] hover:text-[#102132]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === "profile" ? (
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-[#445266]">
                      Company legal name
                    </span>
                    <input
                      value={companyLegalName}
                      onChange={(event) => setCompanyLegalName(event.target.value)}
                      className="mt-3 w-full rounded-[1rem] border border-[#d8e1ea] bg-[#f8fbff] px-4 py-3 text-sm text-[#102132] outline-none transition focus:border-[#0f3d75]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-[#445266]">
                      Display / trade name
                    </span>
                    <input
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      className="mt-3 w-full rounded-[1rem] border border-[#d8e1ea] bg-[#f8fbff] px-4 py-3 text-sm text-[#102132] outline-none transition focus:border-[#0f3d75]"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="text-sm font-medium text-[#445266]">
                      Business summary
                    </span>
                    <textarea
                      value={businessSummary}
                      onChange={(event) => setBusinessSummary(event.target.value)}
                      rows={5}
                      className="mt-3 w-full rounded-[1rem] border border-[#d8e1ea] bg-[#f8fbff] px-4 py-3 text-sm leading-7 text-[#102132] outline-none transition focus:border-[#0f3d75]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-[#445266]">
                      Website
                    </span>
                    <input
                      value={website}
                      onChange={(event) => setWebsite(event.target.value)}
                      className="mt-3 w-full rounded-[1rem] border border-[#d8e1ea] bg-[#f8fbff] px-4 py-3 text-sm text-[#102132] outline-none transition focus:border-[#0f3d75]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-[#445266]">
                      Primary contact
                    </span>
                    <input
                      value={primaryContact}
                      onChange={(event) => setPrimaryContact(event.target.value)}
                      className="mt-3 w-full rounded-[1rem] border border-[#d8e1ea] bg-[#f8fbff] px-4 py-3 text-sm text-[#102132] outline-none transition focus:border-[#0f3d75]"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="text-sm font-medium text-[#445266]">
                      Primary operating location
                    </span>
                    <input
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      className="mt-3 w-full rounded-[1rem] border border-[#d8e1ea] bg-[#f8fbff] px-4 py-3 text-sm text-[#102132] outline-none transition focus:border-[#0f3d75]"
                    />
                  </label>
                </div>
              ) : null}

              {activeTab === "documents" ? (
                <div className="mt-6 space-y-5">
                  <div className="rounded-[1.5rem] border border-dashed border-[#bfd0e2] bg-[#f8fbff] p-6">
                    <p className="text-lg font-semibold text-[#102132]">
                      Attach supporting evidence
                    </p>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#607082]">
                      Add a capability statement, company profile, or any proof
                      document you want the reviewer to see before approval.
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={attachSampleCapabilityStatement}
                      className="mt-5 inline-flex items-center justify-center rounded-full border border-[#0f3d75] px-5 py-3 font-mono text-xs uppercase tracking-[0.28em] text-[#0f3d75] transition hover:-translate-y-0.5 hover:bg-[#eaf2ff]"
                    >
                      attach sample capability statement
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3 inline-flex items-center justify-center rounded-full bg-[#0f3d75] px-5 py-3 font-mono text-xs uppercase tracking-[0.28em] text-white transition hover:-translate-y-0.5 hover:bg-[#154b8d]"
                    >
                      choose files
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {documents.length ? (
                      documents.map((documentName) => (
                        <div
                          key={documentName}
                          className="rounded-[1.35rem] border border-[#d8e1ea] bg-white p-4"
                        >
                          <p className="text-sm font-semibold text-[#102132]">
                            {documentName}
                          </p>
                          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[#23704a]">
                            attached
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[1.35rem] border border-[#d8e1ea] bg-white p-4 md:col-span-2">
                        <p className="text-sm text-[#607082]">
                          No documents attached yet. Add your
                          `capability-statement.pdf` to complete the demo path.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {activeTab === "review" ? (
                <div className="mt-6 space-y-5">
                  <div className="rounded-[1.5rem] border border-[#d8e1ea] bg-[#f8fbff] p-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#6b7a8c]">
                      approval packet
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-[#102132]">
                      Draft staged for human sign-off
                    </h2>
                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <div className="rounded-[1.25rem] border border-[#d8e1ea] bg-white p-4">
                        <p className="text-sm font-medium text-[#445266]">
                          Legal profile
                        </p>
                        <p className="mt-3 text-base font-semibold text-[#102132]">
                          {companyLegalName}
                        </p>
                      </div>
                      <div className="rounded-[1.25rem] border border-[#d8e1ea] bg-white p-4">
                        <p className="text-sm font-medium text-[#445266]">
                          Documents attached
                        </p>
                        <p className="mt-3 text-base font-semibold text-[#102132]">
                          {documents.length}
                        </p>
                      </div>
                      <div className="rounded-[1.25rem] border border-[#d8e1ea] bg-white p-4">
                        <p className="text-sm font-medium text-[#445266]">
                          Last saved
                        </p>
                        <p className="mt-3 text-base font-semibold text-[#102132]">
                          {lastSavedAt ?? "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-[#f0d8b1] bg-[#fff5e7] p-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#a96019]">
                      final publish disabled
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[#80552a]">
                      This portal intentionally stops at draft save so the final
                      irreversible action stays with the reviewer.
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[#80552a]">
                      Review URL:
                      <span className="ml-2 rounded-full bg-white/70 px-3 py-1 font-mono text-[11px] text-[#6f461f]">
                        {reviewSharePath}
                      </span>
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-[#d8e1ea] bg-white p-6 shadow-[0_22px_55px_rgba(15,23,35,0.08)]">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#6b7a8c]">
                  controls
                </p>
                <button
                  type="button"
                  onClick={saveDraft}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#0f3d75] px-5 py-3 font-mono text-xs uppercase tracking-[0.28em] text-white transition hover:-translate-y-0.5 hover:bg-[#154b8d]"
                >
                  save draft
                </button>
                <button
                  type="button"
                  disabled
                  className="mt-3 inline-flex w-full cursor-not-allowed items-center justify-center rounded-full border border-[#d8e1ea] px-5 py-3 font-mono text-xs uppercase tracking-[0.28em] text-[#98a7b6] opacity-70"
                >
                  final publish locked
                </button>
                <p className="mt-4 text-sm leading-7 text-[#607082]">
                  Use this to record the approval-gated save behavior cleanly in
                  your demo.
                </p>
              </div>

              <div className="rounded-[2rem] border border-[#d8e1ea] bg-white p-6 shadow-[0_22px_55px_rgba(15,23,35,0.08)]">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#6b7a8c]">
                  activity log
                </p>
                <div className="mt-5 space-y-4">
                  {activity.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-[1.3rem] border border-[#e3eaf2] bg-[#f8fbff] p-4"
                    >
                      <p className="text-sm font-semibold text-[#102132]">
                        {entry.label}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[#607082]">
                        {entry.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}
