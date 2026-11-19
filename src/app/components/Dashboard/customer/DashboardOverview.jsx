
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
} from "lucide-react";

export default function DashboardOverview({ stats = {} }) {
  const {
    total = 0,
    pending = 0,
    confirmed = 0,
    cancelled = 0,
  } = stats;

  const cards = [
    {
      title: "Total Appointment Requests",
      value: total,
      description: "All appointment requests",
      icon: CalendarDays,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/dashboard/customer/appointments",
    },
    {
      title: "Pending Appointments",
      value: pending,
      description: "Waiting for approval",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/dashboard/customer/appointments?status=Pending",
    },
    {
      title: "Confirmed Appointments",
      value: confirmed,
      description: "Approved appointments",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      href: "/dashboard/customer/appointments?status=Confirmed",
    },
    {
      title: "Cancelled Appointments",
      value: cancelled,
      description: "Cancelled appointments",
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      href: "/dashboard/customer/appointments?status=Cancelled",
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back! Here is your appointment summary.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              href={item.href}
              key={item.title}
              className="group rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex size-12 items-center justify-center rounded-xl ${item.bg}`}
                >
                  <Icon className={`size-6 ${item.color}`} />
                </div>

                <ArrowUpRight className="size-5 text-gray-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                  {item.value}
                </h2>

                <p className="mt-2 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
