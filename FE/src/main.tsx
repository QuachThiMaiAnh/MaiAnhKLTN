// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "swiper/css";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ClerkProvider } from "@clerk/clerk-react";
import { UserInfoProvider } from "./common/context/UserProvider.tsx";
import { AuthProvider } from "./common/context/AuthContext.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000,
      refetchOnWindowFocus: true,
    },
  },
});

const localization = {
  signIn: {
    start: {
      title: "Đăng nhập vào FabricFocus",
      subtitle: "Chào mừng bạn trở lại! Vui lòng đăng nhập để tiếp tục",
      actionText: "Hoặc đăng nhập bằng email",
    },
    emailCode: {
      title: "Nhập mã xác minh",
      subtitle: "Chúng tôi đã gửi mã tới email của bạn",
    },
  },
  signUp: {
    start: {
      title: "Tạo tài khoản FabricFocus",
      subtitle: "Vui lòng nhập thông tin để bắt đầu",
    },
  },
  socialButtonsBlockButton: "Đăng nhập với {{provider|titleize}}",
  formFieldLabel__emailAddress: "Địa chỉ email",
  formButtonPrimary: "Tiếp tục",
  formFieldInputPlaceholder__emailAddress: "Nhập email của bạn",
  footerActionLink__signUp: "Đăng ký",
  footerActionLink__signIn: "Đăng nhập",
  formFieldLabel__password: "Mật khẩu",
  formFieldInputPlaceholder__password: "Nhập mật khẩu của bạn",
  formFieldError__passwordTooShort: "Mật khẩu phải có ít nhất 8 ký tự.",
  formFieldError__passwordTooWeak: "Mật khẩu chưa đủ mạnh.",
  formFieldHintText__password: "Sử dụng ít nhất 8 ký tự.",
};

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <UserInfoProvider>
        <ClerkProvider
          publishableKey={PUBLISHABLE_KEY}
          localization={localization}
        >
          <AuthProvider>
            <App />
          </AuthProvider>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </ClerkProvider>
      </UserInfoProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
