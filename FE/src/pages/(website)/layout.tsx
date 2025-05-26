// import { useChatStore } from "@/common/context/useChatStore";
import { useUserContext } from "@/common/context/UserProvider";
import { saveUserToDatabase } from "@/common/hooks/useCheckUser";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AccountLockedNotification from "@/components/UserbanError";
import { useClerk, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";

// const socket = io("http://localhost:3000");

const LayoutWebsite = () => {
  const { user } = useUser();
  const { login } = useUserContext();
  const { signOut } = useClerk();
  const isUserSaved = useRef(false);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [accountStatus, setAccountStatus] = useState<
    "banned" | "deleted" | null
  >(null);

  // Hàm để kiểm tra trạng thái khóa
  const checkBanStatus = async (userId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/${userId}`
      );
      const data = response.data;
      if (data.clerkData?.isBanned) {
        // Nếu tài khoản bị khóa
        setAccountStatus("banned");
        localStorage.setItem("accountLocked", "true");
        setIsAccountLocked(true);
        signOut();
      } else if (data.clerkData?.isDeleted) {
        // Nếu tài khoản bị xóa
        setAccountStatus("deleted");
        localStorage.setItem("accountDeleted", "true");
        setIsAccountLocked(true);
        signOut();
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái ban:", error);
    }
  };

  useEffect(() => {
    // Kiểm tra trạng thái tài khoản trong localStorage
    if (localStorage.getItem("accountLocked") === "true") {
      setAccountStatus("banned");
      setIsAccountLocked(true);
    } else if (localStorage.getItem("accountDeleted") === "true") {
      setAccountStatus("deleted");
      setIsAccountLocked(true);
    }

    if (user) {
      // console.log("user", user);
      // Gọi saveUserToDatabase một lần
      const saveUserIfNeeded = async () => {
        if (user && !isUserSaved.current) {
          try {
            // Gọi hàm saveUserToDatabase với await
            const data = await saveUserToDatabase(user.id);
            if (data.role) {
              localStorage.setItem("userRole", data.role);
            }
            // console.log("data", data);
            login(data); // Lưu _id vào context

            isUserSaved.current = true; // Đánh dấu đã lưu
          } catch (error) {
            console.error("Lỗi khi lưu user vào database:", error);
          }
        }
      };
      // Kiểm tra trạng thái khóa khi người dùng đăng nhập
      checkBanStatus(user.id);

      saveUserIfNeeded();
    }
  }, [
    user,
    login,
    // setSelectedUser,
    // setSelectedConversation,
    // getMessages,
    // subscribeToMessages,
  ]);

  // useEffect(() => {
  //   socket.on("messageRecieved", (newMessageRecieved) => {
  //     console.log("message Recieved", newMessageRecieved);
  //   });

  //   // return () => {
  //   //   socket.off("newMessage");
  //   // };
  // }, []);

  const clearAccountLockedStatus = () => {
    // Xóa trạng thái từ localStorage và ẩn thông báo
    localStorage.removeItem("accountLocked");
    localStorage.removeItem("accountDeleted");
    setIsAccountLocked(false);
    setAccountStatus(null);
  };

  return (
    <>
      {(isAccountLocked || accountStatus) && (
        <AccountLockedNotification onClose={clearAccountLockedStatus} />
      )}
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default LayoutWebsite;

// useEffect(() => {
//   if (!selectedUser) return;
//   getMessages(selectedUser!);

//   subscribeToMessages();

//   return () => unsubscribeFromMessages();
// }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);
