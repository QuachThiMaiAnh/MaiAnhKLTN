import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

// Lấy tất cả đơn hàng của người dùng
const getAllOrdersByUsesId = async (userId : string) => {
  try {
    const response = await axios.get(`${apiUrl}/get-all-orders/${userId}`);
    return response.data; // Trả về danh sách đơn hàng
  } catch (error) {
    console.error("Lỗi khi lấy tất cả đơn hàng:", error);
    throw new Error('Không thể lấy dữ liệu đơn hàng');
  }
};
const getAllOrders = async () => {
  try {
    const response = await axios.get(`${apiUrl}/get-all-orders`);
    return response.data; // Trả về danh sách đơn hàng
  } catch (error) {
    console.error("Lỗi khi lấy tất cả đơn hàng:", error);
    throw new Error('Không thể lấy dữ liệu đơn hàng');
  }
};

// Lấy chi tiết đơn hàng theo orderId
const getOrderById = async (orderId : string) => {
  try {
    const response = await axios.get(`${apiUrl}/get-orders/${orderId}`);
    return response.data; // Trả về thông tin chi tiết của đơn hàng
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    throw new Error('Không thể lấy dữ liệu đơn hàng');
  }
};

export { getAllOrders, getOrderById, getAllOrdersByUsesId };
