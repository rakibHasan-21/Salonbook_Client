"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  Home,
  LayoutDashboard,
  LogOut,
  Scissors,
  UserRound,
  Users,
  Receipt
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const customerMenus = [
  {
    title: "Overview",
    url: "/dashboard/customer",
    icon: LayoutDashboard,
  },
  {
    title: "My Appointments",
    url: "/dashboard/customer/appointments",
    icon: CalendarDays,
  },
  {
    title: "My Profile",
    url: "/dashboard/customer/profile",
    icon: UserRound,
  },
];

const adminMenus = [
  {
    title: "Overview",
    url: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Services",
    url: "/dashboard/admin/services",
    icon: Scissors,
  },
  {
  title: "Manage Appointments",
  url: "/dashboard/admin/appointments",
  icon: CalendarDays,
},
{
  title: "Manage Users",
  url: "/dashboard/admin/users",
  icon: Users,
},
{
  title: "Transactions",
  url: "/dashboard/admin/transactions",
  icon: Receipt,
}
];

export function DashboardSideBar({ role = "customer" }) {
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = role === "admin";
  const menus = isAdmin ? adminMenus : customerMenus;
  const dashboardHref = isAdmin ? "/dashboard/admin" : "/dashboard/customer";

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <Sidebar>
      <SidebarHeader className="px-5 py-6">
        <Link href={dashboardHref}>
          <h2 className="text-2xl font-bold tracking-tight text-rose-600">
            SalonBook
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {isAdmin ? "Admin Dashboard" : "Customer Dashboard"}
          </p>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroupLabel className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider">
          Menu
        </SidebarGroupLabel>

        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {menus.map((item) => {
              const active = pathname === item.url;

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    isActive={active}
                    className="h-11 rounded-xl px-3 transition-all"
                    render={<Link href={item.url} />}
                  >
                    <item.icon className="size-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-11 rounded-xl px-3"
              render={<Link href="/" />}
            >
              <Home className="size-5" />
              <span className="font-medium">Back to Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-11 rounded-xl px-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              onClick={handleLogout}
            >
              <LogOut className="size-5" />
              <span className="font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
