import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
// Biến môi trường này được dùng để cấu hình URL API dựa theo môi trường (dev/prod).

// Xoá danh mục theo ID (soft-delete)
export async function deleteCategory(id: string) {
  try {
    const response = await axios.delete(`${apiUrl}/category/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xoá danh mục:", error);
    throw error;
  }
}

// Lấy toàn bộ danh mục (có thể lọc theo trạng thái: display | hidden)
export async function getAllCategory({ status }: { status: string }) {
  try {
    const response = await axios.get(`${apiUrl}/category`, {
      params: { _status: status || "display" }, // Mặc định là "display" nếu không có status
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    throw error;
  }
}

// Lấy chi tiết danh mục theo ID
export async function getCategoryByID(id: string) {
  try {
    const response = await axios.get(`${apiUrl}/category/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục theo ID:", error);
    throw error;
  }
}

// Lấy tổng số sản phẩm thuộc danh mục theo ID
export async function getAllProductWithCategory(id: string) {
  try {
    const response = await axios.get(`${apiUrl}/category/${id}/product`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
    throw error;
  }
}

// Cập nhật danh mục theo ID
export async function updateCategoryByID(
  id: string, // ID của danh mục cần cập nhật
  // Dữ liệu cập nhật, bao gồm tên, tiêu đề, hình ảnh và mô tả
  data: { name: string; title?: string; image?: string; description?: string }
) {
  try {
    const response = await axios.put(`${apiUrl}/category/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    throw error;
  }
}
