import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export async function getConversation(id: string) {
  try {
    const response = await axios.get(`${apiUrl}/conversation/${id}`);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}
