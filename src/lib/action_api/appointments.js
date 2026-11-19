const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const getCustomerDashboardStats = async () => {
  const response = await fetch(
    `${API_URL}/customer/dashboard-stats`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  return response.json();
};


// getCustomerAppointments

export const getCustomerAppointments = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/customer/appointments`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return response.json();
};