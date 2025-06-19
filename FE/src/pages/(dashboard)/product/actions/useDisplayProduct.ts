import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Lấy base URL từ biến môi trường (.env)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Hook dùng để gọi API hiển thị lại sản phẩm (gỡ trạng thái "đã ẩn").
 */
export const useDisplayProduct = () => {
  const queryClient = useQueryClient();

  const { mutate: displayProduct, isPending: isUpdating } = useMutation({
    // Gọi API POST để thay đổi trạng thái sản phẩm
    mutationFn: async (id: string) => {
      const response = await axios.post(
        `${API_BASE_URL}/products/${id}/display`
      );
      return response.data;
    },

    // Nếu thành công: refetch danh sách sản phẩm + thông báo
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Products"] });
      toast({
        variant: "success",
        title: "Hiển thị sản phẩm thành công",
      });
    },

    // Nếu lỗi: log và thông báo lỗi
    onError: (error) => {
      console.error("Lỗi khi hiển thị sản phẩm:", error);
      toast({
        variant: "destructive",
        title: "Không thể hiển thị sản phẩm",
        description: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      });
    },
  });

  return { displayProduct, isUpdating };
};
