"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  CreditCard,
  Eye,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Scissors,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";
import { confirmAction } from "@/lib/confirm";
import ToastOnMount from "@/components/shared/ToastOnMount";
import {
  ApiError,
  apiFetch,
  getErrorMessage,
  isBlockedError,
  isConflictError,
  isForbiddenError,
  isUnauthorizedError,
} from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthToken = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new ApiError("Your session has expired. Please sign in again.", {
      status: 401,
      code: "UNAUTHORIZED",
    });
  }

  return data.token;
};

const createCheckoutSession = async (appointmentId) => {
  const data = await apiFetch("/api/checkout_sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ appointmentId }),
  });

  if (!data?.url) {
    throw new Error("Stripe did not return a checkout URL. Please try again.");
  }

  return data.url;
};

const changeAppointment = async (appointmentId, action) => {
  if (!API_URL) {
    throw new Error("Appointments API is not configured.");
  }

  const token = await getAuthToken();

  return apiFetch(
    `${API_URL}/customer/appointments/${encodeURIComponent(appointmentId)}/${action}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const formatDate = (value) => {
  if (!value) return "—";

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTime = (value) => {
  if (!value) return "—";

  if (typeof value === "string" && !value.includes("T")) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (value) => {
  if (value === undefined || value === null || value === "") {
    return "—";
  }

  const numericValue = Number(value);

  if (Number.isFinite(numericValue)) {
    return `$${numericValue.toFixed(2)}`;
  }

  return String(value);
};

const getAppointment = (appointment) => {
  const serviceName =
    appointment.serviceName ||
    appointment.service?.serviceName ||
    "Salon Service";
  const serviceImage =
    appointment.serviceImage ||
    appointment.image ||
    appointment.service?.image ||
    "";
  const category =
    appointment.category ||
    appointment.serviceCategory ||
    appointment.service?.category ||
    "Uncategorized";
  const date =
    appointment.appointmentDate ||
    appointment.date ||
    appointment.bookingDate ||
    "";
  const time =
    appointment.appointmentTime ||
    appointment.time ||
    appointment.bookingTime ||
    "";
  const price =
    appointment.price ??
    appointment.servicePrice ??
    appointment.service?.price;
  const status = appointment.status || "Pending";
  const paymentStatus = appointment.paymentStatus || "Unpaid";
  const requestDate =
    appointment.createdAt ||
    appointment.requestDate ||
    appointment.bookedAt ||
    "";

  return {
    serviceName,
    serviceImage,
    category,
    date,
    time,
    price,
    status,
    paymentStatus,
    requestDate,
  };
};

const statusClasses = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
  canceled: "border-rose-200 bg-rose-50 text-rose-700",
};

const paymentClasses = {
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  unpaid: "border-amber-200 bg-amber-50 text-amber-700",
  refunded: "border-gray-200 bg-gray-50 text-gray-600",
};

const Pill = ({ children, tone = "gray" }) => {
  const classes =
    tone === "status"
      ? statusClasses[String(children).toLowerCase()]
      : paymentClasses[String(children).toLowerCase()];

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${classes || "border-gray-200 bg-gray-50 text-gray-600"}`}
    >
      {children}
    </span>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-rose-500" />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
};

const DetailRow = ({ icon: Icon, label, value }) => {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-rose-500" />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="mt-0.5 break-words text-sm font-medium text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
};

const CustomerAppointments = ({ appointments = [], error = "" }) => {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [actionKey, setActionKey] = useState("");
  const [actionError, setActionError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const list = useMemo(
    () => (Array.isArray(appointments) ? appointments : []),
    [appointments]
  );
  const isProcessingPayment = actionKey.endsWith(":pay");

  // Search by service name and sort by the service price on the client. The
  // list is already scoped to the signed-in customer by the server.
  const visibleAppointments = useMemo(() => {
    const term = search.trim().toLowerCase();

    const result = list.filter((appointment) => {
      if (!term) return true;

      const details = getAppointment(appointment);

      return (
        details.serviceName.toLowerCase().includes(term) ||
        details.category.toLowerCase().includes(term)
      );
    });

    if (sort === "price-asc") {
      result.sort(
        (a, b) =>
          Number(getAppointment(a).price ?? 0) -
          Number(getAppointment(b).price ?? 0)
      );
    } else if (sort === "price-desc") {
      result.sort(
        (a, b) =>
          Number(getAppointment(b).price ?? 0) -
          Number(getAppointment(a).price ?? 0)
      );
    }

    return result;
  }, [list, search, sort]);

  useEffect(() => {
    if (!selected) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelected(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected]);

  const handleAction = async (appointment, action) => {
    const appointmentId = appointment._id || appointment.id;

    if (!appointmentId) {
      toast.error("Appointment ID is missing.");
      return;
    }

    if (action === "cancel") {
      const confirmed = await confirmAction({
        title: "Cancel this appointment?",
        description:
          "This will cancel your pending appointment request. This action cannot be undone.",
        confirmLabel: "Yes, cancel",
        cancelLabel: "Keep appointment",
        tone: "danger",
      });

      if (!confirmed) return;
    }

    const key = `${appointmentId}:${action}`;
    setActionKey(key);
    setActionError("");

    let keepProcessing = false;

    try {
      if (action === "pay") {
        const checkoutUrl = await createCheckoutSession(appointmentId);

        keepProcessing = true;
        toast.info("Redirecting to Stripe Checkout...");
        window.location.assign(checkoutUrl);
        return;
      }

      const result = await changeAppointment(appointmentId, action);

      toast.success(
        result?.message ||
          (action === "cancel"
            ? "Appointment cancelled successfully."
            : "Payment successful.")
      );

      setSelected(null);
      router.refresh();
    } catch (error) {
      console.error("Appointment action error:", error);

      let message = getErrorMessage(error, "Unable to update appointment.");

      if (isUnauthorizedError(error)) {
        message = "Your session has expired. Please sign in again.";
        toast.error(message);
        router.push(`/sign-in?error=${encodeURIComponent(message)}`);
        return;
      }

      if (isBlockedError(error)) {
        message =
          "Your account has been blocked. Please contact the administrator.";
        toast.error(message);
        router.push("/blocked");
        return;
      }

      if (isForbiddenError(error)) {
        message = "You do not have permission to update this appointment.";
        toast.error(message);
        router.push(
          `/unauthorized?reason=appointment&error=${encodeURIComponent(message)}`
        );
        return;
      }

      if (isConflictError(error)) {
        message =
          "This appointment was already updated. Please refresh the page to see the latest status.";
      }

      setActionError(message);
      toast.error(message);
    } finally {
      if (!keepProcessing) {
        setActionKey("");
      }
    }
  };

  if (error) {
    return (
      <>
        <ToastOnMount
          type="error"
          message={error}
          id={`customer-appointments-error:${error}`}
        />
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {error}
        </div>
      </>
    );
  }

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-rose-200 bg-white px-5 py-12 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          No appointments yet
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Your appointment requests will appear here.
        </p>
        <Link
          href="/services"
          className="mt-5 inline-flex rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <>
      {actionError ? (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {actionError}
        </div>
      ) : null}

      {/* Search by service name + price sorting */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search appointments by service name..."
            aria-label="Search appointments by service name"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          aria-label="Sort appointments by service price"
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-rose-400 sm:min-w-52"
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {visibleAppointments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-rose-200 bg-white px-5 py-12 text-center">
          <Search className="mx-auto text-rose-300" size={36} />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No matching appointments
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Try another service name or clear the filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSort("default");
            }}
            className="mt-5 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            Clear filters
          </button>
        </div>
      ) : (
      <div className="grid gap-5">
        {visibleAppointments.map((appointment, index) => {
          const details = getAppointment(appointment);
          const statusKey = String(details.status).toLowerCase();
          const paymentKey = String(details.paymentStatus).toLowerCase();
          const isPending = statusKey === "pending";
          const isConfirmed = statusKey === "confirmed";
          const isPaid = paymentKey === "paid";
          const appointmentId = appointment._id || appointment.id;
          const cancelKey = `${appointmentId}:cancel`;
          const payKey = `${appointmentId}:pay`;
          const isCancelling = actionKey === cancelKey;
          const isPaying = actionKey === payKey;

          return (
            <article
              key={appointmentId || index}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              <div className="flex flex-col gap-4 p-5 sm:flex-row">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-rose-50">
                  {details.serviceImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={details.serviceImage}
                      alt={details.serviceName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Scissors className="size-8 text-rose-300" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {details.serviceName}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {details.category}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Pill tone="status">{details.status}</Pill>
                      <Pill tone="payment">{details.paymentStatus}</Pill>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <InfoItem
                      icon={CalendarDays}
                      label="Appointment Date"
                      value={formatDate(details.date)}
                    />
                    <InfoItem
                      icon={Clock}
                      label="Time"
                      value={formatTime(details.time)}
                    />
                    <InfoItem
                      icon={CreditCard}
                      label="Service Price"
                      value={formatPrice(details.price)}
                    />
                    <InfoItem
                      icon={CalendarDays}
                      label="Requested On"
                      value={formatDate(details.requestDate)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t bg-gray-50/70 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setSelected(appointment)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <Eye className="size-4" />
                  View Details
                </button>

                {isPending ? (
                  <button
                    type="button"
                    onClick={() => handleAction(appointment, "cancel")}
                    disabled={Boolean(actionKey)}
                    className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCancelling ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <X className="size-4" />
                    )}
                    {isCancelling ? "Cancelling..." : "Cancel Appointment"}
                  </button>
                ) : null}

                {isConfirmed && !isPaid ? (
                  <button
                    type="button"
                    onClick={() => handleAction(appointment, "pay")}
                    disabled={Boolean(actionKey)}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPaying ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <CreditCard className="size-4" />
                    )}
                    {isPaying ? "Redirecting..." : "Pay Now"}
                  </button>
                ) : null}

                <span className="ml-auto text-xs text-gray-500">
                  Payment Status:{" "}
                  <span
                    className={
                      isPaid
                        ? "font-semibold text-emerald-600"
                        : "font-semibold text-amber-600"
                    }
                  >
                    {details.paymentStatus}
                  </span>
                </span>
              </div>
            </article>
          );
        })}
      </div>
      )}

      {isProcessingPayment ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50">
              <Loader2 className="size-7 animate-spin text-emerald-600" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Redirecting to secure checkout
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Connecting to Stripe to process your payment. Please do not close
              or refresh this page.
            </p>
          </div>
        </div>
      ) : null}

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-details-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                  Appointment Details
                </p>
                <h2
                  id="appointment-details-title"
                  className="mt-2 text-xl font-bold text-gray-900"
                >
                  {getAppointment(selected).serviceName}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {getAppointment(selected).category}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close appointment details"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <DetailRow
                icon={CalendarDays}
                label="Appointment Date"
                value={formatDate(getAppointment(selected).date)}
              />
              <DetailRow
                icon={Clock}
                label="Appointment Time"
                value={formatTime(getAppointment(selected).time)}
              />
              <DetailRow
                icon={CreditCard}
                label="Service Price"
                value={formatPrice(getAppointment(selected).price)}
              />
              <DetailRow
                icon={CalendarDays}
                label="Request Date"
                value={formatDateTime(getAppointment(selected).requestDate)}
              />
              <DetailRow
                icon={UserRound}
                label="Customer Name"
                value={
                  selected.customerName ||
                  selected.name ||
                  selected.customer?.name
                }
              />
              <DetailRow
                icon={Mail}
                label="Customer Email"
                value={
                  selected.customerEmail ||
                  selected.email ||
                  selected.customer?.email
                }
              />
              <DetailRow
                icon={Phone}
                label="Phone"
                value={
                  selected.customerPhone ||
                  selected.phone ||
                  selected.customer?.phone
                }
              />
              <DetailRow
                icon={MapPin}
                label="Address"
                value={selected.address || selected.customer?.address}
              />
            </div>

            <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Status
                </span>
                <Pill tone="status">{getAppointment(selected).status}</Pill>
                <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Payment
                </span>
                <Pill tone="payment">
                  {getAppointment(selected).paymentStatus}
                </Pill>
              </div>

              <div className="mt-4 flex items-start gap-2">
                <FileText className="mt-0.5 size-4 shrink-0 text-rose-500" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-400">
                    Notes
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {selected.notes ||
                      selected.specialRequests ||
                      "No additional notes."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CustomerAppointments;
