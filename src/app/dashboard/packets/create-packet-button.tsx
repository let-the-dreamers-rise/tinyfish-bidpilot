"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreatePacketDialog } from "@/components/create-packet-dialog";

export function CreatePacketButton({ variant = "header" }: { variant?: "header" | "empty_state" }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // If the user arrived with ?create=true in the URL, pop it open automatically
  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setOpen(true);
      // Clean up the URL so it doesn't reopen on refresh
      router.replace("/dashboard/packets");
    }
  }, [searchParams, router]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={variant === "header" ? "halo-button !py-2.5 !px-5 !text-[10px]" : "halo-button mt-8"}
      >
        {variant === "header" ? "+ new packet" : "create first packet"}
      </button>

      <CreatePacketDialog
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => {
          setOpen(false);
          router.refresh(); // Refetch the dashboard data to show the new packet
        }}
      />
    </>
  );
}
