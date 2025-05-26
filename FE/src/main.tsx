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

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <UserInfoProvider>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <AuthProvider>
            <App />
          </AuthProvider>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </ClerkProvider>
      </UserInfoProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
