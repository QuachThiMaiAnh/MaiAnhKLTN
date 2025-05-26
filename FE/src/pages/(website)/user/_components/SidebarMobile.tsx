import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTrigger
} from "@/components/ui/sheet";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";

const SidebarMobile: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<"account" | "bank" | null>(
    "account"
  );
  const { user } = useUser();

  const toggleAccountMenu = () => {
    setActiveMenu((prev) => (prev === "account" ? null : "account"));
  };

  return (
    <>
      {/* Trigger để mở Sidebar */}
      <div className="sm:hidden">
        <Sheet>
          <SheetTrigger>
            <div>
              <RxHamburgerMenu className="text-3xl font-bold" />
            </div>
          </SheetTrigger>

          {/* Nội dung Sidebar */}
          <SheetContent
            side="right"
            className="w-[300px] bg-gray-200 shadow-lg"
          >
            <SheetHeader>
              <SheetDescription className="text-left">
                Quản lý tài khoản và thông tin!
              </SheetDescription>
            </SheetHeader>

            {/* Nội dung chính của Sidebar */}
            <div className="">
              {/* Ảnh đại diện của người dùng */}
              <h2 className="text-base text-center font-semibold mt-7">
                {user?.firstName} {user?.lastName}
              </h2>
              <div className="flex items-center text-center justify-center mt-3 mb-8 border-b border-zinc-400">
                <img
                  src={user?.imageUrl || "user_image_url"}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full mr-4 mb-2"
                />
              </div>

              {/* Menu tài khoản */}
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <h3
                    className="text-base font-medium  cursor-pointer"
                    onClick={toggleAccountMenu}
                  >
                    Tài Khoản Của Tôi
                  </h3>
                </div>

                <ul
                  className={`flex flex-col mt-2 transition-all duration-300 ease-in-out ml-10 ${
                    activeMenu === "account"
                      ? "opacity-100 max-h-screen"
                      : "opacity-0 max-h-0 overflow-hidden"
                  }`}
                >
                  <li className="py-2 text-sm hover:text-cyan-500 cursor-pointer">
                    <Link to="/users" className="block">
                      Hồ Sơ
                    </Link>
                  </li>
                  <li className="py-2 text-sm hover:text-cyan-500 cursor-pointer">
                    <Link to="/users/password" className="block">
                      Thay Đổi Mật Khẩu
                    </Link>
                  </li>
                  <li className="py-2 text-sm hover:text-cyan-500 cursor-pointer">
                    <Link to="/users/dia-chi" className="block">
                      Địa Chỉ
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Đơn hàng */}
              <div className="mb-4">
                <div className="flex gap-3 items-center ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-6 text-sky-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.988 3.012A2.25 2.25 0 0 1 18 5.25v6.5A2.25 2.25 0 0 1 15.75 14H13.5V7A2.5 2.5 0 0 0 11 4.5H8.128a2.252 2.252 0 0 1 1.884-1.488A2.25 2.25 0 0 1 12.25 1h1.5a2.25 2.25 0 0 1 2.238 2.012ZM11.5 3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v.25h-3v-.25Z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M2 7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7Zm2 3.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm0 3.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3
                    className="text-base font-medium  cursor-pointer"
                    onClick={() => setActiveMenu(null)}
                  >
                    Đơn Mua
                  </h3>
                </div>
              </div>

              {/* Kho voucher */}
              <div className="mb-4 flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-6 text-red-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.75 3A2.25 2.25 0 0 1 18 5.25v1.214c0 .423-.277.788-.633 1.019A2.997 2.997 0 0 0 16 10c0 1.055.544 1.982 1.367 2.517.356.231.633.596.633 1.02v1.213A2.25 2.25 0 0 1 15.75 17H4.25A2.25 2.25 0 0 1 2 14.75v-1.213c0-.424.277-.789.633-1.02A2.998 2.998 0 0 0 4 10a2.997 2.997 0 0 0-1.367-2.517C2.277 7.252 2 6.887 2 6.463V5.25A2.25 2.25 0 0 1 4.25 3h11.5ZM13.5 7.396a.75.75 0 0 0-1.5 0v1.042a.75.75 0 0 0 1.5 0V7.396Zm0 4.167a.75.75 0 0 0-1.5 0v1.041a.75.75 0 0 0 1.5 0v-1.041Z"
                    clipRule="evenodd"
                  />
                </svg>

                <h3
                  className="text-base font-medium cursor-pointer"
                  onClick={() => setActiveMenu(null)}
                >
                  Kho Voucher
                </h3>
              </div>

              {/* Đăng xuất */}

              <SignOutButton>
                <button className="mt-10 flex items-center justify-center gap-2 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M14 10a.75.75 0 0 0-.75-.75H3.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 14 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-500">Đăng xuất</p>
                </button>
              </SignOutButton>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default SidebarMobile;
