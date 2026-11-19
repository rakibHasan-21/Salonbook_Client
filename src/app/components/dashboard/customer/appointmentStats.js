const STATUS_ALIASES = {
  pending: "pending",
  confirmed: "confirmed",
  cancelled: "cancelled",
  canceled: "cancelled",
};

export const normalizeAppointmentStatus = (status) =>
  String(status ?? "").trim().toLowerCase();

export const getAppointmentStats = (appointments) => {
  const list = Array.isArray(appointments) ? appointments : [];

  const counts = list.reduce(
    (totals, appointment) => {
      const status =
        STATUS_ALIASES[normalizeAppointmentStatus(appointment?.status)];

      if (status) {
        totals[status] += 1;
      }

      return totals;
    },
    { pending: 0, confirmed: 0, cancelled: 0 }
  );

  return {
    total: list.length,
    ...counts,
  };
};
