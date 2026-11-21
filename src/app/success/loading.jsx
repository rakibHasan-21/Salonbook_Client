import { ShieldCheck } from "lucide-react";

import { Spinner } from "@/components/shared/LoadingState";

export default function PaymentSuccessLoading() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-12 sm:py-16">
      <div className="w-full rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl shadow-rose-100/50 sm:p-12">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-rose-50">
          <Spinner className="size-8 text-rose-500" />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Confirming your payment
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
          Please wait while we verify your payment with Stripe. Do not close
          this page.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
          <ShieldCheck className="size-4" />
          Secure payment verification
        </div>
      </div>
    </main>
  );
}
