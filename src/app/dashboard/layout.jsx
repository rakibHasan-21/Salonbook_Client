
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Check authentication
  if (!session?.user) {
    redirect("/sign-in");
  }

  // Check blocked user
  if (session.user.isBlocked === true) {
    redirect("/blocked");
  }

  return <>{children}</>;
}
