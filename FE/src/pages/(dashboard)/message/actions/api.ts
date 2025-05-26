import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export async function getListChat() {
  try {
    const response = await axios.get(`${apiUrl}/api/products/${id}/forEdit`);
    document.title = `Page: ${response?.data.name}`;
    return response?.data;
  } catch (error) {
    console.error(error);
  }
}
