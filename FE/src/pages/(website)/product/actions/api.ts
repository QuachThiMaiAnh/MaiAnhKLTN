import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export async function getProductById(id: string) {
  try {
    const response = await axios.get(`${apiUrl}/products/${id}`);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}
