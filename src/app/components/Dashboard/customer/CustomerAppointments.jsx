
import React from "react";

const CustomerAppointments = ({ appointments = [] }) => {
  return (
    <div className="grid gap-5">
      {appointments.map((appointment) => (
        <div
          key={appointment._id}
          className="rounded-xl border bg-white p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold">
            {appointment.serviceName}
          </h2>

          <p>Status: {appointment.status}</p>

          <p>Payment: {appointment.paymentStatus || "Unpaid"}</p>

          <div className="mt-4 flex flex-wrap gap-3">
            {appointment.status === "Pending" && (
              <button className="rounded-lg bg-red-500 px-4 py-2 text-white">
                Cancel Appointment
              </button>
            )}

            {appointment.status === "Confirmed" &&
              appointment.paymentStatus !== "Paid" && (
                <button className="rounded-lg bg-green-600 px-4 py-2 text-white">
                  Pay Now
                </button>
              )}

            <button className="rounded-lg border px-4 py-2">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerAppointments;
