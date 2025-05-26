import { useUserContext } from "@/common/context/UserProvider";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const NotificationList = () => {
  const { _id, role } = useUserContext();
  //thông báo
  const [notifications, setNotifications] = useState<any[]>([]); // Danh sách thông báo
  const [unreadCount, setUnreadCount] = useState<number>(0); // Số lượng thông báo chưa đọc
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState<boolean>(false);
  const [isMarkAllDropdownOpen, setIsMarkAllDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { toast } = useToast();

  const isAdmin = role === "Admin";

  // console.log("cart", cart);

  useEffect(() => {
    if (_id) {
      socket.emit("join_room", _id); // Tham gia phòng với userId
      console.log(`User với id: ${_id} đã tham gia phòng`);
    }
  }, [_id]);

  // Lấy thông báo từ API
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/notifications`
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
      const unreadCount = newNotifications.filter(
        (n) => !n.isReadByAdmin
      ).length;
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Đánh dấu thông báo là đã đọc
  const handleNotificationClick = async (notificationId: string) => {
    try {
      if (isAdmin) {
        // Nếu là admin, gọi API cho admin
        await axios.post(
          `http://localhost:8080/api/notifications/mark-as-read-by-admin/${notificationId}`,
          {
            adminId: _id, // Truyền adminId vào body
          }
        );
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif._id === notificationId
              ? { ...notif, isReadByAdmin: true }
              : notif
          )
        );
      }

      // Lấy lại số lượng thông báo chưa đọc từ server sau khi thay đổi
      setUnreadCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));

      // const response = await axios.get(
      //   `http://localhost:8080/api/notifications/unread-count/${_id}`
      // );
      // setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Đánh dấu tất cả thông báo là đã đọc cho admin
  const markAllAsReadByAdmin = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/notifications/mark-as-read-by-admin/all`,
        {
          adminId: _id, // Truyền adminId vào body
        }
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({ ...notif, isReadByAdmin: true }))
      );
      setUnreadCount(0); // Đặt lại số lượng chưa đọc về 0
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Không thể đánh dấu tất cả là đã đọc!",
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
    socket.on("adminOrderPlacedNotification", (newNotification) => {
      console.log("Thông báo nhận được:", newNotification);
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
        const unreadCount = updatedNotifications.filter((n) => !n.isReadByAdmin)
          .length;
        setUnreadCount(unreadCount);
  
        return updatedNotifications;
      });
    });
  
    // Lắng nghe sự kiện orderStatusNotification
    socket.on("adminOrderStatusNotification", (newNotification) => {
      console.log("Thông báo trạng thái nhận được:", newNotification);
  
      setNotifications((prevNotifications) => {
        const updatedNotifications = [newNotification, ...prevNotifications];
        const unreadCount = updatedNotifications.filter((n) => !n.isReadByAdmin)
          .length;
        setUnreadCount(unreadCount);
  
        return updatedNotifications;
      });
    });
  
    return () => {
      socket.off("adminOrderPlacedNotification");
      socket.off("adminOrderStatusNotification");
    };
  }, [_id]); 

  return (
    <div
      className="relative mr-5  border-[#eee] py-[10px] lg:px-[10px] lg:py-[16px] xl:px-[25px] text-[10px] leading-5 text-[#555] uppercase "
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
        <span className="absolute top-0 -right-2  lg:top-2 lg:right-0 xl:right-4 flex items-center justify-center w-[19px] h-[19px] rounded-full text-[11px] text-white bg-red-500">
          {unreadCount > 0 ? unreadCount : 0}
        </span>
      </div>

      {/* Dropdown Thông báo */}
      {isNotificationsOpen && (
        <div
          className="absolute right-2 lg:right-5 text-right  w-[300px] bg-white shadow-2xl rounded-lg max-h-96 overflow-y-auto border border-gray-200 scrollbar-hide z-50"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE & Edge
          }}
          onMouseLeave={() => {
            setIsMarkAllDropdownOpen(false);
            setOpenDropdown(null);
          }}
        >
          <div className="sticky top-0 z-10 p-2 flex justify-between items-center bg-white">
            <h1 className="text-[13px] font-bold">Thông báo mới nhận</h1>

            {/* Nút ba chấm */}
            <div className="relative">
              <button
                onClick={() => setIsMarkAllDropdownOpen((prev) => !prev)}
                className="pb-3 text-[23px]  transition"
              >
                ...
              </button>
              {isMarkAllDropdownOpen && (
                <div className="absolute right-2 mt-0 bg-white shadow-lg shadow-gray-500 rounded-md z-10">
                  <button
                    onClick={markAllAsReadByAdmin}
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
                    !notification.isReadByAdmin ? "bg-[#f5ffcc]" : "bg-gray-50"
                  }`}
                  onClick={() => handleNotificationClick(notification._id)}
                >
                  <Link
                    to={`/admin/orders/orderdetails/${notification.orderId}`}
                    className="flex items-center gap-3"
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
                        <div className="truncate text-wrap">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: notification.message,
                            }}
                          />
                        </div>
                      </div>

                      {/* Thời gian thông báo */}
                      <div className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </Link>
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
  );
};

export default NotificationList;
