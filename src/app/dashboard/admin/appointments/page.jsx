
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { LoadingMessage } from "@/components/shared/LoadingState";
import { confirmAction } from "@/lib/confirm";
import {
  ApiError,
  apiFetch,
  getErrorMessage,
  isBlockedError,
  isForbiddenError,
  isUnauthorizedError,
} from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const getToken = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new ApiError("Your session has expired. Please sign in again.", {
      status: 401,
      code: "UNAUTHORIZED",
    });
  }

  return data.token;
};

const apiRequest = async (path, options = {}) => {
  if (!API_URL) {
    throw new ApiError("Appointments API is not configured.", {
      code: "CONFIG",
    });
  }

  const token = await getToken();

  return apiFetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
};

export default function ManageAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionLoading, setActionLoading] = useState("");

  const redirectIfAuthError = useCallback(
    (err) => {
      if (isUnauthorizedError(err)) {
        const message = "Your session has expired. Please sign in again.";
        toast.error(message);
        router.push(`/sign-in?error=${encodeURIComponent(message)}`);
        return true;
      }

      if (isBlockedError(err)) {
        const message =
          "Your account has been blocked. Please contact the administrator.";
        toast.error(message);
        router.push("/blocked");
        return true;
      }

      if (isForbiddenError(err)) {
        const message = "You do not have permission to manage appointments.";
        toast.error(message);
        router.push(
          `/unauthorized?reason=admin&error=${encodeURIComponent(message)}`
        );
        return true;
      }

      return false;
    },
    [router]
  );

  // Fetch All Appointments
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await apiRequest("/admin/appointments");

      setAppointments(result.appointments || []);
    } catch (error) {
      console.error("Appointments fetch error:", error);
      const message = getErrorMessage(
        error,
        "Unable to load appointments. Please try again."
      );
      setError(message);
      if (!redirectIfAuthError(error)) {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }, [redirectIfAuthError]);

  useEffect(() => {
    // Initial load only. fetchAppointments manages its own loading/error state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAppointments();
  }, [fetchAppointments]);

  // Confirm / Cancel Appointment
  const handleStatusChange = async (id, action) => {
    const isConfirm = action === "confirm";

    const confirmed = await confirmAction({
      title: isConfirm
        ? "Confirm this appointment?"
        : "Cancel this appointment?",
      description: isConfirm
        ? "The customer will be able to pay for this appointment after it is confirmed."
        : "The customer will be notified that this appointment has been cancelled.",
      confirmLabel: isConfirm ? "Confirm appointment" : "Cancel appointment",
      cancelLabel: "Go back",
      tone: isConfirm ? "default" : "danger",
    });

    if (!confirmed) return;

    try {
      setActionLoading(`${id}-${action}`);

      const result = await apiRequest(
        `/admin/appointments/${id}/${action}`,
        { method: "PATCH" }
      );

      await fetchAppointments();

      if (selectedAppointment?._id === id && result.appointment) {
        setSelectedAppointment(result.appointment);
      }

      toast.success(
        isConfirm
          ? "Appointment confirmed successfully."
          : "Appointment cancelled successfully."
      );
    } catch (error) {
      console.error("Appointment status error:", error);
      const message = getErrorMessage(
        error,
        "Unable to update the appointment."
      );
      if (!redirectIfAuthError(error)) {
        toast.error(message);
      }
    } finally {
      setActionLoading("");
    }
  };

  // Search and Filter
  const filteredAppointments = appointments.filter((appointment) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      (appointment.customerName || "").toLowerCase().includes(searchValue) ||
      (appointment.customerEmail || "").toLowerCase().includes(searchValue) ||
      (appointment.serviceName || "").toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    const matchesPayment =
      paymentFilter === "all" ||
      appointment.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const total = appointments.length;
  const pending = appointments.filter((a) => a.status === "Pending").length;
  const confirmed = appointments.filter((a) => a.status === "Confirmed").length;
  const cancelled = appointments.filter((a) => a.status === "Cancelled").length;

  const statusColor = (status) => {
    if (status === "Confirmed") return "bg-green-100 text-green-700";
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <LoadingMessage
          title="Loading appointments"
          description="Fetching customer appointment requests..."
          className="rounded-2xl border bg-card px-6 py-8 shadow-sm"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            Manage Appointments
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage all customer appointment requests.
          </p>
        </div>

        <button
          onClick={fetchAppointments}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {error}
        </div>
      ) : null}

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Appointments", value: total, color: "text-primary" },
          { label: "Pending", value: pending, color: "text-yellow-600" },
          { label: "Confirmed", value: confirmed, color: "text-green-600" },
          { label: "Cancelled", value: cancelled, color: "text-red-600" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <h2 className={`mt-2 text-3xl font-bold ${item.color}`}>
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer or service..."
            className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border bg-background px-4 py-2.5 outline-none"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="rounded-lg border bg-background px-4 py-2.5 outline-none"
        >
          <option value="all">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

      {/* Appointment Table */}
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Service</th>
              <th className="p-4">Appointment Date</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment._id} className="border-t">
                <td className="p-4">
                  <p className="font-medium">
                    {appointment.customerName || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.customerEmail || "N/A"}
                  </p>
                </td>

                <td className="p-4">
                  <p className="font-medium">
                    {appointment.serviceName || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.category || "N/A"}
                  </p>
                </td>

                <td className="p-4">
                  {formatDate(
                    appointment.appointmentDate || appointment.date
                  )}
                </td>

                <td className="p-4 font-medium">
                  ৳{appointment.price ?? 0}
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor(appointment.status)}`}
                  >
                    {appointment.status || "Pending"}
                  </span>
                </td>

                <td className="p-4">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs">
                    {appointment.paymentStatus || "Unpaid"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAppointment(appointment)}
                      title="View Details"
                      className="rounded-lg border p-2 hover:bg-muted"
                    >
                      <Eye size={16} />
                    </button>

                    {appointment.status === "Pending" && (
                      <button
                        onClick={() =>
                          handleStatusChange(appointment._id, "confirm")
                        }
                        disabled={!!actionLoading}
                        title="Confirm"
                        className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {actionLoading === `${appointment._id}-confirm` ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                      </button>
                    )}

                    {["Pending", "Confirmed"].includes(appointment.status) && (
                      <button
                        onClick={() =>
                          handleStatusChange(appointment._id, "cancel")
                        }
                        disabled={!!actionLoading}
                        title="Cancel"
                        className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {actionLoading === `${appointment._id}-cancel` ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <XCircle size={16} />
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredAppointments.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="p-10 text-center text-muted-foreground"
                >
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Appointment Details</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="rounded-lg border px-3 py-1.5 hover:bg-muted"
              >
                Close
              </button>
            </div>

            {(() => {
              const a = selectedAppointment;

              return (
                <div className="space-y-5">
                  {/* Customer Information */}
                  <section>
                    <h3 className="mb-2 font-semibold">
                      Customer Information
                    </h3>
                    <div className="grid gap-3 rounded-lg bg-muted/50 p-4 sm:grid-cols-2">
                      <p>Name: {a.customerName || "N/A"}</p>
                      <p>Email: {a.customerEmail || "N/A"}</p>
                      <p>Phone: {a.customerPhone || a.phone || "N/A"}</p>
                    </div>
                  </section>

                  {/* Service Information */}
                  <section>
                    <h3 className="mb-2 font-semibold">Service Information</h3>
                    <div className="flex gap-4 rounded-lg bg-muted/50 p-4">
                      {a.image && (
                        <img
                          src={a.image}
                          alt={a.serviceName || "Service"}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">
                          {a.serviceName || "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {a.category || "N/A"}
                        </p>
                        <p className="text-sm">
                          Duration: {a.duration || "N/A"} minutes
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Appointment Date and Time */}
                  <section>
                    <h3 className="mb-2 font-semibold">
                      Appointment Date and Time
                    </h3>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p>
                        Date:{" "}
                        {formatDate(a.appointmentDate || a.date)}
                      </p>
                      <p>
                        Time: {a.appointmentTime || a.time || "N/A"}
                      </p>
                    </div>
                  </section>

                  {/* Customer Message */}
                  <section>
                    <h3 className="mb-2 font-semibold">Customer Message</h3>
                    <div className="rounded-lg bg-muted/50 p-4">
                      {a.message ||
                        a.customerMessage ||
                        "No message provided."}
                    </div>
                  </section>

                  {/* Price and Status */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <section className="rounded-lg border p-4">
                      <h3 className="text-sm text-muted-foreground">
                        Service Price
                      </h3>
                      <p className="mt-1 text-xl font-bold">
                        ৳{a.price ?? 0}
                      </p>
                    </section>

                    <section className="rounded-lg border p-4">
                      <h3 className="text-sm text-muted-foreground">
                        Appointment Status
                      </h3>
                      <p className="mt-1 font-semibold">
                        {a.status || "Pending"}
                      </p>
                    </section>

                    <section className="rounded-lg border p-4">
                      <h3 className="text-sm text-muted-foreground">
                        Payment Status
                      </h3>
                      <p className="mt-1 font-semibold">
                        {a.paymentStatus || "Unpaid"}
                      </p>
                    </section>

                    <section className="rounded-lg border p-4">
                      <h3 className="text-sm text-muted-foreground">
                        Booking Request Date
                      </h3>
                      <p className="mt-1 font-semibold">
                        {formatDate(a.createdAt)}
                      </p>
                    </section>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
