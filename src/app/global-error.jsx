"use client";

import ErrorFallback from "@/components/shared/ErrorFallback";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fffafa]">
        <ErrorFallback
          error={error}
          reset={reset}
          title="Application error"
          description="The application encountered a critical error. Please reload the page."
        />
      </body>
    </html>
  );
}
