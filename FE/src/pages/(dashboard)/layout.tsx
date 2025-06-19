import { useUserContext } from "@/common/context/UserProvider";
import { saveUserToDatabase } from "@/common/hooks/useCheckUser";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "./_components/app-sidebar";
import NotificationList from "./notifications/_components/ListNotifications";

const LayoutAdmin = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  // const { _id } = useUserContext();
  const isUserSaved = useRef(false);
  const { login } = useUserContext();

  // const { role } = useUserContext();

  useEffect(() => {
    if (!isLoaded) {
      // Chờ đến khi user được tải xong
      return;
    }

    const userRole = localStorage.getItem("userRole");
    // Kiểm tra quyền truy cập
    if (userRole === "Admin") {
      // Xác nhận quyền truy cập
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      navigate("*", { replace: true });
    }
  }, [user, isLoaded, navigate]);

  useEffect(() => {
    if (user) {
      // Gọi saveUserToDatabase một lần
      const saveUserIfNeeded = async () => {
        if (user && !isUserSaved.current) {
          try {
            const data = await saveUserToDatabase(user.id);
            // console.log("data", data);
            login(data); // Lưu _id vào context
            isUserSaved.current = true; // Đánh dấu đã lưu
          } catch (error) {
            console.error("Lỗi khi lưu user vào database:", error);
          }
        }
      };
      // Kiểm tra trạng thái khóa khi người dùng đăng nhập
      saveUserIfNeeded();
    }
  }, [user, login]);

  // Trì hoãn render giao diện khi đang kiểm tra quyền truy cập
  if (!isLoaded || !isAuthorized) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center text-gray-500">
        {/* <div className="spinner"></div> */}
      </div>
    );
  }

  // console.log("user", user);

  // Nếu đã xác thực quyền truy cập, render giao diện
  return (
    // <div className="bg-white flex min-h-screen">
    //   <Sidebar />
    //   <div className="w-full">
    //     <div className="h-20 bg-red-400"></div>
    //     <div className="bg-slate-300 rounded-lg m-7 min-h-80">
    //       <Outlet />
    //     </div>
    //   </div>
    // </div>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>{" "}
          <NotificationList />
        </header>

        <div className="flex flex-1 flex-col gap-4 pt-0">
          <div className="w-full bg-[#f1f5f9] h-full">
            {/* <div className="h-20 bg-red-400"></div> */}
            <div className="rounded-lg m-7 min-h-80">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default LayoutAdmin;
