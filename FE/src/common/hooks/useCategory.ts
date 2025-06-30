import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Lấy base URL từ file .env
const API_URL = import.meta.env.VITE_API_URL;

export function useCategory() {
  const {
    isLoading: isLoadingCategory,
    data,
    error,
  } = useQuery({
    queryKey: ["Category"],

    // Hàm gọi API lấy danh sách danh mục
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/category`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache trong 5 phút
  });

  return { category: data, isLoadingCategory, error };
}
