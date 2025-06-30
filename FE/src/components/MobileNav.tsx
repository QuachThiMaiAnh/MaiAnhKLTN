import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect } from "react";

import { RxHamburgerMenu } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Trang chủ", to: "/" },
  { label: "Về chúng tôi", to: "/about" },
  { label: "Sản phẩm", to: "/shopping" },
  { label: "Dịch vụ", to: "/services" },
  { label: "Tin tức", to: "/blog" },
];

const MobileNav = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="lg:hidden cursor-pointer max-w-[264px] ">
      <Sheet>
        <SheetTrigger asChild>
          <div>
            {/* Icon ☰ */}
            <RxHamburgerMenu className="text-3xl font-bold text-foreground" />
          </div>
        </SheetTrigger>
        <SheetContent className="w-[300px] pt-3 bg-background text-foreground">
          <SheetHeader>
            <SheetTitle className="border-b pb-4 uppercase font-black leading-[30px] text-[18px] font-raleway text-left text-foreground">
              Thanh điều hướng
            </SheetTitle>
            <SheetDescription className="hidden"></SheetDescription>
            <SheetClose asChild></SheetClose>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <ul className="w-full">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {/* Click vào link sẽ điều hướng đến trang tương ứng và đóng sheet */}
                  <SheetClose asChild>
                    <Link
                      to={item.to}
                      className={`text-xs font-bold leading-4 pt-3 pr-11 pb-[10px] pl-4 rounded-2xl w-full block mb-[10px] shadow-custom transition-all
            ${
              pathname === item.to
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:text-primary"
            }`}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
