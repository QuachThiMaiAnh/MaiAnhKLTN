// hooks/useCreateProduct.ts

import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Lấy base URL từ biến môi trường (cấu hình trong .env)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Custom hook để tạo sản phẩm mới.
 * Gọi API POST và xử lý kết quả thành công hoặc thất bại bằng react-query + toast.
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const { mutate: createProduct, isPending: isCreatting } = useMutation({
    // mutationFn: Hàm gửi dữ liệu sản phẩm lên API
    mutationFn: async (data: unknown) => {
      const response = await axios.post(`${API_BASE_URL}/products`, data);
      return response.data;
    },

    // Xử lý khi API thành công
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Tạo sản phẩm thành công",
      });

      // Làm mới cache danh sách sản phẩm đang hiển thị
      queryClient.invalidateQueries({
        queryKey: ["Products", { status: "display" }],
      });
    },

    // Xử lý khi API thất bại
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Đã xảy ra lỗi không xác định";
      toast({
        variant: "destructive",
        title: "Lỗi khi tạo sản phẩm",
        description: errorMessage,
      });
    },
  });

  return {
    createProduct, // hàm để gọi mutation từ component
    isCreatting, // trạng thái đang gửi yêu cầu
  };
};
