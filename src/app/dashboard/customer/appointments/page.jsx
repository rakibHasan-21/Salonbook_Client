import CustomerAppointments from "@/app/components/Dashboard/customer/CustomerAppointments";
import { getCustomerAppointments } from "@/lib/action_api/appointments";

export const dynamic = "force-dynamic";

const AppointmentsPage = async ({ searchParams }) => {
  const params = (await searchParams) || {};
  const status = params.status;

  const result = await getCustomerAppointments();

  let appointments = result.appointments || [];

  if (status) {
    const normalizedStatus = String(status).toLowerCase();
    appointments = appointments.filter(
      (appointment) =>
        String(appointment.status || "").toLowerCase() === normalizedStatus
    );
  }

  return (
    <div className="p-5 md:p-8">
      <h1 className="mb-6 text-2xl font-bold">My Appointments</h1>

      <CustomerAppointments
        appointments={appointments}
        error={result.error}
      />
    </div>
  );
};

export default AppointmentsPage;
