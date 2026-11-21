import { ApiError, apiFetch } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const profileRequest = async (path, token, options = {}) => {
  if (!API_URL) {
    throw new ApiError("Profile API is not configured.", { code: "CONFIG" });
  }

  if (!token) {
    throw new ApiError("Your session has expired. Please sign in again.", {
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
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
};

// Get the signed-in user's profile (customer or admin).
export const getProfile = (token) => profileRequest("/profile", token);

// Update the signed-in user's own profile. The backend ignores/rejects any
// attempt to change role, blocked status, email or another user's record.
export const updateProfile = (token, profile) =>
  profileRequest("/profile", token, {
    method: "PATCH",
    body: JSON.stringify(profile),
  });

// Upload a new profile image. Returns { success, message, image }.
export const uploadProfileImage = (token, file) => {
  const formData = new FormData();
  formData.append("image", file);

  return profileRequest("/profile/image", token, {
    method: "POST",
    body: formData,
  });
};

// Backwards-compatible aliases for existing customer profile imports.
export const getCustomerProfile = getProfile;
export const updateCustomerProfile = updateProfile;
