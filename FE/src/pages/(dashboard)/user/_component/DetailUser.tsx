import useAddress from "@/common/hooks/address/useAddress";
import useOrder from "@/common/hooks/order/UseOrder";
import { User } from "@/common/types/User";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaginationComponent from "./Paginations";
import { Order } from "@/common/types/Orders";
import { Address } from "@/pages/(website)/address/ListAddress";

const UserDetailPage = () => {
  const { clerkId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage, setItemsPerPage] = useState(5); // Số mục mỗi trang
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();

  useEffect(() => {
    if (!id) document.title = "Chi Tiết Người Dùng";
  }, [id]);

  useEffect(() => {
    if (clerkId) {
      fetchUserDetail();
    }
  }, [clerkId]);

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/users/${clerkId}`);
      setUser(res.data);
      setUserId(res.data._id);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      setError("Không thể lấy thông tin người dùng.");
    } finally {
      setLoading(false);
    }
  };

  const { data: addresses, isLoading: addressLoading } = useAddress(
    userId || undefined
  );
  const { data: orders } = useOrder(userId || undefined);

  // Sắp xếp các đơn hàng theo ngày đặt hàng (newest first)
  const sortedOrders = orders?.sort(
    (a: Order, b: Order) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Lọc đơn hàng theo tên người dùng (hoặc thông tin khác như mã đơn hàng)
  const filteredOrders = sortedOrders?.filter((order: Order) => {
    const cleanSearchQuery = searchQuery.trim().toLowerCase();
    return order.orderCode.toLowerCase().includes(cleanSearchQuery); // tìm theo mã đơn hàng
  });

  // Lấy danh sách user hiển thị trên trang hiện tại
  const currentOrders = filteredOrders?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  // Tính toán số trang
  const totalPages = Math.ceil((filteredOrders?.length || 0) / itemsPerPage);

  if (loading)
    return <div className="text-center text-gray-600">Đang tải...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!user)
    return (
      <div className="text-center text-gray-600 ">
        Không tìm thấy người dùng.
      </div>
    );

  return (
    <div className=" mx-auto p-8 min-h-screen">
      {/* Phần thông tin người dùng */}
      <div className=" shadow rounded-xl p-5 flex flex-col items-center">
        <h1 className="sm:text-4xl text-xl mb-8 font-semibold">
          Hồ Sơ Người Dùng
        </h1>
        {/* Ảnh người dùng */}
        <div className="w-32 h-32 mb-6">
          <img
            src={user.imageUrl || "https://via.placeholder.com/150"}
            alt="Ảnh người dùng"
            className="rounded-full shadow-lg border-4 border-teal-500"
          />
        </div>

        {/* Thông tin cơ bản */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-gray-600 mb-2">{user.email}</p>
        <p className="text-gray-600 font-medium mb-2">Vai trò: {user.role}</p>
        <div className="mb-20 font-semibold">
          <p className={`text-${user.isBanned ? "red" : "green"}-600`}>
            {user.isBanned ? "Đã bị khóa" : "Đang hoạt động"}
          </p>
        </div>

        {/* Chi tiết người dùng */}
        <div className="w-full grid grid-cols-1  gap-8">
          {/* Địa chỉ giao hàng */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
            <h3 className="text-xl text-center font-semibold text-teal-600 mb-3">
              Địa chỉ người dùng
            </h3>
            {addressLoading ? (
              <p className="text-center text-slate-600">Đang tải địa chỉ...</p>
            ) : (
              <ul>
                {addresses && addresses.length > 0 ? (
                  addresses.map((address: Address) => (
                    <li key={address._id} className="mb-10">
                      <p className="text-gray-600">
                        <strong>Điện thoại:</strong> {address.phone}
                      </p>
                      <p className="text-gray-600">
                        <strong>Địa chỉ:</strong> {address.wardId},{" "}
                        {address.districtId}, {address.cityId}
                      </p>
                      <p className="text-gray-600">
                        <strong>Địa chỉ cụ thể:</strong> {address.addressDetail}
                      </p>
                      {address.isDefault && (
                        <p className="text-green-500 mt-2 pb-2 font-semibold">
                          Địa chỉ mặc định
                        </p>
                      )}
                      <hr />
                    </li>
                  ))
                ) : (
                  <p className="text-center mt-5 text-slate-600">
                    Không có dữ liệu.!
                  </p>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Lịch sử đơn hàng */}
        <div className="w-full mt-10 bg-white rounded-lg  p-8 border border-gray-300">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Lịch sử đơn hàng
            </h3>
            {/* Phần tìm kiếm */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className=" overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 text-nowrap border-b-2 border-gray-300 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="px-5 py-3 text-nowrap border-b-2 border-gray-300 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Ngày đặt hàng
                  </th>
                  <th className="px-5 py-3 text-nowrap border-b-2 border-gray-300 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-5 py-3 text-nowrap border-b-2 border-gray-300 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {!orders ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-600">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : currentOrders && currentOrders.length > 0 ? (
                  currentOrders.map((order: Order) => (
                    <tr
                      onClick={() =>
                        navigate(`/admin/orders/orderdetails/${order._id}`)
                      }
                      className="cursor-pointer"
                    >
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {order.orderCode}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {new Date(order.createdAt).toLocaleString("vi-VN", {
                          weekday: "long", // Thứ
                          year: "numeric", // Năm
                          month: "numeric", // Tháng
                          day: "numeric", // Ngày
                          hour: "2-digit", // Giờ
                          minute: "2-digit", // Phút
                          second: "2-digit", // Giây
                        })}
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {order.totalPrice?.toLocaleString("vi-VN")} VNĐ
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <span
                          className={`relative inline-block px-3 py-1 text-sm rounded-xl leading-tight ${
                            order.status === "chờ xác nhận"
                              ? "text-yellow-700 bg-yellow-100" // Xanh dương nhạt
                              : order.status === "đang giao hàng"
                              ? "text-green-700 bg-green-100" // Vàng nhạt
                              : order.status === "đã hoàn thành"
                              ? "text-green-800 bg-green-200 font-bold" // Xanh lá nhạt
                              : order.status === "đã hủy"
                              ? "text-red-700 bg-red-100" // Đỏ nhạt
                              : order.status === "đã xác nhận"
                              ? "text-blue-700 bg-blue-100" // Xanh biển nhạt
                              : "text-gray-700 bg-gray-100" // Xám nhạt
                          }`}
                        >
                          <span className="relative text-nowrap">
                            {order.status}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-slate-600">
                      Không có dữ liệu !
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Phân trang */}
          <div className="mt-4">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSize={itemsPerPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
