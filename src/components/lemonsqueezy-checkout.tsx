"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Lemon Squeezy Window Type Extension                                       */
/* -------------------------------------------------------------------------- */

declare global {
  interface Window {
    createLemonSqueezy?: () => void;
    LemonSqueezy?: {
      Url: {
        Open: (url: string) => void;
        Close: () => void;
      };
      Setup: (config: {
        eventHandler: (event: LemonSqueezyEvent) => void;
      }) => void;
    };
  }
}

interface LemonSqueezyEvent {
  event:
    | "Checkout.Success"
    | "Checkout.ViewCart"
    | "Checkout.Close"
    | "PaymentMethodUpdate.Mounted"
    | "PaymentMethodUpdate.Closed"
    | "PaymentMethodUpdate.Updated";
  data?: Record<string, unknown>;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

type CheckoutState = "idle" | "loading" | "processing" | "success" | "error";

interface LemonSqueezyCheckoutProps {
  /** The Lemon Squeezy checkout URL for this plan */
  checkoutUrl: string;
  label: string;
  highlight?: boolean;
  className?: string;
}

export default function LemonSqueezyCheckout({
  checkoutUrl,
  label,
  highlight = false,
  className = "",
}: LemonSqueezyCheckoutProps) {
  const [state, setState] = useState<CheckoutState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const scriptLoaded = useRef(false);

  /* Load Lemon Squeezy JS once */
  useEffect(() => {
    if (scriptLoaded.current || typeof window === "undefined") return;
    if (document.querySelector('script[src*="lmsqueezy"]')) {
      scriptLoaded.current = true;
      window.createLemonSqueezy?.();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://app.lemonsqueezy.com/js/lemon.js";
    script.defer = true;
    script.onload = () => {
      scriptLoaded.current = true;
      window.createLemonSqueezy?.();
    };
    script.onerror = () => {
      setState("error");
      setErrorMsg("Failed to load payment gateway.");
    };
    document.body.appendChild(script);
  }, []);

  const handleCheckout = useCallback(() => {
    if (state === "processing" || state === "loading") return;

    if (!checkoutUrl) {
      setState("error");
      setErrorMsg("Checkout is not configured. Contact support.");
      return;
    }

    setState("loading");
    setErrorMsg("");

    try {
      /* Setup event handler */
      window.LemonSqueezy?.Setup({
        eventHandler: (event: LemonSqueezyEvent) => {
          if (event.event === "Checkout.Success") {
            setState("success");

            /* Notify our backend to upgrade the plan */
            fetch("/api/payments/lemonsqueezy/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ event: event.data }),
            }).catch(() => {
              /* Webhook will catch it anyway */
            });
          }

          if (event.event === "Checkout.Close") {
            if (state !== "success") {
              setState("idle");
            }
          }
        },
      });

      /* Open the Lemon Squeezy overlay checkout */
      setState("processing");
      window.LemonSqueezy?.Url.Open(checkoutUrl);
    } catch {
      setState("error");
      setErrorMsg("Unable to open checkout. Please try again.");
    }
  }, [checkoutUrl, state]);

  /* Label logic */
  const buttonLabel = (() => {
    switch (state) {
      case "loading":
        return "preparing…";
      case "processing":
        return "complete checkout →";
      case "success":
        return "✓ subscribed";
      case "error":
        return "retry";
      default:
        return label;
    }
  })();

  const disabled = state === "loading" || state === "success";

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={disabled}
        className={`${highlight ? "halo-button" : "ghost-button"} w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {state === "loading" ? (
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
