import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDisplayComment = (idP: string) => {
  const queryClient = useQueryClient();

  const { mutate: displayComment, isPending: isUpdating } = useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await axios.put(
          `http://localhost:8080/api/comment/${id}`
        );
        return response.data; // Trả về dữ liệu phản hồi
      } catch (error) {
        console.error("Error updating Comment:", error);
        throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Comments"],
      });

      toast({
        variant: "success",
        title: "Hiển thị đánh giá thành công",
      });
    },

    onError: (error) => {
      toast({
        variant: "destructive",
        title: error.response?.data.message || "Cập nhật đánh giá thất bại",
      });
    },
  });

  return { displayComment, isUpdating };
};
