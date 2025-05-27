import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { IoBagHandleSharp, IoSearch } from "react-icons/io5";
import { SlHeart } from "react-icons/sl";

import MobileNav from "@/components/MobileNav";
import { useUserContext } from "@/common/context/UserProvider";
import useCart from "@/common/hooks/useCart";

import { useToast } from "@/components/ui/use-toast";

import axios from "axios";
import io from "socket.io-client"; // Kết nối tới server sử dụng WebSocket để nhận sự kiện thời gian thực.
import Logo from "@/assets/SHOPING.jpg";

import { useClerk, useUser } from "@clerk/clerk-react";

import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useGetWishList } from "@/pages/(website)/wishlist/action/useGetWishList";

const socket = io("http://localhost:3000");

const menuItems = [
  { label: "Trang chủ", to: "/" },
  { label: "Về chúng tôi", to: "/about" },
  { label: "Sản phẩm", to: "/shopping" },
  { label: "Dịch vụ", to: "/services" },
  { label: "Tin tức", to: "/blog" },
];

const Header = () => {
  // Hook từ Clerk và Context người dùng
  const { isSignedIn, user } = useUser();
  const { _id } = useUserContext();
  const { openSignIn, openSignUp } = useClerk();

  // State quản lý giao diện và hành vi
  const [isOpen, setIsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [showUserInfo, setShowUserInfo] = useState(false);

  //thông báo
  const [notifications, setNotifications] = useState<any[]>([]); // Danh sách thông báo
  const [unreadCount, setUnreadCount] = useState<number>(0); // Số lượng thông báo chưa đọc
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState<boolean>(false);
  const [isMarkAllDropdownOpen, setIsMarkAllDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { toast } = useToast();
  const [keyProduct, setKeyProduct] = useState("");
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleSearch() {
    if (!keyProduct) return;

    if (pathname === "/shopping") {
      console.log("OK");
      searchParams.set("search", keyProduct);
      setSearchParams(searchParams);
    } else {
      navigate(`/shopping?search=${keyProduct}`);
    }
    setKeyProduct("");
    setIsOpen(false);
  }

  const { cart, isLoading } = useCart(_id);
  const { wishList, isError } = useGetWishList(_id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const opensignin = async () => {
    await openSignIn({
      redirectUrl: "/",
    });
  };

  const opensignup = async () => {
    await openSignUp({
      redirectUrl: "/",
    });
  };

  const fetchLogo = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/logo");
      const data = await response.json();

      if (data && data.length > 0) {
        setLogoUrl(data[0].image);
      }
    } catch (error) {
      console.error("Error fetching logo:", error);
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      // const timer = setTimeout(() => {
      setShowUserInfo(true); // Sau 1 giây sẽ hiển thị thông tin người dùng
      // }, 1000);

      // return () => clearTimeout(timer);
    }
  }, [isSignedIn]); // Chạy lại effect khi trạng thái người dùng thay đổi

  // Tham gia phòng socket khi _id thay đổi

  useEffect(() => {
    if (_id) {
      socket.emit("join_room", _id); // Tham gia phòng với userId
      // console.log(`User với id: ${_id} đã tham gia phòng`);
    }
  }, [_id]);

  // Lấy thông báo từ API
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/notifications/${_id}`
      );

      const { notifications: newNotifications = [] } = response.data || {};

      if (!Array.isArray(newNotifications)) {
        console.error(
          "API response.notifications is not an array",
          newNotifications
        );
        return;
      }

      // Cập nhật thông báo
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        ...newNotifications,
      ]);

      // Đếm thông báo chưa đọc
      const unreadCount = newNotifications.filter((n) => !n.isRead).length;
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Đánh dấu thông báo là đã đọc
  const handleNotificationClick = async (notificationId: string) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/notifications/mark-as-read/${notificationId}`
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      // Lấy lại số lượng thông báo chưa đọc từ server sau khi thay đổi
      const response = await axios.get(
        `http://localhost:8080/api/notifications/unread-count/${_id}`
      );
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(
        `http://localhost:8080/api/notifications/mark-as-read/all`,
        {
          userId: _id,
        }
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0); // Reset số lượng chưa đọc về 0
      setIsMarkAllDropdownOpen(false);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Không thể đánh dấu tất cả là đã đọc!",
      });
    }
  };

  // Xóa thông báo
  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/notifications/${notificationId}`
      );
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
      setOpenDropdown(null);
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Có lỗi xảy ra khi xóa thông báo!",
      });
    }
  };

  // Effect: Lấy thông báo lần đầu tiên
  useEffect(() => {
    if (_id) fetchNotifications();
  }, [_id]);

  // Lắng nghe thông báo mới từ Socket.IO
  useEffect(() => {
    // Lắng nghe sự kiện orderNotification
    socket.on("orderNotification", (newNotification) => {
      // console.log("Thông báo nhận được:", newNotification);

      // Kiểm tra nếu thông báo không phải của tài khoản hiện tại
      if (newNotification.userId !== _id) {
        return; // Nếu không phải, bỏ qua thông báo này
      }

      setNotifications((prevNotifications) => {
        // Kiểm tra xem thông báo đã tồn tại chưa
        if (
          prevNotifications.some(
            (notif) =>
              notif.orderCode === newNotification.orderCode &&
              notif.orderId === newNotification.orderId
          )
        ) {
          return prevNotifications; // Nếu trùng, không thêm vào nữa
        }

        const updatedNotifications = [newNotification, ...prevNotifications];
        const unreadCount = updatedNotifications.filter(
          (n) => !n.isRead
        ).length;
        setUnreadCount(unreadCount);

        return updatedNotifications;
      });
    });

    // Lắng nghe sự kiện orderStatusNotification
    socket.on("orderStatusNotification", (newNotification) => {
      // console.log("Thông báo trạng thái nhận được:", newNotification);

      // Kiểm tra nếu thông báo không phải của tài khoản hiện tại
      if (newNotification.userId !== _id) {
        return; // Nếu không phải, bỏ qua thông báo này
      }

      setNotifications((prevNotifications) => {
        const updatedNotifications = [newNotification, ...prevNotifications];
        const unreadCount = updatedNotifications.filter(
          (n) => !n.isRead
        ).length;
        setUnreadCount(unreadCount);

        return updatedNotifications;
      });
    });

    return () => {
      socket.off("orderNotification");
      socket.off("orderStatusNotification");
    };
  }, [_id]);

  return (
    <>
      <header
        className={`fixed left-0 top-0 w-full z-40 transition-all duration-300 ease-in-out`}
      >
        {/* Header TOP */}
        <div
          className={`bg-white h-[40px] md:h-[60px] border-b border-b-[#eee]`}
        >
          <div className="border-x-0 lg:border-x-[50px] border-transparent relative">
            <div className="flex">
              {/* Contact INFO */}
              <div className="lg:w-5/12 hidden lg:inline px-[15px] ">
                <div className="border-l border-[#eee] border-[0] py-[10px] lg:px-[10px] lg:py-[20px] xl:px-[25px] xl:py-5 text-[10px] leading-5 text-[#888] uppercase relative inline-block">
                  <b className="text-[#555] font-bold">liên hệ: </b>
                  <a
                    className="cursor-pointer hover:text-[#b8cd06]"
                    href="tel:+3 (523) 555 123 8745"
                  >
                    +3 (523) 555 123 8745
                  </a>
                </div>
                {/* CLASS BI LAP */}
                <div className="border-x border-[#eee] border-[0] py-[10px] lg:px-[10px] lg:py-[20px] xl:px-[25px] xl:py-5 text-[10px] leading-5 text-[#888] uppercase relative inline-block">
                  <b className="text-[#555] font-bold">email: </b>
                  <a
                    className="cursor-pointer hover:text-[#b8cd06]"
                    href="mailto:office@exzo.com"
                  >
                    office@exzo.com
                  </a>
                </div>
              </div>

              {/* NAVIGATION */}
              <div className="w-full lg:w-7/12 text-right flex justify-between lg:justify-end items-center px-[15px]">
                <div className="border-l border-r lg:border-r-0 border-[#eee] px-[15px] py-[10px] md:p-5 lg:px-[10px] lg:py-[20px] xl:px-[25px] xl:py-5 text-[10px] leading-5 text-[#555] uppercase">
                  {isSignedIn && showUserInfo ? (
                    <Link className="flex gap-2" to="/users">
                      <img
                        className="rounded-full w-[20px] h-[20px] object-cover"
                        src={user?.imageUrl}
                        alt=""
                      />{" "}
                      <span>
                        <span>{user?.firstName}</span>
                        <span className="ml-0.5">{user?.lastName}</span>
                      </span>
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="#"
                        onClick={opensignin}
                        className="cursor-pointer hover:text-[#b8cd06] transition-all"
                      >
                        <b>Đăng nhập</b>
                      </Link>
                      &nbsp; hoặc &nbsp;
                      <Link
                        to="#"
                        onClick={opensignup}
                        className="cursor-pointer hover:text-[#b8cd06] transition-all"
                      >
                        <b>Đăng ký</b>
                      </Link>
                    </>
                  )}
                </div>

                <div className="border-l border-[#eee] py-[10px] lg:px-[10px] lg:py-[20px] xl:px-[25px] xl:py-5 text-[10px] leading-5 text-[#555] uppercase hidden lg:inline relative">
                  <Link
                    to="/wishlist"
                    className="cursor-pointer hover:text-[#b8cd06] transition-all"
                  >
                    <SlHeart className="text-xl" />
                    <span className="absolute top-3 right-4 flex items-center justify-center w-[19px] h-[19px] rounded-full text-[11px] text-white bg-red-500">
                      {wishList?.products?.length || 0}
                    </span>
                  </Link>
                </div>

                {/* Thông báo */}
                <div
                  className="relative border-l border-[#eee] py-[10px] lg:px-[10px] lg:py-[16px] xl:px-[25px] text-[10px] leading-5 text-[#555] uppercase hidden lg:inline"
                  onMouseEnter={() => setIsNotificationsOpen(true)} // Mở thông báo khi hover
                  onMouseLeave={() => setIsNotificationsOpen(false)} // Mở thông báo khi hover
                >
                  <div className=" hover:text-[#b8cd06] cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-[23px]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                      />
                    </svg>

                    {/* Chấm đỏ thông báo */}
                    <span className="absolute top-2 right-4 flex items-center justify-center w-[19px] h-[19px] rounded-full text-[11px] text-white bg-red-500">
                      {unreadCount > 0 ? unreadCount : 0}
                    </span>
                  </div>

                  {/* Dropdown Thông báo */}
                  {isNotificationsOpen && (
                    <div
                      className="absolute right-0 mt-2 w-[300px] bg-white shadow-2xl rounded-lg max-h-96 overflow-y-auto border border-gray-200 scrollbar-hide"
                      style={{
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE & Edge
                      }}
                      onMouseLeave={() => {
                        setIsMarkAllDropdownOpen(false);
                        setOpenDropdown(null);
                      }}
                    >
                      <div className="sticky top-0 z-10 bg-white p-2 flex justify-between items-center">
                        <h1 className="text-[13px] font-bold">
                          Thông báo mới nhận
                        </h1>

                        {/* Nút ba chấm */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setIsMarkAllDropdownOpen((prev) => !prev)
                            }
                            className="pb-3 text-[23px]  transition"
                          >
                            ...
                          </button>
                          {isMarkAllDropdownOpen && (
                            <div className="absolute right-2 mt-0 bg-white shadow-lg shadow-gray-500 rounded-md z-10">
                              <button
                                onClick={markAllAsRead}
                                className="block w-[200px] py-2 text-sm rounded-md  text-gray-800 hover:bg-gray-100"
                              >
                                Đánh dấu tất cả là đã đọc
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {notifications.length > 0 ? (
                        <ul className="space-y-2 p-2">
                          {notifications.map((notification) => (
                            <li
                              key={notification._id}
                              className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-100 rounded-lg transition-all duration-200 ${
                                !notification.isRead
                                  ? "bg-[#f5ffcc]"
                                  : "bg-gray-50"
                              }`}
                              onClick={() =>
                                handleNotificationClick(notification._id)
                              }
                            >
                              {notification.productImage && (
                                <img
                                  src={notification.productImage}
                                  alt="Product"
                                  className="w-14 h-14 object-cover rounded-md"
                                />
                              )}

                              <div>
                                {/* Nội dung thông báo */}
                                <div className="flex-1 text-xs text-gray-800">
                                  <Link
                                    to={"/users/order-history"}
                                    className="truncate text-wrap"
                                  >
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: notification.message,
                                      }}
                                    />
                                  </Link>
                                </div>

                                {/* Thời gian thông báo */}
                                <div className="text-xs text-gray-400">
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString()}
                                </div>

                                {/* Nút ba chấm */}
                                <div className="relative">
                                  <button
                                    className="text-[20px] text-gray-500 hover:text-gray-700"
                                    onClick={() =>
                                      setOpenDropdown((prev) =>
                                        prev === notification._id
                                          ? null
                                          : notification._id
                                      )
                                    }
                                  >
                                    ...
                                  </button>
                                  {openDropdown === notification._id && (
                                    <div className="absolute right-1 top-7 bg-white shadow-lg rounded-md z-10">
                                      <button
                                        className="block px-4 py-2 text-sm text-red-600 "
                                        onClick={() =>
                                          handleDeleteNotification(
                                            notification._id
                                          )
                                        }
                                      >
                                        Xóa thông báo
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-6 text-center text-xs text-gray-500">
                          Không có dữ liệu!
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-x border-[#eee] py-[10px] lg:px-[10px] lg:py-[20px] xl:px-[25px] xl:py-5 text-[10px] leading-5 text-[#555] uppercase relative hidden lg:inline">
                  <Link
                    to="/cart"
                    className="cursor-pointer text-[#555] hover:text-[#b8cd06] transition-all flex items-center"
                  >
                    <b className="font-bold">giỏ hàng</b>
                    <span className="relative">
                      <IoBagHandleSharp className="text-xl ml-1 mr-2" />
                      <span className="absolute -top-2 -right-1 bg-[#b8cd06] text-white text-[10px] w-[20px] h-[20px] text-center rounded-full">
                        {cart?.products?.length || 0}
                      </span>
                    </span>
                  </Link>
                </div>

                {/* HumBurger Icon */}
                <MobileNav />
              </div>
            </div>
          </div>
        </div>

        {/* Header BOTTOM */}
        <div className="h-[60px] md:h-[98px] bg-white border-b border-b-[#eee] shadow-custom">
          <div className="border-x-0 lg:border-x-[50px] border-transparent h-full">
            <div className="flex h-full items-center">
              <Link to="/" className="w-4/12 md:w-2/12 px-[15px]">
                <img
                  className="w-20 md:w-36"
                  src={logoUrl || Logo}
                  alt="Logo"
                />
              </Link>

              <div className="w-8/12 md:w-10/12 justify-items-end px-[15px]">
                <nav className="hidden lg:block">
                  <ul className="flex">
                    {menuItems.map((item) => (
                      <li className="!list-none" key={item.to}>
                        <Link
                          className={`text-[11px] leading-4 uppercase text-[#343434] font-bold rounded-2xl px-5 py-[9px] hover:bg-[#b8cd06] hover:text-white hover:shadow-custom transition-all ${
                            pathname === item.to
                              ? "bg-[#b8cd06] text-white"
                              : ""
                          }`}
                          to={item.to}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}

                    <li className="!list-none">
                      <IoSearch
                        className="text-2xl ml-2 hover:cursor-pointer hover:text-[#b8cd06] transition-all"
                        onClick={() => setIsOpen(!isOpen)}
                      />
                    </li>
                  </ul>
                </nav>

                <div className="lg:hidden flex gap-3">
                  <IoSearch
                    className="text-3xl ml-2 hover:cursor-pointer hover:text-[#b8cd06] transition-all"
                    onClick={() => setIsOpen(!isOpen)}
                  />
                  <Link to="/wishlist" className="relative">
                    <SlHeart className="text-3xl ml-2 hover:cursor-pointer hover:text-[#b8cd06] transition-all" />
                    <span
                      className="absolute -top-3 left-7 flex items-center justify-center w-[19px] h-[19px] rounded-full text-[11px] text-white bg-red-500"
                      key="dfg;fdvbncvbdgj"
                    >
                      {wishList?.products?.length || 0}
                    </span>
                  </Link>

                  {/* Thông báo */}
                  <div
                    className="relative lg:hidden border-[#eee]  text-[10px] leading-5  uppercase"
                    onMouseEnter={() => setIsNotificationsOpen(true)}
                    onMouseLeave={() => setIsNotificationsOpen(false)}
                  >
                    <div className=" hover:text-[#b8cd06] cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-[33px]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                        />
                      </svg>

                      {/* Chấm đỏ thông báo */}
                      <span className="absolute -top-3 -right-2 flex items-center justify-center w-[19px] h-[19px] rounded-full text-[11px] text-white bg-red-500">
                        {unreadCount > 0 ? unreadCount : 0}
                      </span>
                    </div>

                    {/* Dropdown Thông báo */}
                    {isNotificationsOpen && (
                      <div
                        className="absolute right-0  w-[300px] bg-white shadow-2xl rounded-lg max-h-96 overflow-y-auto border border-gray-200 scrollbar-hide"
                        style={{
                          scrollbarWidth: "none", // Firefox
                          msOverflowStyle: "none", // IE & Edge
                        }}
                        onMouseLeave={() => {
                          setIsMarkAllDropdownOpen(false);
                          setOpenDropdown(null);
                        }}
                      >
                        <div className="sticky top-0 z-10 bg-white p-2 flex justify-between items-center">
                          <h1 className="text-[13px] font-bold">
                            Thông báo mới nhận
                          </h1>

                          {/* Nút ba chấm */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setIsMarkAllDropdownOpen((prev) => !prev)
                              }
                              className="pb-3 text-[23px]  transition"
                            >
                              ...
                            </button>
                            {isMarkAllDropdownOpen && (
                              <div className="absolute right-2 mt-0 bg-white shadow-lg shadow-gray-500 rounded-md z-10">
                                <button
                                  onClick={markAllAsRead}
                                  className="block w-[200px] py-2 text-sm rounded-md  text-gray-800 hover:bg-gray-100"
                                >
                                  Đánh dấu tất cả là đã đọc
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {notifications.length > 0 ? (
                          <ul className="space-y-2 p-2">
                            {notifications.map((notification) => (
                              <li
                                key={notification._id}
                                className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-100 rounded-lg transition-all duration-200 ${
                                  !notification.isRead
                                    ? "bg-[#f5ffcc]"
                                    : "bg-gray-50"
                                }`}
                                onClick={() =>
                                  handleNotificationClick(notification._id)
                                }
                              >
                                {notification.productImage && (
                                  <img
                                    src={notification.productImage}
                                    alt="Product"
                                    className="w-14 h-14 object-cover rounded-md"
                                  />
                                )}

                                <div>
                                  {/* Nội dung thông báo */}
                                  <div className="flex-1 text-xs text-gray-800">
                                    <Link
                                      to={"/users/order-history"}
                                      className="truncate text-wrap"
                                    >
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: notification.message,
                                        }}
                                      />
                                    </Link>
                                  </div>

                                  {/* Thời gian thông báo */}
                                  <div className="text-xs text-gray-400">
                                    {new Date(
                                      notification.createdAt
                                    ).toLocaleString()}
                                  </div>

                                  {/* Nút ba chấm */}
                                  <div className="relative">
                                    <button
                                      className="text-[20px] text-gray-500 hover:text-gray-700"
                                      onClick={() =>
                                        setOpenDropdown((prev) =>
                                          prev === notification._id
                                            ? null
                                            : notification._id
                                        )
                                      }
                                    >
                                      ...
                                    </button>
                                    {openDropdown === notification._id && (
                                      <div className="absolute right-1 top-7 bg-white shadow-lg rounded-md z-10">
                                        <button
                                          className="block px-4 py-2 text-sm text-red-600 "
                                          onClick={() =>
                                            handleDeleteNotification(
                                              notification._id
                                            )
                                          }
                                        >
                                          Xóa thông báo
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-6 text-center text-xs text-gray-500">
                            Không có dữ liệu!
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <span className="relative mr-2">
                    <Link to="/cart">
                      <IoBagHandleSharp className="text-3xl ml-2 hover:cursor-pointer hover:text-[#b8cd06] transition-all" />
                      <span className="absolute size-5 rounded-full text-white text-[11px] leading-5 text-center bg-[#b8cd06] top-[-39%] right-[-23%]">
                        {cart?.products?.length || 0}
                      </span>
                    </Link>
                  </span>
                </div>
              </div>
            </div>

            <div className={`relative -z-10 mx-[15px]`}>
              <div
                className={`py-10 pb-[15px] md:pb-10 absolute w-full top-0 left-0 shadow-custom_input transition-all duration-300 bg-white ${
                  isOpen
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-full opacity-0"
                }`}
              >
                <div className="px-[15px] flex justify-center">
                  <IoIosClose
                    className="text-3xl absolute right-0 top-0 mt-2 mr-2 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                  />

                  <input
                    type="text"
                    value={keyProduct}
                    onChange={(e) => setKeyProduct(e.target.value)}
                    placeholder="Nhập từ khóa tìm kiếm"
                    className="bg-white border-0 border-b border-b-[#eee] outline-0 focus:ring-0 focus:border-b-[#b8cd06] text-[#555] w-full md:w-2/4"
                  />
                  <button>
                    <IoSearch
                      className="text-2xl hover:text-[#b8cd06]"
                      onClick={handleSearch}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="block h-[100px] md:h-[159px]"></div>
    </>
  );
};

export default Header;
