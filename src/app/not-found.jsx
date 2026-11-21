import Link from "next/link";
import { Home, LayoutDashboard, Search, Scissors } from "lucide-react";

export const metadata = {
  title: "Page Not Found | SalonBook",
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fffafa] px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-xl shadow-rose-100/40">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <Scissors className="size-8" />
        </div>

        <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-rose-500">
          404 Error
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
          The page you are looking for does not exist or may have been moved.
          Check the URL or use one of the links below.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            <Home className="size-4" />
            Back to home
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <Search className="size-4" />
            Browse services
          </Link>

          <Link
            href="/dashboard/customer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
