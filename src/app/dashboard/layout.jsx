
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSideBar } from "../components/DashboardSideBar";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <DashboardSideBar />

      <main className="min-w-0 flex-1">
        <div className="p-3">
          <SidebarTrigger />
        </div>

        {children}
      </main>
    </SidebarProvider>
  );
}
