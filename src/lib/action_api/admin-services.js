import { authClient } from "@/lib/auth-client";
import { ApiError, apiFetch } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const adminRequest = async (path, options = {}) => {
  if (!API_URL) {
    throw new ApiError("Services API is not configured.", { code: "CONFIG" });
  }

  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new ApiError(error?.message || "Unable to get an access token.", {
      status: 401,
      code: "UNAUTHORIZED",
    });
  }

  const isFormData = options.body instanceof FormData;

  return apiFetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      Authorization: `Bearer ${data.token}`,
    },
    cache: "no-store",
  });
};

export const getAdminServices = async () => {
  const body = await adminRequest("/admin/services");

  return Array.isArray(body?.services) ? body.services : [];
};

export const createAdminService = (payload) =>
  adminRequest("/admin/services", {
    method: "POST",
    body: payload instanceof FormData ? payload : JSON.stringify(payload),
  });

export const updateAdminService = (id, payload) =>
  adminRequest(`/admin/services/${id}`, {
    method: "PATCH",
    body: payload instanceof FormData ? payload : JSON.stringify(payload),
  });

export const updateAdminServiceStatus = (id, status) =>
  adminRequest(`/admin/services/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const deleteAdminService = (id) =>
  adminRequest(`/admin/services/${id}`, {
    method: "DELETE",
  });
