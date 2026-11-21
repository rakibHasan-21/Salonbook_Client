"use client";

import ErrorFallback from "@/components/shared/ErrorFallback";

export default function AppError({ error, reset }) {
  return (
    <ErrorFallback
      error={error}
      reset={reset}
      title="Something went wrong"
      description="An unexpected error occurred while loading this page. Please try again."
    />
  );
}
