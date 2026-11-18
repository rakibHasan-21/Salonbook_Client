const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const getServicesFeatured = async () => {
  const res = await fetch(
    `${API_URL}/services/Featured`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  return res.json();
};
// servicrs Api

export const getServices = async () => {
  const res = await fetch(`${API_URL}/services`);

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  return res.json();
};

// Service Details Page Dynamic route 

export const getServiceById = async (id) => {
  const res = await fetch(
    `${API_URL}/services/${id}`
  );

  if (!res.ok) {
    throw new Error("Service not found");
  }

  return res.json();
};