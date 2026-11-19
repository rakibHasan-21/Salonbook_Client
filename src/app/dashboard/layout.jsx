import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSideBar } from "../components/DashboardSideBar";
const layout = ({children}) => {
  return (
    <SidebarProvider>
        <DashboardSideBar></DashboardSideBar>
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default layout;
