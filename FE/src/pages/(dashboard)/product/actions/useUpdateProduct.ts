// hooks/useUpdateProduct.ts
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const useUpdateProduct = (idP: string) => {
  const queryClient = useQueryClient();

  const { mutate: updateProduct, isPending: isUpdating } = useMutation({
    // Hàm gọi API cập nhật sản phẩm
    mutationFn: async ({ data, id }: { data: unknown; id: string }) => {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/products/${id}`,
          data
        );
        return response.data;
      } catch (error) {
        console.error("Lỗi cập nhật sản phẩm:", error);
        // Hiển thị toast lỗi nếu muốn
        toast({
          variant: "destructive",
          title: "Cập nhật thất bại",
          description: "Vui lòng kiểm tra lại dữ liệu hoặc kết nối mạng.",
        });
        throw error;
      }
    },

    // Xử lý sau khi cập nhật thành công
    onSuccess: () => {
      // Làm mới dữ liệu chi tiết sản phẩm
      queryClient.invalidateQueries({
        queryKey: ["Products", idP],
      });

      // Làm mới danh sách sản phẩm đang hiển thị
      queryClient.invalidateQueries({
        queryKey: ["Products", { status: "display" }],
      });

      // Hiển thị thông báo thành công
      toast({
        variant: "success",
        title: "Cập nhật sản phẩm thành công",
      });
    },
  });

  return { updateProduct, isUpdating };
};
