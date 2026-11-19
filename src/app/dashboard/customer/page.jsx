import DashboardOverview from "@/app/components/Dashboard/customer/DashboardOverview";
import { getCustomerDashboardStats } from "@/lib/action_api/appointments";

export default async function CustomerDashboard() {
  const result = await getCustomerDashboardStats();

  return (
    <div className="p-5 md:p-8">
      <DashboardOverview stats={result.stats} />
      
    </div>
  );
}