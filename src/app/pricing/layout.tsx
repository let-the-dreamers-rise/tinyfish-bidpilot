import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | BidPilot — Supplier Portal Automation",
  description:
    "Simple, transparent pricing for BidPilot. Start free, scale as your vendor onboarding volume grows.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
