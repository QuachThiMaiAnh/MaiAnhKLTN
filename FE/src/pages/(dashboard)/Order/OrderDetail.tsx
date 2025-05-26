import  { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import html2pdf from "html2pdf.js"; // Import html2pdf.js
import useOrder from "@/common/hooks/order/UseOrder";
import { formatCurrencyVND } from "@/pages/(website)/orderHistory/OrderHistory";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { StatusHistory } from "@/common/types/OrderStatusHistory";
import { Product, VariantValue } from "@/common/types/Products";

const OrderDetail = () => {
  const { id } = useParams();
  const { data , isLoading, isError} = useOrder(undefined, id);
  // State để theo dõi việc xuất PDF
  const [isExported, setIsExported] = useState(false);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(date);
  };
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
  const {
    addressId,
    note,
    products,
    payment,
    status,
    statusHistory,
    totalPrice,
    orderCode,
    discount,
    fullName,
    email,
    createdAt,
    cancellationReason,
  } = data;

  // Hàm xử lý xuất PDF
  const handleExportPDF = async() => {
    setIsExported(true); // Cập nhật state khi đã xuất PDF
    const element = document.getElementById("order-detail"); // Lấy phần tử cần xuất ra PDF

    if (element) {
      // const options = {
      //   margin: 10,
      //   filename: `order_${orderCode}.pdf`, // Tên file PDF
      //   image: { type: "jpeg", quality: 0.98 },
      //   html2canvas: {
      //     scale: 2,
      //     useCORS: true, // Cho phép tải ảnh từ nguồn ngoài
      //     logging: true, // Hiển thị log để kiểm tra việc tải ảnh
      //     allowTaint: true, // Cho phép vẽ ảnh từ các nguồn không phải cùng domain
      //     letterRendering: true, // Hiển thị các ký tự chính xác hơn
      //   },
      //   jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      // };
      const options = {
        margin: 10,
        filename: `order_${orderCode}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true, // Cho phép tải ảnh từ nguồn ngoài
          logging: true, // Hiển thị log để kiểm tra việc tải ảnh
          allowTaint: false, // Không cho phép vẽ ảnh từ các nguồn không phải cùng domain
          letterRendering: true, // Hiển thị các ký tự chính xác hơn
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      
      try {
        await html2pdf().from(element).set(options).save();
        setIsExported(false) // Sử dụng đúng phương thức của html2pdf.js
      } catch (error) {
        console.error("Lỗi khi xuất PDF:", error);
      } 
    }
  };
  return (
    <div className="p-6 bg-gray-100">
    <div className="flex justify-between items-center">
      <Link 
        className="mb-6 px-4 py-2 bg-black text-white rounded hover:bg-[rgb(37_36_36)]"
      
      to={`/admin/orders`}>Trờ lại</Link>
    <button
        onClick={handleExportPDF}
        className="mb-6 px-4 py-2 bg-black text-white rounded hover:bg-[rgb(37_36_36)]"
      >
        Xuất hóa đơn
      </button>
    </div>

      <div id="order-detail">
        {" "}
        {/* Phần tử bao bọc nội dung cần xuất */}
        <h2 className="text-2xl text-center font-bold mb-6">Chi tiết đơn hàng</h2>
        {/* Thông tin tổng quan */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong>Mã đơn hàng:</strong> {orderCode}
            </p>
            <p>
              <strong>Ngày đặt hàng:</strong>{" "}
              {new Date(createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span className={`px-2 py-1 rounded ${statusColor(status)}`}>
                {status}
              </span>
            </p>
            {cancellationReason ? (
              <p>
                <strong>Lý do hủy hàng:</strong> {cancellationReason}
              </p>
            ) : null}

            <p>
              <strong>Hình thức thanh toán:</strong> <span className={getPaymentClassName(payment)}>{payment}</span>
            </p>
            <p>
              <strong>Ghi chú:</strong> {note || "Không có ghi chú"}
            </p>
          </div>
        </div>
        {/* Thông tin giao hàng */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-xl font-semibold mb-4">Thông tin giao hàng</h3>
          <p className="leading-8"><strong>Người đặt hàng: </strong> {fullName}</p>
          <p className="leading-8"><strong>Gmail: </strong> {email} </p>
          <p className="leading-8">
            <strong>Người nhận:</strong> {addressId.name}
          </p>
          <p className="leading-8">
            <strong>Số điện thoại:</strong> {addressId.phone}
          </p>
          <p className="leading-8">
            <strong>Địa chỉ:</strong>{" "}
            {`${addressId.addressDetail}, ${addressId.wardId}, ${addressId.districtId}, ${addressId.cityId}, ${addressId.country}`}
          </p>
        </div>
        {/* Lịch sử trạng thái */}
        {isExported == false && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="text-xl font-semibold mb-4">Lịch sử trạng thái</h3>
            <Table className="w-full border border-gray-200">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="py-3 px-4">Trạng thái</TableHead>
                  <TableHead className="py-3 px-4">Thời gian</TableHead>
                  <TableHead className="py-3 px-4">Người cập nhật</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statusHistory?.map((history: StatusHistory, index: number) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="py-3 px-4">
                      {history.status}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      {formatDate(history.timestamp)}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      {history.updatedBy}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {/* Danh sách sản phẩm */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-semibold mb-4">Danh sách sản phẩm</h3>
          <Table className="w-full border border-gray-200">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="py-3 px-4">Hình ảnh</TableHead>
                <TableHead className="py-3 px-4">Sản phẩm</TableHead>
                <TableHead className="py-3 px-4">Biến thể</TableHead>
                <TableHead className="py-3 px-4 text-center">
                  Số lượng
                </TableHead>
                <TableHead className="py-3 px-4 text-right">Đơn giá</TableHead>
                <TableHead className="py-3 px-4 text-right">
                  Thành tiền
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((item: Product) => (
                <TableRow key={item._id} className="hover:bg-gray-50">
                  <TableCell className="py-3 px-4">
                    <img
                      src={item.productItem.image}
                      alt={item.productItem.name}
                      crossOrigin="anonymous"
                      className="w-16 h-16 object-cover rounded border"
                    />
                  </TableCell>
                  <TableCell className="py-3 px-4 font-medium">
                    {item.productItem.name}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-600">
                    {item.variantItem.values.map((v: VariantValue) => v.name).join(", ")}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-right text-green-500 font-semibold">
                    {(item.variantItem.priceSale || item.variantItem.price).toLocaleString()} VND
                  </TableCell>
                  <TableCell className="py-3  px-4 text-right font-semibold">
                    {(item.variantItem.priceSale || item.variantItem.price * item.quantity).toLocaleString()}{" "}
                    ₫
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="text-right space-y-2 bg-white p-4 rounded shadow-sm">
            <p className="flex items-center justify-between">
              <span className="text-gray-500">Giảm giá sản phẩm:</span>
              <span className="text-gray-800">
                {discount > 0 ? `- ${formatCurrencyVND(discount)}` : formatCurrencyVND(0)}

              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-gray-500">Phí ship:</span>
              <span className="text-gray-800">30.000 ₫</span>
            </p>
            <div className="flex items-center justify-between border-t pt-2 mt-2">
              <h3 className="text-gray-700 font-medium">Tổng giá trị:</h3>
              <span className="text-red-500 font-bold text-lg">
                {formatCurrencyVND(totalPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hàm xác định màu cho trạng thái
const statusColor = (status: string) => {
  switch (status) {
    case "chờ xác nhận":
      return "font-bold text-yellow-800";
    case "đã xác nhận":
      return "font-bold text-blue-800";
    case "đang giao hàng":
      return "font-bold text-green-800";
    case "đã hoàn thành":
      return "text-[#26aa99] font-bold";
    case "hủy đơn":
      return "text-[red] font-bold";
    default:
      return "bg-gray-100 text-gray-800";
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
export default OrderDetail;
