import axios from "axios";

// Lấy biến môi trường chứa URL API backend
const apiUrl = import.meta.env.VITE_API_URL;

/**
 * API: Lấy tất cả thuộc tính (có thể lọc theo trạng thái hiển thị hoặc ẩn)
 * @param status - "display" (mặc định) hoặc "hidden"
 * @returns Danh sách thuộc tính kèm thông tin giá trị (nếu có)
 */
export async function getAllAttribute({ status }: { status: string | "" }) {
  try {
    const response = await axios.get(`${apiUrl}/attributes?_status=${status}`);
    return response?.data;
  } catch (error) {
    console.log(error); // Có thể nâng cấp: hiển thị toast/alert lỗi
  }
}

/**
 * API: Lấy chi tiết thuộc tính theo ID (cho admin)
 * @param id - ID của thuộc tính
 * @returns Thông tin chi tiết của thuộc tính, bao gồm danh sách các giá trị
 */
export async function getAttributeByID(id: string) {
  try {
    const response = await axios.get(`${apiUrl}/attributes/${id}`);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}

/**
 * API: Lấy chi tiết thuộc tính theo ID (cho client, chỉ lấy giá trị chưa xoá)
 * @param id - ID của thuộc tính
 * @returns Thuộc tính và danh sách các giá trị chưa bị ẩn
 */
export async function getAttributeByIDClient(id: string) {
  try {
    const response = await axios.get(`${apiUrl}/attributes/${id}/client`);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}

/**
 * API: Cập nhật tên thuộc tính
 * @param id - ID của thuộc tính cần cập nhật
 * @param data - Dữ liệu gửi lên (chỉ cần { name: string })
 * @returns Thuộc tính sau khi cập nhật thành công
 * @throws Lỗi trả về từ server (dùng để hiển thị thông báo lỗi cụ thể)
 */
export async function updateAttributeByID(id: string, data: { name: string }) {
  try {
    const response = await axios.put(`${apiUrl}/attributes/${id}`, data);
    return response?.data;
  } catch (error) {
    // Ném lỗi chi tiết để phía React xử lý theo useMutation hoặc try/catch
    throw (
      error.response?.data ||
      error.message ||
      "Có lỗi xảy ra khi cập nhật thuộc tính"
    );
  }
}
