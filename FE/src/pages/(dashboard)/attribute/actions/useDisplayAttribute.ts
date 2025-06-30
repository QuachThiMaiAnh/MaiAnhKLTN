import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useDisplayAttribute = () => {
  const queryClient = useQueryClient();

  // Mutation hiển thị lại thuộc tính đã xoá mềm
  const { mutate: displayAttribute, isPending: isUpdating } = useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await axios.post(`${apiUrl}/attributes/${id}/display`);
        return response.data;
      } catch (error) {
        console.error("Lỗi cập nhật hiển thị:", error);
        throw error;
      }
    },

    onSuccess: () => {
      // Làm mới danh sách thuộc tính
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
        title: error?.message || "Hiển thị thuộc tính thất bại",
      });
    },
  });

  return { displayAttribute, isUpdating };
};
