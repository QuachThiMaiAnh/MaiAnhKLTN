import axios from "axios";

// Đọc biến môi trường từ Vite config
const apiUrl = import.meta.env.VITE_API_URL;

/**
 * Lấy thông tin sản phẩm để hiển thị trong trang chỉnh sửa
 * @param id - ID của sản phẩm
 * @returns Thông tin chi tiết của sản phẩm (bao gồm cả dữ liệu phục vụ việc chỉnh sửa)
 */
export async function getProductEdit(id: string) {
  try {
    const response = await axios.get(`${apiUrl}/products/${id}/forEdit`);

    // Cập nhật tiêu đề trang dựa theo tên sản phẩm
    document.title = `Page: ${response?.data.name}`;

    return response?.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin sản phẩm để chỉnh sửa:", error);
  }
}

/**
 * Lấy danh sách sản phẩm theo trạng thái (status)
 * @param status - Trạng thái của sản phẩm
 * @returns Danh sách sản phẩm tương ứng
 */
export async function getAllProduct({ status }: { status: string | "" }) {
  try {
    const response = await axios.get(
      `${apiUrl}/products?_status=${status}&_limit=100`
    );
    return response?.data;
  } catch (error) {
    console.log("Lỗi khi lấy danh sách sản phẩm:", error);
  }
}

/**
 * Lấy danh sách các thuộc tính sản phẩm (attribute) từ server
 * @returns Danh sách thuộc tính (attributes)
 */
export async function getAtributes() {
  try {
    const response = await axios.get(`${apiUrl}/attributes`);
    return response?.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thuộc tính sản phẩm:", error);
  }
}
