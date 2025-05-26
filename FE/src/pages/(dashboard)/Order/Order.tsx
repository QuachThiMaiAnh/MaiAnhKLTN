import useAllOrders from "@/common/hooks/order/useAllOrders";
import { OrderProduct } from "@/common/types/Orders";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import * as React from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
import { PaginationProducts } from "../dashboard/_components/PaginationProducts";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export type Order = {
  id: string;
  userId: string;
  orderCode: string;
  amount: number;
  isPaid: boolean;
  payment: string;
  email?: string;
  status: string;
  createdAt: string;
};

interface ErrorResponse {
  response?: {
    data: {
      message: string;
    };
  };
}

const apiUrl = import.meta.env.VITE_API_URL;
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const AdminOrder = () => {
  React.useEffect(() => {
    document.title = "Đơn hàng"; // Đặt tiêu đề cho trang
  }, []);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useAllOrders();
  const [search, setSearch] = React.useState<string>("");
  const { user: dataUser } = useUser();
  const Gmail = dataUser?.primaryEmailAddress?.emailAddress;
  const [isOpen, setIsOpen] = React.useState(false); // Điều khiển hiển thị của modal
  const [reason, setReason] = React.useState(""); // Lý do hủy đơn hàng
  const [orderIdToCancel, setOrderIdToCancel] = React.useState<string | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = React.useState<string>("");
  // Mở modal

  const openModal = () => setIsOpen(true);

  // Đóng modal
  const closeModal = () => setIsOpen(false);
  // Xử lý hủy đơn hàng
  const handleCancelOrder = async () => {
    if (!orderIdToCancel) {
      alert("Không lấy được OrderId");
      return;
    }
    const newStatus = "hủy đơn";
    if (!reason.trim()) {
      alert("Vui lòng nhập lý do hủy.");
      return;
    }


    const order = orders.find((o) => o.id === orderIdToCancel);  // Tìm đơn hàng theo orderId
    if (!order || !order.userId) {
      alert("Không tìm thấy thông tin người dùng");
      return;
    }

    // Gửi lý do hủy đơn hàng ở đây
    await updateOrderStatus(
      orderIdToCancel,
      newStatus,
      reason,
      order.userId,
      order.orderCode
    );
    setReason("");
    setIsOpen(false); // Đóng modal sau khi hủy
  };
  const orders: Order[] = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data
      .map((order: OrderProduct) => ({
        id: order._id,
        orderCode: order.orderCode || "N/A",
        amount: order.totalPrice || 0,
        payment: order.payment || "N/A",
        status: order.status || "unknown",
        createdAt: order.createdAt || "",
        userId: order.userId,
        email: order.email || "",
        isPaid: order.isPaid,
      }))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [data]);
  const user = Gmail;
  const updateOrderStatus = async (
    orderId: string,
    newStatus: string,
    reason: string,
    userId: string,
    orderCode: string
  ) => {
    try {
      const response = await axios.put(`${apiUrl}/update-order/${orderId}`, {
        newStatus,
        user,
        userId,
        reason,
      });

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: ["ORDER_HISTORY"],
        });
        
        toast({
        className: "bg-green-400 text-white h-auto",

          title: "Thành công!",
          description: "Cập nhật trạng thái thành công!",
          variant: "default",
        });

        // Gửi thông báo thay đổi trạng thái đơn hàng tới server
        socket.emit("orderStatusChanged", { orderCode, newStatus, userId, orderId });

        return true;
      }
      return false;
    } catch (error) {
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

  // hủy
  // const cancelOrder = async (orderId: string, userId: string) => {
  //   const newStatus = "đã hủy";
  //   try {
  //     const reason = "Lỗi thao tác của người dùng!";
  //     const response = await axios.put(`${apiUrl}/update-order/${orderId}`, {
  //       newStatus,
  //       reason,
  //       userId,
  //     }); // Đường dẫn API hủy đơn hàng
  //     if (response.status === 200) {
  //       queryClient.invalidateQueries(["ORDER_HISTORY", orderId]);
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

  // Kiểm tra nếu đơn hàng cần hủy sau 5 phút từ thời điểm tạo đơn hàng
  React.useEffect(() => {
    // Lưu trữ các ID của timeout để clear sau
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Lặp qua các đơn hàng để kiểm tra
    orders.forEach(async (order) => {
      // Chỉ xử lý các đơn hàng có trạng thái "chờ xác nhận" và payment là "Vnpay"
      if (order.isPaid === false && order.payment === "Vnpay" && order.status !== "hủy đơn") {
        await axios.put(
          `${apiUrl}/delete-orderAdmin/${order.id}`
        );
        queryClient.invalidateQueries({
          queryKey: ["ORDER_HISTORY"],
        });
        
      }
    });

    // Cleanup function để hủy các timeout cũ khi component unmount hoặc orders thay đổi
    return () => {
      // Hủy tất cả các timeout nếu component bị unmount hoặc orders thay đổi
      timers.forEach((timerId) => clearTimeout(timerId));
    };
  }, [orders]);

  const columns: ColumnDef<Order>[] = React.useMemo(
    () => [
      {
        header: "Mã đơn hàng",
        accessorKey: "orderCode",
      },
      {
        header: "Số tiền",
        accessorKey: "amount",
        cell: ({ row }) => {
          const amount = formatCurrency(row.original.amount);
          return <span>{amount} VNĐ</span>;
        },
      },
      {
        header: "Phương thức thanh toán",
        accessorKey: "payment",
        cell: ({ row }) => (
          <span className={getPaymentClassName(row.original.payment)}>
            {row.original.payment}
          </span>
        ),
      },
      {
        header: "Trạng thái",
        accessorKey: "status",
        cell: ({ row }) => (
          <span className={getStatusClassName(row.original.status)}>
            {row.original.status}
          </span>
        ),
      },
      {
        header: "Khách hàng",
        accessorKey: "email",
        cell: ({ row }) => (
          <span className={row.original.email}>{row.original.email}</span>
        ),
      },
      {
        header: "Trạng thái thanh toán",
        accessorKey: "isPaid",
        cell: ({ row }) => (
          <span
            className={
              row.original.isPaid
                ? "text-green-500 font-semibold"
                : "text-red-500 font-semibold"
            }
          >
            {row.original.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
          </span>
        ),
      },
      {
        header: "Ngày tạo",
        accessorKey: "createdAt",
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        header: "Thao tác",
        accessorKey: "id",
        cell: ({ row }) => {
          console.log(row.original);
          return (
            <div className="flex gap-2">
              <Link to={`/admin/orders/orderdetails/${row.original.id}`}>
                <Button variant="default" size="sm">
                  Xem chi tiết
                </Button>
              </Link>

              <div className="*:m-0">
                <Select
                  value={row.original.status}
                  onValueChange={async (newStatus) => {
                    if (newStatus === "hủy đơn") {
                      setOrderIdToCancel(row.original.id);
                      openModal();
                      return;
                    }
                    if (newStatus !== row.original.status) {
                      const isUpdated = await updateOrderStatus(
                        row.original.id,
                        newStatus,
                        reason, // Lý do nếu có
                        row.original.userId,
                        row.original.orderCode
                      );
                      if (isUpdated) {
                        row.original.status = newStatus; // Cập nhật trạng thái mới cho dòng
                      }
                    }
                  }}
                  disabled={
                    row.original.status === "đã hoàn thành" ||
                    row.original.status === "hủy đơn"
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {[
                        "chờ xác nhận",
                        "đã xác nhận",
                        "đang giao hàng",
                        "đã hoàn thành",
                        "hủy đơn",
                      ].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  // Lọc kết quả dựa trên Search và Status
  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderCode.toLowerCase().includes(search.toLowerCase()) ||
        (order?.email &&
          order.email.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus =
        selectedStatus === "" || order.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, selectedStatus]);

  const [paginationState, setPaginationState] = React.useState({
    pageIndex: 0, // Trang đầu tiên
    pageSize: 8, // Số hàng mỗi trang
  });

  const table = useReactTable({
    data: filteredOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: paginationState,
    },
    onPaginationChange: setPaginationState, // Cập nhật trạng thái phân trang khi chuyển trang
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center text-gray-500">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-[10rem] my-10   ">
          <AiOutlineExclamationCircle className="text-red-500 text-xl mr-2" />
          <span className="text-red-600 font-semibold">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</span>
        </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white rounded-sm">
      <h3 className="text-xl font-semibold mb-4">Danh sánh đơn hàng</h3>
      <div className="mb-4 w-[18%]">
        <input
          type="text"
          className="border w-full border-gray-300 p-2 rounded"
          placeholder="Tìm kiếm theo khách hàng,mã đơn hàng"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* Lọc trạng thái */}
        <Select
          value={selectedStatus}
          onValueChange={(value) => {
            // Nếu giá trị là 'all', chuyển thành ''
            setSelectedStatus(value === "all" ? "" : value);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="chờ xác nhận">Chờ xác nhận</SelectItem>
            <SelectItem value="đã xác nhận">đã xác nhận</SelectItem>
            <SelectItem value="đang giao hàng">đang giao hàng</SelectItem>
            <SelectItem value="đã hoàn thành">Đã hoàn thành</SelectItem>
            <SelectItem value="hủy đơn">hủy đơn</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-selected={row.getIsSelected()}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationProducts table={table} />
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold text-center mb-4">
              Xác Nhận Hủy Đơn Hàng
            </h2>
            <p className="text-gray-700 mb-4">
              Bạn có chắc chắn muốn hủy đơn hàng không?
            </p>

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
    </div>
  );
};
const getStatusClassName = (status: string) => {
  switch (status) {
    case "chờ xác nhận":
      return "px-2 py-1 text-xs font-semibold rounded-full capitalize bg-yellow-100 text-yellow-800";
    case "đã xác nhận":
      return "px-2 py-1 text-xs font-semibold rounded-full capitalize bg-blue-100 text-blue-800";
    case "đang giao hàng":
      return "px-2 py-1 text-xs font-semibold rounded-full capitalize bg-green-100 text-green-800";
    case "đã hoàn thành":
      return "px-2 py-1 text-xs font-semibold rounded-full capitalize bg-gray-100 text-gray-800";
    case "hủy đơn":
      return "px-2 py-1 text-xs font-semibold rounded-full capitalize bg-red-100 text-red-800";
    default:
      return "";
  }
};
const getPaymentClassName = (payment: string) => {
  switch (payment.toLowerCase()) {
    case "vnpay":
      return "text-blue-700 font-bold"; // Màu xanh đậm, chữ đậm
    case "cod":
      return "text-orange-600 font-bold"; // Màu xanh lá đậm, chữ đậm
    default:
      return "text-gray-600 font-semibold"; // Màu xám trung bình, chữ vừa
  }
};

export default AdminOrder;
