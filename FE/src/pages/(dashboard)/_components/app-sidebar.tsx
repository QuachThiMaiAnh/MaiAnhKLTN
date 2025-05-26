"use client";

import Logo from "@/assets/logo_no_text.png";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { PiChatCentered } from "react-icons/pi";
import { TbFileDescription } from "react-icons/tb";

import { useUser } from "@clerk/clerk-react";
import {
  Book,
  File,
  Grip,
  Image,
  LayoutDashboard,
  LayoutPanelLeft,
  ShoppingCart,
  Sliders,
  Ticket,
  User,
} from "lucide-react";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

// This is sample data.
// const { user } = useUser();
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Thống kê",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: false,
    },
    {
      title: "Sản phẩm",
      url: "#",
      icon: File,
      items: [
        {
          title: "Danh sách",
          url: "/admin/products",
        },
        {
          title: "Thêm sản phẩm",
          url: "/admin/products/add",
        },
      ],
    },
    {
      title: "Danh mục",
      url: "/admin/categories",
      icon: LayoutPanelLeft,
    },
    {
      title: "Thuộc tính",
      url: "/admin/attributes",
      icon: Grip,
    },
    {
      title: "Voucher",
      url: "/admin/voucher",
      icon: Ticket,
    },
    {
      title: "Đơn hàng",
      url: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Người dùng",
      url: "/admin/users",
      icon: User,
    },
    {
      title: "Bài viết",
      url: "/admin/blogs",
      icon: Book,
    },
    {
      title: "Sliders",
      url: "/admin/sliders",
      icon: Sliders,
    },
    {
      title: "Logos",
      url: "/admin/Logos",
      icon: Image,
    },
    {
      title: "Tin nhắn",
      url: "/admin/message",
      icon: PiChatCentered,
    },
    {
      title: "Đánh giá",
      url: "/admin/testimonial",
      icon: TbFileDescription,
    },
    // {
    //   title: "Settings",
    //   url: "/dashboard/settings",
    //   icon: Settings,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const dataUser = React.useMemo(() => {
    return {
      name: user?.fullName || "Admin",
      avatar: user?.imageUrl || "https://github.com/shadcn.png",
      email: user?.primaryEmailAddress?.emailAddress || "admin@gmail.com",
    };
  }, [user]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 p-1 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <img src={Logo} alt="Logo" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">FabricFocus</span>
                  <span className="truncate text-xs">Quản trị</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={dataUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
