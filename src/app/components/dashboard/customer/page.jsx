import CustomerOverview from "./CustomerOverview";

export const metadata = {
  title: "Customer Overview | SalonBook",
  description: "Review your appointment requests and their current status.",
};

export default function CustomerOverviewPage() {
  // TODO: Pass the customer's appointments once the appointments API is available.
  const appointments = [];

  return <CustomerOverview appointments={appointments} />;
}
