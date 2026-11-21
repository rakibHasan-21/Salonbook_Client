"use client";

import ErrorFallback from "@/components/shared/ErrorFallback";

export default function DashboardError({ error, reset }) {
  return (
    <ErrorFallback
      error={error}
      reset={reset}
      title="Dashboard failed to load"
      description="We could not load your dashboard data. Please try again."
    />
  );
}
