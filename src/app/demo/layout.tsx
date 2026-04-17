import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Tour | BidPilot — See How Portal Automation Works",
  description:
    "Explore how BidPilot automates supplier portal onboarding with TinyFish browser automation. Interactive product walkthrough for procurement teams.",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
