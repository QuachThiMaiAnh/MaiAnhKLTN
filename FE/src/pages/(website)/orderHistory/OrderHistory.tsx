import { useUserContext } from "@/common/context/UserProvider";
import useOrder from "@/common/hooks/order/UseOrder";
import { useState } from "react";
import StatusMenu from "./StatusMenu";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Import pagination components
import { OrderProduct } from "@/common/types/Orders";
import CommentProduct from "./CommentProduct";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

interface Order {
  _id: string;
  orderCode: string;
  createdAt: string; // Hoặc Date nếu bạn lưu ngày dưới dạng đối tượng Date
  status: string;
  totalPrice: number;
}

interface ErrorResponse {
  response?: {
    data: {
      message: string;
    };
  };
}

export const formatCurrencyVND = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const apiUrl = import.meta.env.VITE_API_URL;

const OrderHistory = () => {
  const { _id } = useUserContext() ?? {}; // Lấy _id từ UserContext
  const queryClient = useQueryClient(); // Đặt useQueryClient ở trên đầu
  const { data, isLoading } = useOrder(_id); // Destructure loading and error status
  const [selectedStatus, setSelectedStatus] = useState<string>("chờ xác nhận");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const { user: dataUser } = useUser();
  const Gmail = dataUser?.primaryEmailAddress?.emailAddress;
  const [isOpen, setIsOpen] = useState(false); // Điều khiển hiển thị của modal
  const [reason, setReason] = useState(""); // Lý do hủy đơn hàng
  const [orderIdToCancel, setOrderIdToCancel] = useState<string | null>(null);
  const user = Gmail;

  const openModal = (id: string) => {
    setOrderIdToCancel(id); // Lưu id của đơn hàng khi mở modal
    setIsOpen(true); // Mở modal
  };
  const closeModal = () => setIsOpen(false);
  const ordersPerPage = 2; // Số đơn hàng hiển thị mỗi trang
  const handleCancelOrder = async () => {
    const newStatus = "hủy đơn";
    if (!orderIdToCancel) {
      alert("Không lấy được OrderId");
      return;
    }
    if (!reason.trim()) {
      alert("Vui lòng nhập lý do hủy.");
      return;
    }

    // Lấy orderCode từ orderIdToCancel
    const orderToCancel = (data || []).find(
      (order: Order) => order._id === orderIdToCancel
    );
    const orderCode = orderToCancel?.orderCode;

    if (!orderCode) {
      alert("Không tìm thấy mã đơn hàng.");
      return;
    }
    // Gửi lý do hủy đơn hàng ở đây
    // await updateOrderStatus(
    //   orderIdToCancel,
    //   newStatus,reason
    // );
    try {
      const response = await axios.put(
        `${apiUrl}/update-order/${orderIdToCancel}`,
        {
          newStatus,
          user,
          userId: _id,
          reason,
        }
      ); // Đường dẫn API hủy đơn hàng
      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: ["ORDER_HISTORY", _id],
        });
        toast({
          className: "bg-green-400 text-white h-auto",

          title: "Thành công",
          description: "Đơn hàng đã được hủy thành công.",
          variant: "default",
        });

        const firstProductImage = orderToCancel?.products[0]?.productItem?.image;

        // Emit thông báo qua socket 
        socket.emit("orderStatusChanged", {
          orderId: orderIdToCancel,
          orderCode,
          newStatus,
          userId: _id,
          productImage: firstProductImage,
          productName: orderToCancel?.products[0]?.productItem?.name
        });

      }
    } catch (error) {
      console.error(error);
      const err = error as ErrorResponse;
      if (err.response && err.response.data) {
        toast({
          title: "Lỗi",
          description:
            err.response.data.message || "Cập nhật trạng thái thất bại!",
          variant: "destructive",
        });
      }
    }
    setReason("");
    setIsOpen(false); // Đóng modal sau khi hủy
  };
  // const cancelOrder = async (orderId: string) => {
  //   const newStatus = "đã hủy";
  //   try {
  //     const response = await axios.put(`${apiUrl}/update-order/${orderId}`, {
  //       newStatus,
  //     }); // Đường dẫn API hủy đơn hàng
  //     if (response.status === 200) {
  //       queryClient.invalidateQueries(["ORDER_HISTORY", _id]);
  //       toast({
  //         title: "Thành công",
  //         description: "Đơn hàng đã được hủy thành công.",
  //         variant: "default",
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     const err = error as ErrorResponse;
  //     if (err.response && err.response.data) {
  //       toast({
  //         title: "Lỗi",
  //         description:
  //           err.response.data.message || "Cập nhật trạng thái thất bại!",
  //         variant: "destructive",
  //       });
  //     } else {
  //       toast({
  //         title: "Lỗi kết nối",
  //         description: "Lỗi kết nối server!",
  //         variant: "destructive",
  //       });
  //     }
  //   }
  // };
  const paymentMethod = async (orderId: OrderProduct) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/create_payment_url",
        {
          amount: orderId.totalPrice,
          orderCode: orderId.orderCode,
          bankCode: "VNB",
        }
      );
      const paymentUrl = response.data.redirectUrl;
      window.location.href = paymentUrl;
      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: ["ORDER_HISTORY", _id],
        });
      }
    } catch (error) {
      console.error(error);
      const err = error as ErrorResponse;
      if (err.response && err.response.data) {
        toast({

          title: "Lỗi",
          description:
            err.response.data.message || "Cập nhật trạng thái thất bại!",
          variant: "destructive",
        });
      } else {
        toast({

          title: "Lỗi kết nối",
          description: "Lỗi kết nối server!",
          variant: "destructive",
        });
      }
    }
  };

  // Lọc đơn hàng theo trạng thái và mã đơn hàng
  const filteredOrders = (data || [])
    .filter((order: Order) => order.status === selectedStatus)
    .filter((order: Order) =>
      order.orderCode.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort(
      (a: Order, b: Order) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    console.log("filteredOrders", filteredOrders)
  // Xử lý phân trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="container p-6">
      {/* Status Menu */}
      <StatusMenu
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Tìm kiếm mã đơn hàng */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm mã đơn hàng..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Danh sách đơn hàng */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="min-h-[50vh] flex justify-center items-center text-gray-500">
            <div className="spinner"></div>
          </div>
        ) : currentOrders.length > 0 ? (
          currentOrders?.map((order: OrderProduct) => (
            <div key={order._id} className="p-4 border rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg">
                    Mã đơn hàng:{" "}
                    <span className="font-semibold">{order.orderCode}</span>
                  </div>
                  <div className="text-sm">
                    Ngày mua hàng: {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-green-500 font-semibold text-lg">
                  <span className="text-black">Trạng thái:</span> {order.status}
                </div>
              </div>

              {/* Hiển thị sản phẩm trong đơn hàng */}
              <div className="mt-2">
                {order.products && order.products.length > 0 ? (
                  order?.products?.map((item) => (
                    <div key={item._id}>
                      <div className="flex justify-between items-center">
                        {/* sản phẩm */}
                        <Link to={`/product/${item.productItem._id}`}>
                          <div className="flex items-center space-x-4 space-y-4">
                            <img
                              src={
                                item.productItem?.image || "/default-image.jpg"
                              }
                              alt={
                                item.productItem?.name ||
                                "Sản phẩm không có tên"
                              }
                              className="w-16 h-16 object-cover"
                            />
                            <div>
                              <div className="font-medium">
                                {item.productItem?.name ||
                                  "Sản phẩm không có tên"}
                              </div>
                              <div className="text-sm">
                                Số lượng: {item.quantity}
                              </div>
                              <div className="text-sm">
                                {item?.variantItem?.values?.map(
                                  (value, index: number) => (
                                    <div key={value._id}>
                                      {value.type}: {value.name}
                                      {index <
                                        item.variantItem.values.length - 1
                                        ? ","
                                        : ""}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                        <div>
                          <span className="text-[#81cd06]">
                            Giá:{" "}
                            {formatCurrencyVND(
                              item.variantItem?.priceSale ||
                              item.variantItem?.price
                            )}
                          </span>

                          {item.statusComment && !item.isCommented && (
                            <CommentProduct
                              values={item.variantItem.values}
                              productId={item.productItem._id}
                              orderId={order._id}
                              itemId={item._id}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500">
                    Không có sản phẩm trong đơn hàng này.
                  </div>
                )}
              </div>
              <div className="mt-4  text-lg">
                {/* <h3 className="font-semibold">Địa chỉ nhận hàng</h3> */}
                {order.addressId && Object.keys(order.addressId).length > 0 ? (
                  <div>
                    <p>
                      <span className="font-semibold">Người nhận:</span>{" "}
                      {order.addressId.name}
                    </p>
                    <p>
                      <span className="font-semibold">Số điện thoại:</span>{" "}
                      {order.addressId.phone}
                    </p>
                    <p>
                      <span className="font-semibold">Địa chỉ:</span>{" "}
                      {order.addressId.addressDetail}, {order.addressId.wardId},{" "}
                      {order.addressId.districtId}, {order.addressId.cityId}
                    </p>
                  </div>
                ) : (
                  <div>Không có địa chỉ được cung cấp.</div>
                )}
              </div>
              <div className="mt-4  text-lg text-right">
                <p className="text-[rgba(0,0,0,.8)] text-[16px]">
                  Giảm giá:{" "}
                  <span className="text-[rgba(0,0,0,.8)]">
                    {order.discount > 0 ? `- ${formatCurrencyVND(order.discount)}` : formatCurrencyVND(0)}
                  </span>
                </p>
              </div>
              <div className="mt-4 text-[rgba(0,0,0,.8)] text-[16px] text-right">
                <p>
                  Phí ship: <span className="text-[rgba(0,0,0,.8)]">30.000 ₫</span>
                </p>
              </div>
              <div className="mt-4 text-lg text-right">
                Tổng tiền:{" "}
                <span className="font-semibold text-[red]">
                  {formatCurrencyVND(order.totalPrice)}
                </span>
                {(order.status === "chờ xác nhận" ||
                  order.status === "đã xác nhận") && (
                    <button
                      className="px-4 ml-[2%] py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => openModal(order._id)}
                    >
                      Hủy đơn hàng
                    </button>
                  )}
                {isOpen && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                      <h2 className="text-xl font-semibold text-center mb-4">
                        Xác Nhận Hủy Đơn Hàng
                      </h2>
                      {/* Ô nhập lý do hủy */}
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Nhập lý do hủy..."
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                      />

                      <div className="flex justify-between">
                        <button
                          onClick={handleCancelOrder}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Xác Nhận Hủy
                        </button>
                        <button
                          onClick={closeModal}
                          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {order.isPaid === false && order.payment === "Vnpay" && (
                  <button
                    className="px-4 ml-[2%] py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    onClick={() => paymentMethod(order)}
                  >
                    Thanh toán ngay
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            Không có đơn hàng nào với trạng thái "{selectedStatus}"{" "}
            {searchQuery && ` và mã đơn hàng "${searchQuery}"`} .
          </div>
        )}
      </div>
      {/* Phân trang */}
      <Pagination className="mt-8">
        <PaginationContent>
          {/* Nút Trước */}
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer"
              onClick={() => handlePageChange(currentPage - 1)}
            // disabled={currentPage === 1}
            />
          </PaginationItem>

          {/* Hiển thị danh sách các trang */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              // Hiển thị trang đầu, trang cuối, và các trang xung quanh currentPage
              return (
                page === 1 || // Trang đầu
                page === totalPages || // Trang cuối
                (page >= currentPage - 2 && page <= currentPage + 2) // Các trang xung quanh currentPage
              );
            })
            .reduce((acc, page, index, array) => {
              // Thêm dấu ... giữa các trang không liền kề
              if (index > 0 && page > array[index - 1] + 1) {
                acc.push("...");
              }
              acc.push(page);
              return acc;
            }, [] as (number | string)[])
            .map((page, index) =>
              page === "..." ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <span className="px-2">...</span>
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    className="cursor-pointer"
                    onClick={() => handlePageChange(page as number)}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

          {/* Nút Tiếp */}
          <PaginationItem>
            <PaginationNext
              className="cursor-pointer"
              onClick={() => handlePageChange(currentPage + 1)}
            // disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default OrderHistory;
