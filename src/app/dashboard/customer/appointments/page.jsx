import CustomerAppointments from "@/app/components/Dashboard/customer/CustomerAppointments";
import { getCustomerAppointments } from "@/lib/action_api/appointments";

const AppointmentsPage = async () => {
  const result = await getCustomerAppointments();

  return (
    <div className="p-5 md:p-8">
      <h1 className="mb-6 text-2xl font-bold">
        My Appointments
      </h1>

      <CustomerAppointments
        appointments={result.appointments || []}
      />
    </div>
  );
};

export default AppointmentsPage;