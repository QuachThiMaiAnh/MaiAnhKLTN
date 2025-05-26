import axios, { AxiosError } from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const createComment = async (data: {
  content: string;
  infoProductBuy: string;
  itemId: string;
  orderId: string;
  productId: string;
  rating: number;
  userId: string;
}) => {
  try {
    const response = await axios.post(`${apiUrl}/comment`, data);
    return response?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Giờ có thể truy cập error.response
      throw new Error(error?.response?.data?.message || "Unknown error");
    }
    throw new Error("An unexpected error occurred");
  }
};
