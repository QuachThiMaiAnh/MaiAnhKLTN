import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Lấy base URL từ .env
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Hook dùng để gọi API ẩn sản phẩm (soft delete).
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    // Gọi POST để cập nhật trạng thái "deleted"
    mutationFn: async (id: string) => {
      const response = await axios.post(`${API_BASE_URL}/products/${id}`);
      return response.data;
    },

    // Thành công: refetch và hiển thị thông báo
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Products"] });
      toast({
        variant: "success",
        title: "Ẩn sản phẩm thành công",
      });
    },

    // Thất bại: log và hiển thị toast lỗi
    onError: (error) => {
      console.error("Lỗi khi ẩn sản phẩm:", error);
      toast({
        variant: "destructive",
        title: "Không thể ẩn sản phẩm",
        description: "Vui lòng kiểm tra kết nối hoặc thử lại sau.",
      });
    },
  });

  return { deleteProduct, isDeleting };
};
