import Link from "next/link";
import { ArrowRight, CalendarDays, RotateCcw, XCircle } from "lucide-react";

import ToastOnMount from "@/components/shared/ToastOnMount";

export const metadata = {
  title: "Payment Cancelled | SalonBook",
};

const PaymentCancelPage = async ({ searchParams }) => {
  const params = (await searchParams) || {};
  const appointmentId =
    typeof params.appointment_id === "string" ? params.appointment_id : "";

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-12 sm:py-16">
      <ToastOnMount
        type="warning"
        message="Payment was cancelled. Your appointment is still unpaid."
        id={`payment-cancel:${appointmentId || "unknown"}`}
      />
      <div className="w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-rose-100/50">
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 px-6 py-10 text-center text-white sm:px-10">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-white/15">
            <XCircle className="size-9" />
          </div>
          <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
            Payment cancelled
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-rose-50">
            No payment was taken. Your appointment is still confirmed and
            marked as unpaid.
          </p>
        </div>

        <div className="px-6 py-8 text-center sm:px-10">
          <div className="mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 p-4 text-left">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">
              You can return to My Appointments and click{" "}
              <span className="font-semibold">Pay Now</span> whenever you are
              ready to complete the payment.
            </p>
          </div>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard/customer/appointments"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              <RotateCcw className="size-4" />
              Return to My Appointments
            </Link>
            <Link
              href="/dashboard/customer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to Dashboard
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {appointmentId ? (
            <p className="mt-5 text-xs text-gray-400">
              Appointment reference: {appointmentId}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
};

export default PaymentCancelPage;
