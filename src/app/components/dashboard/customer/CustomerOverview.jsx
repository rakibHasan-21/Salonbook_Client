import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, XCircle } from "lucide-react";

import StatCard from "./StatCard";
import { getAppointmentStats } from "./appointmentStats";

const CustomerOverview = ({ appointments = [], isLoading = false }) => {
  const counts = getAppointmentStats(appointments);

  const stats = [
    {
      key: "total",
      label: "Total Appointment Requests",
      value: counts.total,
      icon: CalendarDays,
      tone: "rose",
      hint: "All requests you have submitted",
    },
    {
      key: "pending",
      label: "Pending Appointments",
      value: counts.pending,
      icon: Clock3,
      tone: "amber",
      hint: "Waiting for confirmation",
    },
    {
      key: "confirmed",
      label: "Confirmed Appointments",
      value: counts.confirmed,
      icon: CheckCircle2,
      tone: "emerald",
      hint: "Approved and scheduled",
    },
    {
      key: "cancelled",
      label: "Cancelled Appointments",
      value: counts.cancelled,
      icon: XCircle,
      tone: "red",
      hint: "Cancelled or declined",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
          Customer Dashboard
        </p>

        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          Overview
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          A quick look at your appointment requests and where each one stands.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
        {stats.map(({ key, ...stat }) => (
          <StatCard key={key} {...stat} isLoading={isLoading} />
        ))}
      </div>

      {!isLoading && counts.total === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-rose-100 bg-white px-5 py-4 text-sm text-gray-500">
          You have not requested any appointments yet.{" "}
          <Link
            href="/services"
            className="font-semibold text-rose-600 transition hover:text-rose-700"
          >
            Browse services
          </Link>{" "}
          to get started.
        </p>
      ) : null}
    </section>
  );
};

export default CustomerOverview;
