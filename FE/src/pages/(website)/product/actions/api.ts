import axios from "axios"; // là thư viện dùng để gửi HTTP request
const apiUrl = import.meta.env.VITE_API_URL; // URL gốc của API

export async function getProductById(id: string) {
  // là ID của sản phẩm
  try {
    const response = await axios.get(`${apiUrl}/products/${id}`);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}
