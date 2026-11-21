import { cookies } from "next/headers";

import {
  ApiError,
  apiFetch,
  getErrorMessage,
  isUnauthorizedError,
} from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const emptyStats = {
  total: 0,
  pending: 0,
  confirmed: 0,
  cancelled: 0,
};

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};

const customerRequest = async (path) => {
  if (!API_URL) {
    throw new ApiError("Appointments API is not configured.", {
      code: "CONFIG",
    });
  }

  const cookieHeader = await getCookieHeader();

  return apiFetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    cache: "no-store",
  });
};

const toUserMessage = (error, fallback) => {
  if (isUnauthorizedError(error)) {
    return "Your session has expired. Please sign in again.";
  }

  return getErrorMessage(error, fallback);
};

export const getCustomerDashboardStats = async () => {
  try {
    const data = await customerRequest("/customer/dashboard-stats");

    const rawStats =
      data?.stats && typeof data.stats === "object" && !Array.isArray(data.stats)
        ? data.stats
        : data && typeof data === "object" && !Array.isArray(data)
          ? data
          : {};

    return {
      stats: { ...emptyStats, ...rawStats },
      error: null,
    };
  } catch (error) {
    return {
      stats: emptyStats,
      error: toUserMessage(error, "Unable to load dashboard stats."),
    };
  }
};

export const getCustomerAppointments = async () => {
  try {
    const data = await customerRequest("/customer/appointments");

    const appointments = Array.isArray(data)
      ? data
      : Array.isArray(data?.appointments)
        ? data.appointments
        : [];

    return {
      appointments,
      error: null,
    };
  } catch (error) {
    return {
      appointments: [],
      error: toUserMessage(error, "Unable to load appointments."),
    };
  }
};
