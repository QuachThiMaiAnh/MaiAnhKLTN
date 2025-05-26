"use client";

import { ChevronsUpDown, LogOut, Settings, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import EditUserForm from "../user/_component/UpdateUser";

export function NavUser({
  user,
  onUpdateUser,
}: {
  user: any;
  onUpdateUser: (updatedUser: any) => void;
}) {
  const { user: clerkUser } = useUser();
  const clerkId = clerkUser?.id || "";
  const { isMobile } = useSidebar();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<any>({
    ...user,
    clerkId,
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  setCurrentUserData({
                    ...user,
                    clerkId,
                    firstName: clerkUser?.firstName || "",
                    lastName: clerkUser?.lastName || "",
                    password: "",
                  });
                  setIsEditModalOpen(true);
                }}
                className="cursor-pointer"
              >
                <div className="flex cursor-pointer gap-x-2">
                  <Settings />
                  Chỉnh sửa thông tin
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link to={"/"}>
                  <div className="flex cursor-pointer gap-x-2">
                    <Sparkles />
                    Trở lại trang chủ
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            {/* <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                localStorage.removeItem("userRole");
              }}
            >
              <SignOutButton redirectUrl="/">
                <div className="flex cursor-pointer gap-x-2">
                  <LogOut />
                  Đăng xuất
                </div>
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      {/* Modal chỉnh sửa thông tin */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 px-3">
          <div className="bg-white rounded-lg shadow-lg w-[500px] max-w-[600px] p-3">
            <EditUserForm
              userData={currentUserData}
              onClose={() => setIsEditModalOpen(false)}
              onSuccess={(updatedUser) => {
                setIsEditModalOpen(false);
                setCurrentUserData(updatedUser);
                onUpdateUser(updatedUser);
              }}
            />
          </div>
        </div>
      )}
    </SidebarMenu>
  );
}
