import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDisplayAttributeValue = () => {
  const queryClient = useQueryClient();

  const { mutate: displayAttributeValue, isPending: isUpdating } = useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/attributevalue/${id}/display`
        );
        return response.data; // Trả về dữ liệu phản hồi
      } catch (error) {
        console.error("Lỗi cập nhật hiển thị:", error);
        throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["AtributesValue"],
      });

      toast({
        variant: "success",
        title: "Cập nhật hiển thị giá trị thuộc tính thành công",
      });
    },

    onError: (error) => {
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  return { displayAttributeValue, isUpdating };
};
