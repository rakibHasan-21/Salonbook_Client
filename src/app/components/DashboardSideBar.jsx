"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, UserRound } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menus = [
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

export function DashboardSideBar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="px-5 py-6">
        <Link href="/dashboard/customer">
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            SalonBook
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Customer Dashboard
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
              const active =
                item.url === "/dashboard/customer"
                  ? pathname === item.url
                  : pathname.startsWith(item.url);

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className="h-11 rounded-xl px-3 transition-all"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
