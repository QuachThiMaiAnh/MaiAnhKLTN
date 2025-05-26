import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDeleteComment = (idP: string) => {
  const queryClient = useQueryClient();

  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await axios.delete(
          `http://localhost:8080/api/comment/${id}`
        );
        return response.data; // Trả về dữ liệu phản hồi
      } catch (error) {
        console.error("Error updating product:", error);
        throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Comments"],
      });

      toast({
        variant: "success",
        title: "Ẩn đánh giá thành công",
      });
    },

    onError: (error) => {
      console.error("Error updating product:", error);

      toast({
        variant: "destructive",
        title: error.response.data.message,
      });
    },
  });

  return { deleteComment, isDeleting };
};
