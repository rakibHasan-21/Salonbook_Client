import Link from "next/link";
import { Home, LayoutDashboard, LogIn, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Access Denied | SalonBook",
};

const UnauthorizedPage = async ({ searchParams }) => {
  const params = (await searchParams) || {};
  const reason =
    typeof params.reason === "string" ? params.reason.toLowerCase() : "";

  const message =
    reason === "admin"
      ? "You need an administrator account to open the admin dashboard."
      : reason === "blocked"
        ? "Your account has been blocked. Please contact the administrator."
        : "You do not have permission to access this page.";

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fffafa] px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-amber-100 bg-white p-8 text-center shadow-xl shadow-amber-100/40">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <ShieldAlert className="size-8" />
        </div>

        <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
          Access denied
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Unauthorized access
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
          {message}
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard/customer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            <LayoutDashboard className="size-4" />
            Go to my dashboard
          </Link>

          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <LogIn className="size-4" />
            Sign in
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <Home className="size-4" />
            Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default UnauthorizedPage;
