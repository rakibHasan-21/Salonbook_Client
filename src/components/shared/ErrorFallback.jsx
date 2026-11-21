"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function ErrorFallback({
  error,
  reset,
  title = "Something went wrong",
  description = "An unexpected error occurred while loading this page. Please try again.",
  showHome = true,
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  const details =
    process.env.NODE_ENV === "development" && error?.message
      ? error.message
      : error?.digest
        ? `Reference: ${error.digest}`
        : "";

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fffafa] px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-xl shadow-rose-100/40">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <AlertTriangle className="size-8" />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
          {description}
        </p>

        {details ? (
          <p className="mt-4 break-words rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
            {details}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {typeof reset === "function" ? (
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              <RefreshCw className="size-4" />
              Try again
            </button>
          ) : null}

          {showHome ? (
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <Home className="size-4" />
              Back to home
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}
