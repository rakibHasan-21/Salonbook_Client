const API_URL = process.env.NEXT_PUBLIC_API_URL;

const parseResponse = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
};

export const getProfile = async (token) => {
  const response = await fetch(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseResponse(response, "Failed to fetch profile");
};

// Get Customer Profile
export const getCustomerProfile = async (token) => {
  const response = await fetch(`${API_URL}/customer/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseResponse(response, "Failed to fetch profile");
};

// Update Customer Profile
export const updateCustomerProfile = async (token, profile) => {
  const response = await fetch(`${API_URL}/customer/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });

  return parseResponse(response, "Failed to update profile");
};
