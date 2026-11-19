import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export const getCustomerDashboardStats = async () => {
  if (!API_URL) {
    return {
      stats: emptyStats,
      error: "Dashboard API is not configured.",
    };
  }

  try {
    const cookieHeader = await getCookieHeader();

    const response = await fetch(`${API_URL}/customer/dashboard-stats`, {
      method: "GET",
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        stats: emptyStats,
        error: "Unable to load dashboard stats.",
      };
    }

    const data = await response.json();

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
  } catch {
    return {
      stats: emptyStats,
      error: "Unable to load dashboard stats.",
    };
  }
};

export const getCustomerAppointments = async () => {
  if (!API_URL) {
    return {
      appointments: [],
      error: "Appointments API is not configured.",
    };
  }

  try {
    const cookieHeader = await getCookieHeader();

    const response = await fetch(`${API_URL}/customer/appointments`, {
      method: "GET",
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        appointments: [],
        error: "Unable to load appointments.",
      };
    }

    const data = await response.json();

    const appointments = Array.isArray(data)
      ? data
      : Array.isArray(data?.appointments)
        ? data.appointments
        : [];

    return {
      appointments,
      error: null,
    };
  } catch {
    return {
      appointments: [],
      error: "Unable to load appointments.",
    };
  }
};
