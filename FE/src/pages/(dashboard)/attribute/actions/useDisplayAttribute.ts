import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDisplayAttribute = () => {
  const queryClient = useQueryClient();

  const { mutate: displayAttribute, isPending: isUpdating } = useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/attributes/${id}/display`
        );
        return response.data; // Trả về dữ liệu phản hồi
      } catch (error) {
        console.error("Lỗi cập nhật hiển thị:", error);
        throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Attributes"],
      });

      toast({
        variant: "success",
        title: "Cập nhật hiển thị thuộc tính thành công",
      });
    },

    onError: (error) => {
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  return { displayAttribute, isUpdating };
};
