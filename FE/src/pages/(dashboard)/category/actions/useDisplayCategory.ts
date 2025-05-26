import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDisplayCategory = (idC: string) => {
  const queryClient = useQueryClient();

  const { mutate: displayCategory, isPending: isUpdating } = useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/category/${id}/display`
        );
        return response.data; // Trả về dữ liệu phản hồi
      } catch (error) {
        console.error("Lỗi cập nhật danh mục:", error);
        throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
      }
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["Categories"],
      });

      toast({
        variant: "success",
        title: data.message,
      });
    },
  });

  return { displayCategory, isUpdating };
};
