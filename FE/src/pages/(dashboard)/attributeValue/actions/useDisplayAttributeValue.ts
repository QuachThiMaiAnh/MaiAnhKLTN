import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

/**
 * Hook cập nhật trạng thái hiển thị của giá trị thuộc tính
 */
export const useDisplayAttributeValue = () => {
  const queryClient = useQueryClient();

  const { mutate: displayAttributeValue, isPending: isUpdating } = useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await axios.post(
          `${apiUrl}/attributevalue/${id}/display`
        );
        return response.data;
      } catch (error) {
        console.error("Lỗi cập nhật hiển thị:", error);
        throw error;
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["AttributeValue"],
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
