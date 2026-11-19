
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Users,
  Scissors,
  CalendarDays,
  Clock3,
  CalendarCheck,
  Wallet,
  RefreshCw,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!API_URL) {
        throw new Error("Dashboard API is not configured.");
      }

      const { data, error: tokenError } = await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error(
          tokenError?.message || "Unable to get an access token."
        );
      }

      const response = await fetch(
        `${API_URL}/admin/dashboard-stats`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => null);

        throw new Error(
          body?.message ||
            `Failed to fetch dashboard stats (${response.status}).`
        );
      }

      const payload = await response.json();
      setStats(payload);
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to fetch dashboard stats.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load only. fetchStats manages its own loading/error state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      title: "Total Customers",
      value: stats?.totalCustomers ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      description: "Registered customers",
    },
    {
      title: "Active Services",
      value: stats?.totalActiveServices ?? 0,
      icon: Scissors,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      description: "Currently available services",
    },
    {
      title: "Total Appointments",
      value: stats?.totalAppointments ?? 0,
      icon: CalendarDays,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
      description: "All appointment requests",
    },
    {
      title: "Pending Appointments",
      value: stats?.pendingAppointments ?? 0,
      icon: Clock3,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      description: "Waiting for approval",
    },
    {
      title: "Confirmed Appointments",
      value: stats?.confirmedAppointments ?? 0,
      icon: CalendarCheck,
      color: "text-teal-600",
      bg: "bg-teal-50",
      border: "border-teal-100",
      description: "Successfully confirmed",
    },
    {
      title: "Successful Payments",
      value: `$ ${Number(
        stats?.totalSuccessfulPayments ?? 0
      ).toLocaleString("en-BD")}`,
      icon: Wallet,
      color: "text-pink-600",
      bg: "bg-pink-50",
      border: "border-pink-100",
      description: "Total received payments",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                Admin Panel
              </p>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard Overview
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Welcome back! Here&apos;s what&apos;s happening with SalonBook.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard/admin/services"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
            >
              <Scissors size={16} />
              Manage Services
            </Link>

            <button
              onClick={fetchStats}
              disabled={loading}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh Stats
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 text-red-600" size={20} />
              <div>
                <h3 className="font-semibold text-red-800">
                  Something went wrong
                </h3>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>
            </div>

            <button
              onClick={fetchStats}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Statistics */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Platform Statistics
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Overview of your salon booking platform
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex">
              <TrendingUp size={14} />
              Live Overview
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {loading && !stats
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-6 h-12 w-12 rounded-xl bg-slate-100" />
                    <div className="mb-3 h-4 w-32 rounded bg-slate-100" />
                    <div className="mb-3 h-9 w-24 rounded bg-slate-100" />
                    <div className="h-3 w-40 rounded bg-slate-100" />
                  </div>
                ))
              : !error &&
                statCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <div
                      key={card.title}
                      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} ${card.color}`}
                        >
                          <Icon size={23} strokeWidth={2} />
                        </div>

                        <span className="text-xs font-medium text-slate-400">
                          Overview
                        </span>
                      </div>

                      <div className="mt-6">
                        <p className="text-sm font-medium text-slate-500">
                          {card.title}
                        </p>

                        <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                          {card.value}
                        </h3>

                        <p className="mt-3 text-xs text-slate-400">
                          {card.description}
                        </p>
                      </div>

                      <div
                        className={`mt-5 h-1 w-full overflow-hidden rounded-full ${card.bg}`}
                      >
                        <div
                          className={`h-full w-1/3 rounded-full ${card.color.replace(
                            "text-",
                            "bg-"
                          )} opacity-70 transition-all duration-500 group-hover:w-full`}
                        />
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>

        {/* Bottom Info */}
        {!loading && !error && stats && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-slate-900">
                  Platform Management
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Monitor customers, services, appointments and payments
                  from your admin dashboard.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Dashboard Connected
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
