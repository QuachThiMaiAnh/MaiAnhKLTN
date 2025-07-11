import { useEffect, useState } from "react"; // Quản lý state và thực thi effect khi component render.
import { IoIosClose } from "react-icons/io"; // Icon đóng
import { IoBagHandleSharp, IoSearch } from "react-icons/io5"; // Icon giỏ hàng và tìm kiếm
import { SlHeart } from "react-icons/sl"; // Icon yêu thích

import MobileNav from "@/components/MobileNav"; // Thanh điều hướng di động
import { useUserContext } from "@/common/context/UserProvider"; // Context người dùng để lấy thông tin người dùng hiện tại (_id, v.v.)
import useCart from "@/common/hooks/useCart"; // Hook để lấy giỏ hàng của người dùng
import { useToast } from "@/components/ui/use-toast"; // Hook để hiển thị thông báo (toast)

import axios from "axios"; // Thư viện Axios để thực hiện các yêu cầu HTTP
import io from "socket.io-client"; // Kết nối tới server sử dụng WebSocket để nhận sự kiện thời gian thực.
import Logo from "@/assets/SHOPING.jpg"; // Logo mặc định của trang web

import { useClerk, useUser } from "@clerk/clerk-react"; // Hook từ Clerk để quản lý xác thực người dùng

import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom"; // Hook từ React Router để điều hướng và lấy thông tin URL

import { useGetWishList } from "@/pages/(website)/wishlist/action/useGetWishList"; // Custom hook để lấy danh sách yêu thích của người dùng

const socket = io(import.meta.env.VITE_SOCKET_URL); // Kết nối tới server WebSocket

import ThemeToggle from "./ThemeToggle"; // Component để chuyển đổi chủ đề (sáng/tối)

// Danh sách các mục menu
const menuItems = [
  { label: "Trang chủ", to: "/" },
  { label: "Về chúng tôi", to: "/about" },
  { label: "Sản phẩm", to: "/shopping" },
  { label: "Dịch vụ", to: "/services" },
  { label: "Tin tức", to: "/blog" },
];

//====================================================================================================================================================================================================================//
const Header = () => {
  // Hook từ Clerk và Context người dùng
  const { isSignedIn, user } = useUser();
  const { _id } = useUserContext(); // Lấy _id của người dùng hiện tại từ Context (UserProvider- MongoDB)
  const { openSignIn, openSignUp } = useClerk();

  // State quản lý giao diện và hành vi
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/đóng của ô tìm kiếm
  const [logoUrl, setLogoUrl] = useState<string>(""); // URL của logo, mặc định là Logo.jpg
  const [showUserInfo, setShowUserInfo] = useState(false); //quyết định có hiển thị tên, ảnh người dùng không (sau khi đăng nhập xong thì mới hiển thị).

  // State quản lý thông báo
  const [notifications, setNotifications] = useState<any[]>([]); // Danh sách thông báo hiện tại
  const [unreadCount, setUnreadCount] = useState<number>(0); //Số lượng thông báo chưa đọc
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState<boolean>(false); // Bật/tắt khung thông báo
  const [isMarkAllDropdownOpen, setIsMarkAllDropdownOpen] = useState(false); // Kiểm soát menu phụ trong thông báo (nút 3 chấm)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); //Xác định thông báo nào đang mở menu ba chấm (...) để xoá

  // Thông báo Toast
  const { toast } = useToast();

  // Hook router
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Tìm kiếm
  const [searchParams, setSearchParams] = useSearchParams(); // thao tác với query string trên URL
  const [keyProduct, setKeyProduct] = useState(""); // Chứa từ khoá người dùng nhập để tìm kiếm sản phẩm
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]); // Danh sách từ khoá gợi ý từ API
  const [loadingSuggest, setLoadingSuggest] = useState(false); // Trạng thái loading khi lấy gợi ý từ khoá
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // Chỉ mục của từ khoá được highlight trong danh sách gợi ý

  // Hook giỏ hàng và wishlist
  const { cart, isLoading } = useCart(_id); // Lấy giỏ hàng của người dùng
  const { wishList, isError } = useGetWishList(_id); // Lấy danh sách yêu thích của người dùng
  //====================================================================================================================================================================================================================//

  // Hàm xử lý tìm kiếm khi người dùng nhấn Enter hoặc click vào gợi ý
  function handleSearch(keyword?: string) {
    const searchKey = keyword ?? keyProduct;
    if (!searchKey) return;

    if (pathname === "/shopping") {
      searchParams.set("search", searchKey);
      setSearchParams(searchParams);
    } else {
      navigate(`/shopping?search=${encodeURIComponent(searchKey)}`);
    }

    setTimeout(() => {
      setKeyProduct("");
    }, 200);

    setIsOpen(false);
  }

  // Mở cửa sổ đăng nhập hoặc đăng ký --> thành công sẽ chuyển hướng về /
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

  // Lấy logo từ API
  const fetchLogo = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/logo`);

      const data = await response.data; // Giả sử API trả về một mảng chứa logo

      if (data && data.length > 0) {
        setLogoUrl(data[0].image);
      }
    } catch (error) {
      console.error("Error fetching logo:", error);
    }
  };

  // Lấy gợi ý từ khóa khi người dùng nhập vào ô tìm kiếm
  useEffect(() => {
    if (!keyProduct || keyProduct.length < 2) {
      setSuggestedKeywords([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoadingSuggest(true);
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/products/keywords?keyword=${keyProduct}`
        );
        setSuggestedKeywords(res.data);
      } catch (err) {
        console.error("Gợi ý từ khóa lỗi:", err);
      } finally {
        setLoadingSuggest(false);
      }
    }, 300); // Thực hiện sau 300ms khi người dùng dừng gõ

    return () => clearTimeout(delayDebounce);
  }, [keyProduct]);

  useEffect(() => {
    fetchLogo();
  }, []);

  // Mỗi khi người dùng chuyển trang (pathname thay đổi), sẽ scroll về đầu trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Sau khi người dùng đăng nhập, mới hiển thị avatar và tên
  useEffect(() => {
    if (isSignedIn) {
      setShowUserInfo(true);
    }
  }, [isSignedIn]);

  // Tham gia phòng socket khi _id thay đổi
  useEffect(() => {
    if (_id) {
      socket.emit("join_room", _id);
    }
  }, [_id]);

  // Lấy thông báo từ API (không bị trùng lặp)
  const fetchNotifications = async () => {
    if (!_id) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications/${_id}`
      );

      const { notifications: newNotifications = [] } = response.data || {};

      if (!Array.isArray(newNotifications)) {
        console.error(
          "API response.notifications is not an array:",
          newNotifications
        );
        return;
      }

      // ❗ Thay vì nối thêm vào danh sách cũ (tránh trùng), gán mới hoàn toàn
      setNotifications(newNotifications);

      // ✅ Đếm thông báo chưa đọc
      const unreadCount = newNotifications.filter((n) => !n.isRead).length;
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Xử lý khi người dùng click vào thông báo => đánh dấu thông báo đã đọc
  const handleNotificationClick = async (notificationId: string) => {
    try {
      // Gửi yêu cầu PATCH đến server để đánh dấu thông báo là đã đọc
      await axios.patch(
        `${
          import.meta.env.VITE_API_URL
        }/notifications/mark-as-read/${notificationId}`
      );

      // Cập nhật trạng thái isRead trong state hiện tại
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );

      // Gửi yêu cầu GET để lấy lại số lượng thông báo chưa đọc từ backend
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications/unread-count/${_id}`
      );

      // Cập nhật số lượng thông báo chưa đọc
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể đánh dấu thông báo là đã đọc.",
      });
    }
  };

  // Đánh dấu tất cả thông báo là đã đọc
  const markAllAsRead = async () => {
    try {
      // Gửi yêu cầu PATCH đến server để đánh dấu tất cả thông báo là đã đọc
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/notifications/mark-as-read/all`,
        {
          userId: _id,
        }
      );
      // Cập nhật trạng thái isRead trong state hiện tại
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0); // Reset số lượng chưa đọc về 0
      setIsMarkAllDropdownOpen(false); // Đóng menu phụ sau khi đánh dấu tất cả là đã đọc
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Không thể đánh dấu tất cả là đã đọc!",
      });
    }
  };

  // Xóa một thông báo
  const handleDeleteNotification = async (notificationId: string) => {
    try {
      // Gửi yêu cầu xóa lên server
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/notifications/${notificationId}`
      );

      // Cập nhật danh sách thông báo (xoá khỏi state)
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );

      // Đóng dropdown ba chấm nếu đang mở
      setOpenDropdown(null);

      // Gửi yêu cầu GET để lấy lại số lượng thông báo chưa đọc từ backend
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications/unread-count/${_id}`
      );

      // Cập nhật số lượng thông báo chưa đọc
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Có lỗi xảy ra khi xóa thông báo!",
      });
    }
  };

  // Lấy thông báo lần đầu tiên
  useEffect(() => {
    if (_id) fetchNotifications();
  }, [_id]);

  // Lắng nghe thông báo mới từ Socket.IO
  useEffect(() => {
    // Lắng nghe sự kiện orderNotification
    socket.on("orderNotification", (newNotification) => {
      // Chỉ xử lý nếu thông báo là của người dùng hiện tại.
      if (newNotification.userId !== _id) {
        return;
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
          return prevNotifications; // Nếu trùng, không thêm Tb mới vào nữa
        }

        // Nếu không trùng, thêm thông báo mới vào đầu danh sách
        const updatedNotifications = [newNotification, ...prevNotifications];

        // Cập nhật số lượng thông báo chưa đọc
        const unreadCount = updatedNotifications.filter(
          (n) => !n.isRead
        ).length;
        setUnreadCount(unreadCount);

        return updatedNotifications;
      });
    });

    // Lắng nghe sự kiện orderStatusNotification
    socket.on("orderStatusNotification", (newNotification) => {
      // Kiểm tra nếu thông báo không phải của tài khoản hiện tại
      if (newNotification.userId !== _id) {
        return; // Nếu không phải, bỏ qua thông báo này
      }

      setNotifications((prevNotifications) => {
        // Cập nhật danh sách thông báo
        // Trạng thái đơn hàng có thể cập nhiều lần nên không cần kiểm tra trùng lặp
        const updatedNotifications = [newNotification, ...prevNotifications];

        // Cập nhật số lượng thông báo chưa đọc
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
        <div className="bg-background h-[40px] md:h-[60px] border-b border-border">
          <div className="border-x-0 lg:border-x-[50px] border-transparent relative">
            <div className="flex">
              {/* Đây là khối trái - trên */}
              {/* ❗ Chỉ hiện ở desktop (ẩn ở mobile) */}
              {/* Contact INFO */}
              <div className="lg:w-5/12 hidden lg:inline px-[15px]">
                <div className="border-l border-border py-[10px] lg:px-[10px] lg:py-[20px] xl:px-[25px] xl:py-5 text-[10px] leading-5 text-muted-foreground uppercase inline-block">
                  <b className="text-foreground font-bold">liên hệ: </b>
                  <a
                    className="cursor-pointer hover:text-primary"
                    href="tel:(+84) 1900 636 789"
                  >
                    (+84) 1900 636 789
                  </a>
                </div>

                <div className="border-x border-border py-[10px] lg:px-[10px] lg:py-[20px] xl:px-[25px] xl:py-5 text-[10px] leading-5 text-muted-foreground uppercase inline-block">
                  <b className="text-foreground font-bold">email: </b>
                  <a
                    className="cursor-pointer hover:text-primary"
                    href="mailto:maianh@gmail.com"
                  >
                    maianh@gmail.com
                  </a>
                </div>
              </div>

              {/* Đây là khối phải - trên */}
              <div className="w-full lg:w-7/12 text-right flex justify-between lg:justify-end items-center px-[15px]">
                <div className="border-l border-r lg:border-r-0 border-border px-[15px] py-[10px] md:p-5 lg:px-[10px] lg:py-[20px] xl:px-[25px] xl:py-5 text-[10px] leading-5 text-muted-foreground uppercase">
                  {/* Hiển thị thông tin người dùng nếu đã đăng nhập, nếu không thì hiển thị nút đăng nhập/đăng ký */}
                  {isSignedIn && showUserInfo ? (
                    <Link className="flex gap-2" to="/users">
                      {/* Hiển thị ảnh đại diện người dùng */}
                      <img
                        className="rounded-full w-[20px] h-[20px] object-cover"
                        src={user?.imageUrl}
                        alt=""
                      />
                      {/* Hiển thị tên người dùng */}
                      <span className="text-foreground">
                        <span className="ml-0.5">{user?.firstName}</span>
                        <span className="ml-0.5 ">{user?.lastName}</span>
                      </span>
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="#"
                        onClick={opensignin}
                        className="cursor-pointer hover:text-primary transition-all"
                      >
                        <b>Đăng nhập</b>
                      </Link>
                      &nbsp; hoặc &nbsp;
                      <Link
                        to="#"
                        onClick={opensignup}
                        className="cursor-pointer hover:text-primary transition-all"
                      >
                        <b>Đăng ký</b>
                      </Link>
                    </>
                  )}
                </div>

                {/* ❗ Chỉ hiện ở desktop (ẩn ở mobile) */}
                {/* Yêu thích */}
                <div className="border-l border-border py-[10px] lg:px-[10px] lg:py-[20px] xl:px-[25px] xl:py-5 text-[10px] leading-5 text-muted-foreground uppercase hidden lg:inline relative">
                  <Link
                    to="/wishlist"
                    className="cursor-pointer hover:text-primary transition-all"
                  >
                    <SlHeart className="text-xl" />
                    {/* Số lượng sản phẩm đã yêu thích */}
                    <span className="absolute top-3 right-4 flex items-center justify-center w-[19px] h-[19px] rounded-full text-[11px] text-white bg-destructive">
                      {wishList?.products?.length || 0}
                    </span>
                  </Link>
                </div>

                {/* ❗ Chỉ hiện ở desktop (ẩn ở mobile) */}
                {/* Thông báo */}
                <div
                  className="relative border-l border-border py-[10px] lg:px-[10px] lg:py-[16px] xl:px-[25px] text-[10px] leading-5 text-muted-foreground uppercase hidden lg:inline"
                  onMouseEnter={() => setIsNotificationsOpen(true)} //Di chuột vào chuông sẽ mở thông báo
                  onMouseLeave={() => setIsNotificationsOpen(false)} // Di chuột ra khỏi chuông sẽ đóng thông báo
                >
                  <div className="hover:text-primary cursor-pointer">
                    {/* Chuông*/}
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
                    {/* Số lượng thông báo chưa đọc */}
                    <span className="absolute top-2 right-4 flex items-center justify-center w-[19px] h-[19px] rounded-full text-[11px] text-white bg-destructive">
                      {unreadCount > 0 ? unreadCount : 0}
                    </span>
                  </div>

                  {/* Dropdown Thông báo */}
                  {isNotificationsOpen && (
                    <div
                      className="absolute right-0 w-[300px] bg-card text-card-foreground shadow-2xl rounded-lg max-h-96 overflow-y-auto border border-border z-50"
                      onMouseLeave={() => {
                        setIsMarkAllDropdownOpen(false);
                        setOpenDropdown(null);
                      }}
                    >
                      <div className="sticky top-0 z-10 bg-card p-2 flex justify-between items-center">
                        <h1 className="text-[13px] font-bold">
                          Thông báo mới nhận
                        </h1>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setIsMarkAllDropdownOpen((prev) => !prev)
                            }
                            className="pb-3 text-[23px] transition"
                          >
                            ...
                          </button>
                          {isMarkAllDropdownOpen && (
                            <div className="absolute right-2 mt-0 bg-card shadow-lg rounded-md z-10 border border-border">
                              <button
                                onClick={markAllAsRead}
                                className="block w-[200px] py-2 text-sm rounded-md text-foreground hover:bg-muted"
                              >
                                Đánh dấu tất cả đã đọc
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Danh sách thông báo */}
                      {notifications.length > 0 ? (
                        <ul className="space-y-2 p-2">
                          {notifications.map((notification) => (
                            <li
                              key={notification._id}
                              className={`flex items-start gap-2 px-3 py-5 rounded-lg transition-all duration-200 cursor-pointer ${
                                !notification.isRead
                                  ? "bg-yellow-100 dark:bg-yellow-900/20"
                                  : "bg-muted"
                              } hover:bg-accent`}
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

                              <div className="flex flex-col gap-1 text-xs w-full">
                                <Link to="/users/order-history">
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: notification.message,
                                    }}
                                    className="break-words line-clamp-4"
                                  />
                                </Link>
                                <span className="text-muted-foreground">
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString()}
                                </span>
                                <div className="relative ml-auto">
                                  <button
                                    className="text-[20px] text-muted-foreground hover:text-destructive"
                                    onClick={(e) => {
                                      // Ngăn chặn sự kiện click lan truyền để không mở thông báo
                                      e.stopPropagation();
                                      setOpenDropdown((prev) =>
                                        prev === notification._id
                                          ? null
                                          : notification._id
                                      );
                                    }}
                                  >
                                    ...
                                  </button>
                                  {openDropdown === notification._id && (
                                    <div className="absolute right-5 top-0 bg-card shadow-lg rounded-md z-10 border border-border">
                                      <button
                                        className="block px-2 py-2 text-sm text-red-600 hover:bg-muted"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteNotification(
                                            notification._id
                                          );
                                        }}
                                      >
                                        Xóa
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-6 text-center text-xs text-muted-foreground">
                          Không có thông báo gì á!
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ❗ Chỉ hiện ở desktop (ẩn ở mobile) */}
                {/* Giỏ hàng */}
                <div className="border-x border-border py-[10px] lg:px-[10px] lg:py-[20px] xl:px-[25px] xl:py-5 text-[10px] leading-5 text-foreground uppercase relative hidden lg:inline">
                  <Link
                    to="/cart"
                    className="cursor-pointer hover:text-primary transition-all flex items-center"
                  >
                    <b className="font-bold">giỏ hàng</b>
                    <span className="relative">
                      <IoBagHandleSharp className="text-xl ml-1 mr-2" />
                      <span className="absolute -top-2 -right-1 bg-primary text-primary-foreground text-[10px] w-[20px] h-[20px] text-center rounded-full">
                        {cart?.products?.length || 0}
                      </span>
                    </span>
                  </Link>
                </div>

                {/* MobileNav & ThemeToggle giữ nguyên */}
                <div className="ml-2 flex items-center gap-4">
                  {/* ❗ Chỉ hiện ở mobile */}
                  <MobileNav />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header BOTTOM */}
        <div className="h-[60px] md:h-[98px] bg-background border-b border-border shadow-custom relative">
          <div className="border-x-0 lg:border-x-[50px] border-transparent h-full">
            {/* Logo + Nav */}
            <div className="flex h-full items-center">
              {/* Logo điều hướng đến trang chủ - trái*/}
              <Link to="/" className="w-4/12 md:w-2/12 px-[15px]">
                <img
                  className="w-20 md:w-36"
                  src={logoUrl || Logo}
                  alt="Logo"
                />
              </Link>

              <div className="w-8/12 md:w-10/12 justify-items-end px-[15px]">
                {/* ❗ Chỉ hiện ở desktop (ẩn ở mobile) */}
                {/* Menu chính */}
                <nav className="hidden lg:block">
                  <ul className="flex gap-2">
                    {menuItems.map((item) => (
                      <li className="!list-none" key={item.to}>
                        <Link
                          to={item.to}
                          className={`text-[11px] leading-4 uppercase font-bold rounded-2xl px-5 py-[9px] transition-all                       
                          ${
                            pathname === item.to
                              ? "bg-primary text-primary-foreground shadow-custom" //Highlight mục đang chọn
                              : "text-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-custom"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                    {/* Tìm kiếm */}
                    <li className="!list-none">
                      <IoSearch
                        className="text-2xl ml-2 cursor-pointer text-foreground hover:text-primary transition-all"
                        // Bật tắt thanh tìm kiếm mở rộng
                        onClick={() => setIsOpen(!isOpen)}
                      />
                    </li>
                  </ul>
                </nav>

                {/* ❗ Chỉ hiện ở mobile */}
                <div className="lg:hidden flex gap-3">
                  {/* Tìm kiếm */}
                  <IoSearch
                    className="text-3xl ml-2 cursor-pointer text-foreground hover:text-primary transition-all"
                    onClick={() => setIsOpen(!isOpen)}
                  />

                  {/* Yêu thích */}
                  <Link to="/wishlist" className="relative">
                    <SlHeart className="text-3xl ml-2 cursor-pointer text-foreground hover:text-primary transition-all" />
                    <span className="absolute -top-3 left-7 flex items-center justify-center w-[19px] h-[19px] rounded-full text-[11px] text-white bg-destructive">
                      {wishList?.products?.length || 0}
                    </span>
                  </Link>

                  {/* Thông báo */}
                  <div
                    className="relative lg:hidden text-[10px] leading-5 uppercase text-muted-foreground"
                    onMouseEnter={() => setIsNotificationsOpen(true)}
                    onMouseLeave={() => setIsNotificationsOpen(false)}
                  >
                    <div className="cursor-pointer hover:text-primary">
                      {/* Chuông nhé */}
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
                      <span className="absolute -top-3 -right-2 flex items-center justify-center w-[19px] h-[19px] rounded-full text-[11px] text-white bg-destructive">
                        {unreadCount > 0 ? unreadCount : 0}
                      </span>
                    </div>

                    {/* Dropdown thông báo */}
                    {isNotificationsOpen && (
                      <div
                        className="absolute right-0 w-[300px] bg-card text-card-foreground shadow-2xl rounded-lg max-h-96 overflow-y-auto border border-border z-50"
                        onMouseLeave={() => {
                          setIsMarkAllDropdownOpen(false);
                          setOpenDropdown(null);
                        }}
                      >
                        <div className="sticky top-0 z-10 bg-card p-2 flex justify-between items-center">
                          <h1 className="text-[13px] font-bold">
                            Thông báo mới nhận
                          </h1>
                          <div className="relative">
                            <button
                              onClick={() =>
                                setIsMarkAllDropdownOpen((prev) => !prev)
                              }
                              className="pb-3 text-[23px] transition"
                            >
                              ...
                            </button>
                            {isMarkAllDropdownOpen && (
                              <div className="absolute right-2 mt-0 bg-card shadow-lg rounded-md z-10 border border-border">
                                <button
                                  onClick={markAllAsRead}
                                  className="block w-[200px] py-2 text-sm rounded-md text-foreground hover:bg-muted"
                                >
                                  Đánh dấu tất cả đã đọc
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {notifications.length > 0 ? (
                          // Danh sách thông báo
                          <ul className="space-y-2 p-2">
                            {notifications.map((notification) => (
                              <li
                                key={notification._id}
                                className={`flex items-start gap-2 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                                  !notification.isRead
                                    ? "bg-yellow-100 dark:bg-yellow-900/20"
                                    : "bg-muted"
                                } hover:bg-accent`}
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

                                <div className="flex flex-col gap-1 text-xs w-full">
                                  <Link to="/users/order-history">
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: notification.message,
                                      }}
                                      className="break-words line-clamp-3"
                                    />
                                  </Link>
                                  <span className="text-muted-foreground">
                                    {new Date(
                                      notification.createdAt
                                    ).toLocaleString()}
                                  </span>

                                  <div className="relative ml-auto">
                                    <button
                                      className="text-[20px] text-muted-foreground hover:text-foreground"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDropdown((prev) =>
                                          prev === notification._id
                                            ? null
                                            : notification._id
                                        );
                                      }}
                                    >
                                      ...
                                    </button>
                                    {openDropdown === notification._id && (
                                      <div className="absolute right-4 top-0 bg-card shadow-lg rounded-md z-10 border border-border">
                                        <button
                                          className="block px-2 py-1 text-sm text-red-600 hover:bg-muted"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteNotification(
                                              notification._id
                                            );
                                          }}
                                        >
                                          Xóa
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-6 text-center text-xs text-muted-foreground">
                            Không có thông báo nào!
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Giỏ hàng */}
                  <span className="relative mr-2">
                    <Link to="/cart">
                      <IoBagHandleSharp className="text-3xl ml-2 cursor-pointer text-foreground hover:text-primary transition-all" />
                      <span className="absolute size-5 rounded-full text-primary-foreground text-[11px] leading-5 text-center bg-primary top-[-39%] right-[-23%]">
                        {cart?.products?.length || 0}
                      </span>
                    </Link>
                  </span>
                </div>
              </div>
            </div>

            {/* Search Bar - Thanh tìm kiếm mở rộng */}
            <div className="relative -z-30 ">
              <div
                className={`py-10 pb-[15px] md:pb-10 absolute w-full top-0 left-0 shadow-custom_input transition-all duration-300 bg-background ${
                  isOpen
                    ? "translate-y-0 opacity-100" //Mở trượt xuống
                    : "-translate-y-full opacity-0" // Ẩn trượt lên ngoài khung
                }`}
              >
                <div className="px-[15px] flex justify-center items-center gap-2">
                  {/* Nút đóng khung tìm kiếm */}
                  <IoIosClose
                    className="text-3xl absolute right-0 top-0 mt-2 mr-2 cursor-pointer text-foreground hover:text-primary"
                    onClick={() => setIsOpen(!isOpen)}
                  />

                  <div className="relative w-full md:w-3/4 flex items-center border-b border-border focus-within:border-primary">
                    <input
                      type="text"
                      value={keyProduct}
                      onChange={(e) => {
                        setKeyProduct(e.target.value);
                        setHighlightedIndex(-1); // Reset chỉ mục được đánh dấu khi người dùng nhập
                      }}
                      placeholder="Nhập từ khóa tìm kiếm sản phẩm ở đây nhé ..."
                      className="flex-1 bg-background outline-none px-3 py-2 text-sm text-foreground placeholder-muted-foreground"
                      //Xử lý bàn phím: ↑ ↓ Enter
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          setHighlightedIndex((prev) =>
                            prev < suggestedKeywords.length - 1 ? prev + 1 : 0
                          );
                        } else if (e.key === "ArrowUp") {
                          setHighlightedIndex((prev) =>
                            prev > 0 ? prev - 1 : suggestedKeywords.length - 1
                          );
                        } else if (e.key === "Enter") {
                          if (highlightedIndex >= 0) {
                            const selectedKeyword =
                              suggestedKeywords[highlightedIndex];
                            setKeyProduct(selectedKeyword);
                            setSuggestedKeywords([]);
                            setIsOpen(false);
                            handleSearch(selectedKeyword); // ✅ truyền đúng từ gợi ý
                          } else {
                            handleSearch(); // dùng giá trị hiện tại trong input
                          }
                        }
                      }}
                    />

                    {/* Gợi ý từ khóa */}
                    {Array.isArray(suggestedKeywords) &&
                      suggestedKeywords.length > 0 && (
                        <ul className="absolute top-full left-0 mt-1 right-0 z-50 bg-card text-card-foreground border border-border rounded shadow text-sm max-h-48 overflow-y-auto">
                          {suggestedKeywords.map((keyword, idx) => {
                            const lowerKeyword = keyword.toLowerCase();
                            const lowerInput = keyProduct.toLowerCase();
                            const matchIndex = lowerKeyword.indexOf(lowerInput);

                            return (
                              <li
                                key={idx}
                                className={`px-4 py-2 cursor-pointer ${
                                  highlightedIndex === idx
                                    ? "bg-primary text-black dark:text-primary-foreground" // Highlight mục được chọn
                                    : "hover:bg-muted"
                                }`}
                                onMouseEnter={() => setHighlightedIndex(idx)}
                                onClick={() => {
                                  setKeyProduct(keyword);
                                  setSuggestedKeywords([]);
                                  setIsOpen(false);
                                  handleSearch(keyword); // ✅ truyền trực tiếp
                                }}
                              >
                                {/* In đậm phần khớp với từ khóa */}
                                {matchIndex >= 0 ? (
                                  <>
                                    {keyword.slice(0, matchIndex)}
                                    <strong className="text-black dark:text-primary-foreground">
                                      {keyword.slice(
                                        matchIndex,
                                        matchIndex + keyProduct.length
                                      )}
                                    </strong>
                                    {keyword.slice(
                                      matchIndex + keyProduct.length
                                    )}
                                  </>
                                ) : (
                                  keyword
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                  </div>

                  {/* <button onClick={handleSearch}> */}
                  <button onClick={() => handleSearch()}>
                    <IoSearch className="text-2xl text-foreground hover:text-primary" />
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
