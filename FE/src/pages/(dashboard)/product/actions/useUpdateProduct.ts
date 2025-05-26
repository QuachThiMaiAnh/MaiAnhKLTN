import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useUpdateProduct = (idP: string) => {
  const queryClient = useQueryClient();

  const { mutate: updateProduct, isPending: isUpdating } = useMutation({
    mutationFn: async ({ data, id }: { data: unknown; id: string }) => {
      console.log("id", id);
      try {
        const response = await axios.put(
          `http://localhost:8080/api/products/${id}`,
          data
        );
        return response.data; // Trả về dữ liệu phản hồi
      } catch (error) {
        console.error("Lỗi cập nhật sản phẩm:", error);
        throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Products", idP],
      });

      queryClient.invalidateQueries({
        queryKey: ["Products", { status: "display" }],
      });

      toast({
        variant: "success",
        title: "Cập nhật sản phẩm thành công",
      });
    },
  });

  return { updateProduct, isUpdating };
};
