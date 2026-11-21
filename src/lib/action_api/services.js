import { ApiError, apiFetch } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const endpoint = (path) => {
  if (!API_URL) {
    throw new ApiError("Services API is not configured.", { code: "CONFIG" });
  }

  return `${API_URL}${path}`;
};

export const getServicesFeatured = () =>
  apiFetch(endpoint("/services/Featured"), { cache: "no-store" });

export const getServices = () =>
  apiFetch(endpoint("/services"), { cache: "no-store" });

export const getServiceById = (id) =>
  apiFetch(endpoint(`/services/${encodeURIComponent(id)}`), {
    cache: "no-store",
  });
