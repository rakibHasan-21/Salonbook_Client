
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const readBody = async (response) => {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const adminRequest = async (path, options = {}) => {
  if (!API_URL) {
    throw new Error("Services API is not configured.");
  }

  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error(error?.message || "Unable to get an access token.");
  }

const isFormData = options.body instanceof FormData;

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
        Authorization: `Bearer ${data.token}`,
      },
      cache: "no-store",
    });
  } catch {
    throw new Error("Unable to reach the services API.");
  }

  const body = await readBody(response);

  if (!response.ok) {
    throw new Error(
      body?.message || `Request failed with status ${response.status}.`
    );
  }

  return body;
};

export const getAdminServices = async () => {
  const body = await adminRequest("/admin/services");

  return Array.isArray(body?.services) ? body.services : [];
};

export const createAdminService = (payload) =>
  adminRequest("/admin/services", {
    method: "POST",
    body:
      payload instanceof FormData
        ? payload
        : JSON.stringify(payload),
  });

export const updateAdminService = (id, payload) =>
  adminRequest(`/admin/services/${id}`, {
    method: "PATCH",
    body:
      payload instanceof FormData
        ? payload
        : JSON.stringify(payload),
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
