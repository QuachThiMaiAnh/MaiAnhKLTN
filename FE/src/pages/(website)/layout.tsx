import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useClerk } from "@clerk/clerk-react";
import axios from "axios";

import { useUserContext } from "@/common/context/UserProvider";
import { saveUserToDatabase } from "@/common/hooks/useCheckUser";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountLockedNotification from "@/components/UserbanError";

const LayoutWebsite = () => {
  const { user } = useUser(); // Lấy thông tin người dùng hiện tại từ Clerk.
  const { signOut } = useClerk(); // Hàm để đăng xuất người dùng.
  const { login } = useUserContext(); // Hàm custom lưu thông tin user vào UserContext sau khi lưu vào database.

  const isUserSaved = useRef(false); // ref để đảm bảo chỉ gọi lưu user vào DB 1 lần
  const [accountStatus, setAccountStatus] = useState<
    "banned" | "deleted" | null
  >(null); //Trạng thái tài khoản: "banned", "deleted" hoặc null.

  const API_URL = import.meta.env.VITE_API_URL;

  // Xóa trạng thái lỗi tài khoản khi người dùng đóng thông báo
  const clearAccountStatus = () => {
    localStorage.removeItem("accountLocked");
    localStorage.removeItem("accountDeleted");
    setAccountStatus(null);
  };

  // Lấy dữ liệu Clerk mở rộng. - Kiểm tra trạng thái tài khoản (bị khóa hoặc bị xóa).
  // userId = id của người dùng được lấy từ Clerk, sau đó gọi API để kiểm tra trạng thái tài khoản.
  const checkAndHandleBanStatus = async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      const data = response.data;
      console.log("Kiểm tra trạng thái tài khoản:", data);

      // Nếu bị khóa (isBanned)	Ghi vào localStorage, cập nhật accountStatus và đăng xuất.
      if (data.clerkData?.isBanned) {
        setAccountStatus("banned");
        localStorage.setItem("accountLocked", "true");
        signOut();
      } else if (data.clerkData?.isDeleted) {
        // Nếu bị xóa (isDeleted)	Ghi vào localStorage, cập nhật accountStatus và đăng xuất.
        setAccountStatus("deleted");
        localStorage.setItem("accountDeleted", "true");
        signOut();
      }
    } catch (error) {
      console.error("Lỗi kiểm tra trạng thái tài khoản:", error);
    }
  };

  const saveUserIfNeeded = async (userId: string) => {
    if (!isUserSaved.current) {
      try {
        // Lưu người dùng vào MongoDB backend
        const data = await saveUserToDatabase(userId);
        // Ghi lại role vào localStorage	Để phân quyền hoặc chuyển hướng sau này.
        if (data.role) {
          localStorage.setItem("userRole", data.role);
        }
        // Lưu thông tin người dùng (_id, cleckId,role) vào context toàn cục.
        login(data);
        // Đánh dấu là đã lưu user để tránh lưu lại nhiều lần.
        isUserSaved.current = true;
      } catch (error) {
        console.error("Lỗi khi lưu user:", error);
      }
    }
  };

  useEffect(() => {
    const localBanStatus = localStorage.getItem("accountLocked");
    const localDeleteStatus = localStorage.getItem("accountDeleted");

    if (localBanStatus === "true") {
      setAccountStatus("banned");
    } else if (localDeleteStatus === "true") {
      setAccountStatus("deleted");
    }

    if (user) {
      checkAndHandleBanStatus(user.id);
      saveUserIfNeeded(user.id);
    }
  }, [user]);

  return (
    <>
      {accountStatus && (
        <AccountLockedNotification onClose={clearAccountStatus} /> // Hiển thị hộp thoại cảnh báo nếu tài khoản bị khóa hoặc xóa.
      )}
      {/*Header của website (logo, menu, v.v).*/}
      <Header />
      {/*Vùng nội dung chính, hiển thị trang con qua <Outlet />.  */}
      <main className="min-h-[calc(100vh-200px)] bg-background text-foreground">
        {/* Dùng với React Router v6 để render route con (vd: /about, /product). */}
        <Outlet />
      </main>
      {/* Chân trang (footer) chứa thông tin liên hệ, bản quyền,... */}
      <Footer />
    </>
  );
};

export default LayoutWebsite;
