"use client"

import * as React from "react"
import {
  AppWindowMac,
  SquareTerminal,
  Users,
  Target,
  Store,
  Package,
  ShoppingCart,
  Warehouse,
  Percent,
  BarChart3,
  Settings,
  Star,
  Bell,
  HelpCircle,
  Truck,
  Ticket,
  Video,
  Zap,
  UserCheck,
  FileText,
  DollarSign,
  MessageSquare,
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
      {
        title: "Cửa hàng",
        url: "/admin/stores",
        icon: Store,
      },
      {
        title: "Sản phẩm",
        url: "/admin/products",
        icon: Package,
        items: [
          {
            title: "Danh sách",
            url: "/admin/products",
          },
          {
            title: "Chờ duyệt",
            url: "/admin/products?status=PENDING_APPROVAL",
          },
        ]
      },
      {
        title: "Danh mục ",
        url: "/admin/categories",
        icon: AppWindowMac,
        items: [
          {
            title: "Danh sách",
            url: "/admin/categories",
          },
          {
            title: "Thêm mới",
            url: "/admin/categories/new",
          },
        ]
      },
      {
        title: "Banner",
        url: "/admin/banners",
        icon: AppWindowMac,
        items: [
          {
            title: "Danh sách",
            url: "/admin/banners",
          },
          {
            title: "Thêm mới",
            url: "/admin/banners/new",
          },
        ]
      },
      {
        title: "Chiến dịch",
        url: "/admin/campaigns",
        icon: Target,
        items: [
          {
            title: "Danh sách",
            url: "/admin/campaigns",
          },
          {
            title: "Thêm mới",
            url: "/admin/campaigns/new",
          },
        ]
      },
      {
        title: "Tài khoản",
        url: "/admin/users",
        icon: Users,
        items: [
          {
            title: "Danh sách",
            url: "/admin/users",
          },
          {
            title: "Thêm mới",
            url: "/admin/users/new",
          },
        ]
      },
      {
        title: "Vận chuyển",
        url: "/admin/shipping",
        icon: Truck,
        items: [
          {
            title: "Tổng quan",
            url: "/admin/shipping",
          },
          {
            title: "Nhà vận chuyển",
            url: "/admin/shipping/providers",
          },
          {
            title: "Biểu giá",
            url: "/admin/shipping/rates",
          },
          {
            title: "Đơn hàng",
            url: "/admin/shipping/shipments",
          },
        ]
      },
      {
        title: "Coupon",
        url: "/admin/coupons",
        icon: Ticket,
        items: [
          {
            title: "Danh sách",
            url: "/admin/coupons",
          },
          {
            title: "Thêm mới",
            url: "/admin/coupons/new",
          },
        ]
      },
      {
        title: "Flash Sale",
        url: "/admin/flash-sales",
        icon: Zap,
        items: [
          {
            title: "Danh sách",
            url: "/admin/flash-sales",
          },
          {
            title: "Thêm mới",
            url: "/admin/flash-sales/new",
          },
        ]
      },
      {
        title: "Affiliate",
        url: "/admin/affiliates",
        icon: UserCheck,
        items: [
          {
            title: "Danh sách",
            url: "/admin/affiliates",
          },
          {
            title: "Thêm mới",
            url: "/admin/affiliates/new",
          },
          {
            title: "Hoa hồng",
            url: "/admin/affiliates/commissions",
          },
        ]
      },
      {
        title: "Hỗ trợ",
        url: "/admin/support",
        icon: HelpCircle,
        items: [
          {
            title: "FAQ",
            url: "/admin/support/faq",
          },
          {
            title: "Tickets",
            url: "/admin/support/tickets",
          },
        ]
      },
      {
        title: "Thông báo",
        url: "/admin/notifications",
        icon: Bell,
        items: [
          {
            title: "Templates",
            url: "/admin/notifications/templates",
          },
          {
            title: "Gửi thông báo",
            url: "/admin/notifications/send",
          },
        ]
      }
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
