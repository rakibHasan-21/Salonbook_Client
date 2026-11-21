import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSideBar } from "../components/DashboardSideBar";

export default async function DashboardLayout({ children }) {
  let session = null;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    session = null;
  }

  if (!session?.user) {
    redirect(
      "/sign-in?error=Please%20sign%20in%20to%20access%20your%20dashboard."
    );
  }

  return (
    <SidebarProvider>
      <DashboardSideBar role={session.user.role} />

      <div className="min-w-0 flex-1">
        <div className="p-3">
          <SidebarTrigger />
        </div>

        {children}
      </div>
    </SidebarProvider>
  );
}
