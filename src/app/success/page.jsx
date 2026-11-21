import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Loader2,
  Receipt,
  Scissors,
} from "lucide-react";

import PaymentStatusRefresher from "@/app/components/payments/PaymentStatusRefresher";
import ToastOnMount from "@/components/shared/ToastOnMount";
import { getTransactionsCollection } from "@/lib/mongodb";
import { finalizeCheckoutSession } from "@/lib/payments";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payment Success | SalonBook",
};

const formatAmount = (amountInCents, currency) => {
  if (typeof amountInCents !== "number") return "—";

  const code = String(currency || "usd").toUpperCase();

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    }).format(amountInCents / 100);
  } catch {
    return `${(amountInCents / 100).toFixed(2)} ${code}`;
  }
};

const formatAppointmentDate = (value) => {
  if (!value) return "—";

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return String(value);
};

const Detail = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
    <Icon className="mt-0.5 size-4 shrink-0 text-rose-500" />
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-gray-800">
        {value}
      </p>
    </div>
  </div>
);

const Shell = ({ children }) => (
  <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-12 sm:py-16">
    <div className="w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-rose-100/50">
      {children}
    </div>
  </main>
);

const SuccessPage = async ({ searchParams }) => {
  const params = (await searchParams) || {};
  const sessionId =
    typeof params.session_id === "string" ? params.session_id.trim() : "";

  let checkoutSession = null;
  let sessionError = "";

  if (!sessionId) {
    sessionError = "No checkout session was provided.";
  } else {
    try {
      checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      console.error("Unable to retrieve checkout session:", error);
      sessionError = "We could not find this checkout session.";
    }
  }

  if (sessionError) {
    return (
      <Shell>
        <ToastOnMount
          type="error"
          message={sessionError}
          id={`payment-error:${sessionId || "missing"}`}
        />
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 px-6 py-10 text-center text-white sm:px-10">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-white/15">
            <AlertCircle className="size-9" />
          </div>
          <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
            Payment confirmation unavailable
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-rose-50">
            {sessionError}
          </p>
        </div>

        <div className="px-6 py-8 text-center sm:px-10">
          <p className="text-sm text-gray-600">
            If you completed a payment, open My Appointments to check its
            status.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard/customer/appointments"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              View My Appointments
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/dashboard/customer"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  const isPaid = checkoutSession.payment_status === "paid";
  const isProcessing =
    checkoutSession.status === "complete" && !isPaid;

  let transaction = null;

  if (isPaid) {
    try {
      // The webhook is the primary writer. This idempotent call also covers
      // the case where the success page is reached before the webhook.
      await finalizeCheckoutSession(checkoutSession);
    } catch (error) {
      console.error("Unable to record transaction:", error);
    }

    try {
      const transactionsCollection = await getTransactionsCollection();
      transaction = await transactionsCollection.findOne({
        stripeSessionId: checkoutSession.id,
      });
    } catch (error) {
      console.error("Unable to load transaction:", error);
    }
  }

  const metadata = checkoutSession.metadata || {};
  const customerName =
    metadata.customerName ||
    checkoutSession.customer_details?.name ||
    "there";
  const serviceName = metadata.serviceName || "Salon appointment";

  if (!isPaid) {
    return (
      <Shell>
        <ToastOnMount
          type={isProcessing ? "info" : "warning"}
          message={
            isProcessing
              ? "Payment received. We are confirming it with Stripe..."
              : "Payment was not completed. You can try again from My Appointments."
          }
          id={`payment-processing:${checkoutSession.id}`}
        />
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 px-6 py-10 text-center text-white sm:px-10">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-white/15">
            {isProcessing ? (
              <Loader2 className="size-9 animate-spin" />
            ) : (
              <Clock3 className="size-9" />
            )}
          </div>
          <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
            {isProcessing ? "Confirming your payment" : "Payment not completed"}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-amber-50">
            {isProcessing
              ? "Stripe has processed your payment. We are waiting for the verified confirmation before updating your appointment."
              : "This checkout has not been paid yet. You can return to your appointments and try again."}
          </p>
        </div>

        <div className="px-6 py-8 text-center sm:px-10">
          <p className="text-sm text-gray-600">
            {isProcessing
              ? "This page refreshes automatically. You can also check My Appointments in a moment."
              : "No payment has been recorded for this appointment."}
          </p>

          <PaymentStatusRefresher active={isProcessing} />

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard/customer/appointments"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              View My Appointments
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <ToastOnMount
        type="success"
        message="Payment successful! Your appointment is confirmed."
        id={`payment-success:${checkoutSession.id}`}
      />
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-6 py-10 text-center text-white sm:px-10">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-white/15">
          <CheckCircle2 className="size-9" />
        </div>
        <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
          Payment successful
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-emerald-50">
          Thank you, {customerName}. Your payment has been confirmed and your
          appointment is all set.
        </p>
      </div>

      <div className="px-6 py-8 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <Receipt className="size-4" />
            Payment status
          </span>
          <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Paid
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Detail icon={Scissors} label="Service" value={serviceName} />
          <Detail
            icon={CreditCard}
            label="Amount Paid"
            value={formatAmount(
              checkoutSession.amount_total,
              checkoutSession.currency
            )}
          />
          <Detail
            icon={CalendarDays}
            label="Appointment Date"
            value={formatAppointmentDate(metadata.appointmentDate)}
          />
          <Detail
            icon={Clock3}
            label="Appointment Time"
            value={metadata.appointmentTime || "—"}
          />
          <Detail
            icon={Receipt}
            label="Transaction ID"
            value={transaction?._id ? String(transaction._id) : "Recording…"}
          />
          <Detail
            icon={Receipt}
            label="Stripe Session"
            value={checkoutSession.id}
          />
        </div>

        <p className="mt-5 rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 text-xs text-gray-500">
          {transaction
            ? "Your transaction has been saved securely. A receipt is available from your appointment history."
            : "Your payment is confirmed. We are saving the receipt now — this page will refresh automatically."}
        </p>

        <PaymentStatusRefresher active={!transaction} />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard/customer/appointments"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            View My Appointments
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/dashboard/customer"
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </Shell>
  );
};

export default SuccessPage;
