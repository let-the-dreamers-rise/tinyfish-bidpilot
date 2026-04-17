"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Razorpay Window Type Extension                                            */
/* -------------------------------------------------------------------------- */

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string };
  theme?: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss: () => void };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

type CheckoutState = "idle" | "loading" | "ready" | "processing" | "success" | "error";

interface RazorpayCheckoutProps {
  plan: string;
  label: string;
  highlight?: boolean;
  className?: string;
}

export default function RazorpayCheckout({
  plan,
  label,
  highlight = false,
  className = "",
}: RazorpayCheckoutProps) {
  const [state, setState] = useState<CheckoutState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const scriptLoaded = useRef(false);

  /* Load Razorpay checkout script once */
  useEffect(() => {
    if (scriptLoaded.current || typeof window === "undefined") return;
    if (document.querySelector('script[src*="checkout.razorpay.com"]')) {
      scriptLoaded.current = true;
      setState("ready");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
      setState("ready");
    };
    script.onerror = () => {
      setState("error");
      setErrorMsg("Failed to load payment gateway.");
    };
    document.body.appendChild(script);
  }, []);

  const handleCheckout = useCallback(async () => {
    if (state === "processing" || state === "loading") return;
    setState("loading");
    setErrorMsg("");

    try {
      /* 1. Create a Razorpay order on the server */
      const res = await fetch("/api/payments/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order creation failed.");

      /* 2. Open Razorpay checkout modal */
      setState("processing");

      const options: RazorpayOptions = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "BidPilot",
        description: data.planName,
        order_id: data.orderId,
        theme: { color: "#f5a65f" },
        handler: async (response: RazorpayResponse) => {
          /* 3. Verify payment on the server */
          try {
            const verifyRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.verified) {
              setState("success");
            } else {
              throw new Error(verifyData.error || "Verification failed.");
            }
          } catch (err) {
            setState("error");
            setErrorMsg(
              err instanceof Error ? err.message : "Payment verification failed.",
            );
          }
        },
        modal: {
          ondismiss: () => {
            setState("ready");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setState("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Unable to initiate payment.",
      );
    }
  }, [plan, state]);

  /* Label logic */
  const buttonLabel = (() => {
    switch (state) {
      case "loading":
        return "preparing…";
      case "processing":
        return "completing…";
      case "success":
        return "✓ subscribed";
      case "error":
        return "retry payment";
      default:
        return label;
    }
  })();

  const disabled = state === "loading" || state === "processing" || state === "success";

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={disabled}
        className={`${highlight ? "halo-button" : "ghost-button"} w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {state === "loading" || state === "processing" ? (
          <span className="flex items-center gap-2">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-current" />
            {buttonLabel}
          </span>
        ) : (
          buttonLabel
        )}
      </button>

      {state === "success" && (
        <p className="mt-2 text-center text-xs text-[var(--success)]">
          Payment successful! Your plan has been upgraded.
        </p>
      )}

      {state === "error" && errorMsg && (
        <p className="mt-2 text-center text-xs text-red-400">{errorMsg}</p>
      )}
    </div>
  );
}
