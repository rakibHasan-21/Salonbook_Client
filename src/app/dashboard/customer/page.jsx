import DashboardOverview from "@/app/components/Dashboard/customer/DashboardOverview";
import { getCustomerDashboardStats } from "@/lib/action_api/appointments";

export const dynamic = "force-dynamic";

export default async function CustomerDashboard() {
  const result = await getCustomerDashboardStats();

  return (
    <div className="p-5 md:p-8">
      <DashboardOverview stats={result.stats} error={result.error} />
    </div>
  );
}
