
import Link from "next/link";

export default function BlockedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-red-500">
          Account Blocked
        </h1>

        <p className="mt-4 text-gray-600">
          Your account has been blocked. You cannot access protected
          platform features. Please contact the administrator.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-rose-500 px-6 py-3 font-semibold text-white"
        >
         
          Back to Home
        </Link>
      </div>
    </main>
  );
}
