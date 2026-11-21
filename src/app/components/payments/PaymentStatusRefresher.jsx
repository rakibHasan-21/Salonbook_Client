"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * While Stripe confirms the payment, refresh the server component so the
 * success page picks up the transaction written by the webhook.
 */
const PaymentStatusRefresher = ({ active = false, interval = 4000 }) => {
  const router = useRouter();

  useEffect(() => {
    if (!active) return undefined;

    const timer = setInterval(() => {
      router.refresh();
    }, interval);

    return () => clearInterval(timer);
  }, [active, interval, router]);

  return null;
};

export default PaymentStatusRefresher;
