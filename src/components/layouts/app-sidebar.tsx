"use client"

import * as React from "react"
import {
  AppWindowMac,
  SquareTerminal,
  Users,
  Target,
  Store,
  Package,
  Bell,
  HelpCircle,
  Truck,
  Ticket,
  Zap,
  UserCheck,
} from "lucide-react"

import { NavMain } from "@/components/layouts/nav-main"
import { NavUser } from "@/components/layouts/nav-user"
import { authClient } from "@/lib/auth-client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { data: session } = authClient.useSession();

  const data = {
    user: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      avatar: session?.user?.image || "",
    },
    navMainAdmin: [
      {
        title: "Bảng điều khiển",
        url: "/admin/dashboard",
        icon: SquareTerminal,
        isActive: true,
      },
    ]
  }

  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "ADMIN";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="items-start">
        {isAdmin && <Image src="/images/logo.svg" alt="logo" width={100} height={100} />}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={
          data.navMainAdmin
        } />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
