"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";


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
