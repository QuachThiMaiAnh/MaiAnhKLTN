import axios from "axios";

// Lấy URL từ biến môi trường
const apiUrl = import.meta.env.VITE_API_URL;

/**
 * Lấy toàn bộ danh sách giá trị thuộc tính theo ID thuộc tính cha (Attribute)
 * @param type - ID của Attribute cha
 * @param status - Trạng thái "display" hoặc "hidden"
 */
export async function getAllAttributeValue(
  type: string, // ID của Attribute cha
  { status }: { status: string | "" }
) {
  try {
    const response = await axios.get(
      `${apiUrl}/attributevalueByAttributeID/${type}?_status=${status}`
    );
    return response?.data;
  } catch (error) {
    console.log(error); // Lỗi sẽ được xử lý ở hook hoặc component
  }
}

/**
 * Lấy chi tiết một giá trị thuộc tính theo ID
 * @param id - ID của AttributeValue
 */
export async function getAttributeValue(id: string) {
  try {
    const response = await axios.get(`${apiUrl}/attributevalue/${id}`);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Gọi API tạo giá trị thuộc tính mới (POST)
 * @param id - ID của Attribute cha
 * @param data - Thông tin giá trị thuộc tính (name, type, value)
 */
export async function createAttributeValues(
  id: string, // ID của Attribute cha
  data: {
    name: string;
    type: string;
    value: string;
  }
) {
  try {
    const response = await axios.post(`${apiUrl}/attributevalue/${id}`, data);
    return response?.data;
  } catch (error: any) {
    // Ném lỗi để hook hoặc form xử lý thông báo
    throw new Error(error.response.data.message);
  }
}

/**
 * Gọi API cập nhật giá trị thuộc tính (PUT)
 * @param id - ID của giá trị thuộc tính cần cập nhật
 * @param data - Dữ liệu cập nhật (name, type, value)
 */
export async function updateAttributeValueByID(
  id: string,
  data: {
    name: string;
    type: string;
    value: string;
  }
) {
  try {
    const response = await axios.put(`${apiUrl}/attributevalue/${id}`, data);
    return response?.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
}
