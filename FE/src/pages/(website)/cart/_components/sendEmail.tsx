import axios from "axios";
import { formatCurrencyVND } from "../../orderHistory/OrderHistory";
interface VariantItem {
  price: number;
}

interface ProductItem {
  name: string;
  image: string;
  quantity: number;
  total: number;
  price: number;
}

interface Product {
  productItem: ProductItem;
  variantItem?: VariantItem;
  quantity: number;
}
const sendOrderConfirmationEmail = async (to: string, orderCode: string) => {
  try {
    const logoResponse = await axios.get("http://localhost:8080/api/logo");
    const logoUrl = logoResponse.data?.[0]?.image ?? "";
    // Gọi API để lấy thông tin đơn hàng dựa vào orderCode
    const response = await axios.get(
      `http://localhost:8080/api/get-ordersCode/${orderCode}`
    );
    const order = response.data; // Thông tin đơn hàng từ API

    // Kiểm tra xem thông tin đơn hàng có hợp lệ không
    if (!order) {
      console.error("Không tìm thấy đơn hàng.");
      throw new Error("Không tìm thấy đơn hàng.");
    }

    // Trích xuất danh sách sản phẩm
    const products = order?.products?.map((item: Product) => ({
      name: item.productItem.name,      // Tên sản phẩm
      image: item.productItem.image,    // URL ảnh sản phẩm
      price: item.variantItem?.price,   // Giá sản phẩm từ variantItem
      quantity: item.quantity,          // Số lượng sản phẩm
      total: item.quantity * (item.variantItem?.price ?? 0), // Tổng giá trị cho sản phẩm
    }));
    

    // Nội dung email với bảng
    const emailContent = `
        <div className="w-4/12 flex justify-center md:w-2/12 px-[15px]">
                <img
                  className="w-20 flex justify-center md:w-36"
                  src="${logoUrl}"
                  alt="Logo"
                />
              </div>
      <h1>FabricFocus Cảm ơn bạn đã đặt hàng!</h1>
      <p>Mã đơn hàng: <strong>${order.orderCode}</strong></p>
      <p>Vui lòng đăng nhập để xem lịch sử đơn hàng: <strong>http://localhost:5173/users/order-history</strong></p>
      <p>Trạng thái đơn hàng: <strong>${order.status}</strong></p>
      <p>Danh sách sản phẩm:</p>
      <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Hình ảnh</th>
            <th>Số lượng</th>
            <th>Giá tiền (VNĐ)</th>
            <th>Tổng tiền (VNĐ)</th>
          </tr>
        </thead>
        <tbody>
          ${products
            ?.map(
              (product: ProductItem) => `
            <tr>
              <td style="text-align: center; vertical-align: middle;">${product.name}</td>
              <td style="text-align: center; vertical-align: middle;"><img src="${product.image}" alt="${
                product.name
              }" style="width: 100px; height: auto;" /></td>
              <td style="text-align: center; vertical-align: middle;">${product.quantity}</td>
              <td style="text-align: center; vertical-align: middle;">${product.price.toLocaleString()}</td>
              <td style="text-align: center; vertical-align: middle;">${product.total.toLocaleString()}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <div className="float-right" style="float: inline-end; margin-right: 3%;">
      <p>Giảm giá sản phẩm: ${order.discount > 0 ? `- ${formatCurrencyVND(order.discount)}` : formatCurrencyVND(0)}</p>
      <p>Phí giao hàng: 30.000 VNĐ</p>
      <p>Tổng cộng: <strong style="color: red">${order.totalPrice.toLocaleString()} VNĐ</strong></p>
      </div>
    `;

    // Gửi email
    await axios.post("http://localhost:8080/api/send-email", {
      to,
      subject: `mã đơn hàng ${order.orderCode}`,
      htmlContent: emailContent,
      orderCode: order.orderCode ,
    });

    console.log("Email đã được gửi thành công.");
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    throw new Error("Lỗi khi gửi email.");
  }
};

export default sendOrderConfirmationEmail;
