"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CalendarDays, Clock, CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function AppointmentBookingForm({ service }) {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [customerMessage, setCustomerMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!session?.user) {
      router.push(
        `/sign-in?callbackURL=${encodeURIComponent(
          `/services/${service._id}/booking`,
        )}`,
      );
      return;
    }

    if (session.user.role === "admin") {
      setError("Admin users cannot book appointments.");
      return;
    }

    if (!appointmentDate || !appointmentTime) {
      setError("Please select appointment date and time.");
      return;
    }

    if (appointmentDate < getToday()) {
      setError("Please select today or a future date.");
      return;
    }

    if (!API_URL) {
      setError("API URL is not configured.");
      return;
    }

    try {
      setLoading(true);

      const tokenResult = await authClient.token();

      console.log("TOKEN RESULT:", tokenResult);
      const token =
        tokenResult?.data?.token ||
        tokenResult?.token ||
        tokenResult?.data?.accessToken;

      if (!token) {
        throw new Error(
          "Authentication token not found. Please sign in again.",
        );
      }
      console.log("TOKEN RESULT:", tokenResult);
      console.log("TOKEN:", token ? "Token received" : "Token missing");

      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: service._id,
          appointmentDate,
          appointmentTime,
          customerMessage: customerMessage.trim(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Failed to book appointment. Please try again.",
        );
      }

      setSuccess(true);
      setAppointmentDate("");
      setAppointmentTime("");
      setCustomerMessage("");
    } catch (err) {
      console.error("APPOINTMENT BOOKING ERROR:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="mt-10 flex justify-center rounded-3xl bg-white p-8">
        <Loader2 className="animate-spin text-rose-600" />
      </div>
    );
  }

  return (
    <section
      id="booking"
      className="mt-10 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6">
        <span className="text-sm font-semibold uppercase tracking-wider text-rose-600">
          Book your visit
        </span>

        <h2 className="mt-2 text-2xl font-bold text-gray-900">
          Book Your Appointment
        </h2>

        <p className="mt-2 text-gray-500">
          Schedule your appointment for {service.serviceName}.
        </p>
      </div>

      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2 font-semibold text-green-700">
            <CheckCircle2 size={20} />
            Appointment booked successfully!
          </div>

          <p className="mt-1 text-sm text-green-700">
            Your booking request has been submitted. You can check its status in
            My Appointments.
          </p>

          <Link
            href="/dashboard/customer/appointments"
            className="mt-3 inline-block font-semibold text-green-800 underline"
          >
            Go to My Appointments
          </Link>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleBooking} className="space-y-5">
        <div>
          <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
            <CalendarDays size={18} className="text-rose-600" />
            Appointment Date
          </label>

          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            min={getToday()}
            required
            className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
            <Clock size={18} className="text-rose-600" />
            Appointment Time
          </label>

          <select
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
          >
            <option value="">Select a time</option>

            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Message <span className="text-gray-400">(Optional)</span>
          </label>

          <textarea
            value={customerMessage}
            onChange={(e) => setCustomerMessage(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Write any special request or message..."
            className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
          />

          <p className="mt-1 text-right text-xs text-gray-400">
            {customerMessage.length}/500
          </p>
        </div>

        <div className="rounded-xl bg-rose-50 p-4">
          <p className="text-sm text-gray-500">Service</p>
          <p className="font-semibold text-gray-900">{service.serviceName}</p>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-500">Service Price</span>
            <span className="text-xl font-bold text-rose-600">
              ${service.price}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !appointmentDate || !appointmentTime}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-3.5 font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Booking...
            </>
          ) : (
            "Continue Booking"
          )}
        </button>
      </form>
    </section>
  );
}
