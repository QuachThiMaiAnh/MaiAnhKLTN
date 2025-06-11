import React, { createContext, useContext, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext<{
  getToken: () => Promise<string | null>; // Hàm lấy token từ Clerk
  signOut: () => void; // Hàm đăng xuất người dùng
  isSignedIn: boolean; // Trạng thái đăng nhập của người dùng
} | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getToken, signOut, isSignedIn } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!isSignedIn) return; // Không cần kiểm tra nếu chưa đăng nhập

        const token = await getToken(); // Lấy token
        // console.log("Token:", token);
        if (!token) {
          toast({
            variant: "destructive",
            title: "Lỗi!",
            description: "Phiên làm việc không tồn tại, đăng xuất...",
          });
          localStorage.removeItem("userRole");
          return signOut(); // Đăng xuất nếu không có token
        }

        const [, payload] = token.split(".");
        const decoded = JSON.parse(atob(payload)); // Giải mã token payload

        if (decoded.exp * 1000 < Date.now()) {
          toast({
            variant: "destructive",
            title: "Lỗi!",
            description: "Phiên làm việc đã hết hạn, đăng xuất...",
          });
          localStorage.removeItem("userRole");
          return signOut(); // Đăng xuất nếu token hết hạn
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra phiên hoạt động:", error);
        toast({
          variant: "destructive",
          title: "Lỗi!",
          description: "Lỗi xảy ra khi kiểm tra phiên, đăng xuất...",
        });
        localStorage.removeItem("userRole");
        signOut(); // Đăng xuất khi gặp lỗi
      }
    };

    checkSession(); // Kiểm tra ngay lập tức

    const interval = setInterval(checkSession, 60000); // Kiểm tra định kỳ mỗi phút

    return () => clearInterval(interval); // Dọn dẹp interval
  }, [isSignedIn, getToken, signOut]);

  return (
    <AuthContext.Provider
      value={{ getToken, signOut, isSignedIn: isSignedIn ?? false }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext phải được sử dụng trong AuthProvider!");
  }
  return context;
};
