import { ApiError, apiFetch } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const endpoint = (path) => {
  if (!API_URL) {
    throw new ApiError("Services API is not configured.", { code: "CONFIG" });
  }

  return `${API_URL}${path}`;
};

const buildServiceQuery = (params = {}) => {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", String(params.search).trim());
  }

  if (params.category && params.category !== "all") {
    searchParams.set("category", String(params.category));
  }

  if (params.sort && params.sort !== "default") {
    searchParams.set("sort", String(params.sort));
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
};

export const getServicesFeatured = (params = {}) =>
  apiFetch(endpoint(`/services/Featured${buildServiceQuery(params)}`), {
    cache: "no-store",
  });

export const getServices = (params = {}) =>
  apiFetch(endpoint(`/services${buildServiceQuery(params)}`), {
    cache: "no-store",
  });

export const getServiceById = (id) =>
  apiFetch(endpoint(`/services/${encodeURIComponent(id)}`), {
    cache: "no-store",
  });
