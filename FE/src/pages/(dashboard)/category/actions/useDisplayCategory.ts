import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useDisplayCategory = () => {
  const queryClient = useQueryClient(); // Note: Sử dụng queryClient để quản lý cache và invalidate queries

  const { mutate: displayCategory, isPending: isUpdating } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.post(`${apiUrl}/category/${id}/display`);
      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["Categories"],
      });

      toast({
        variant: "success",
        title: data.message || "Danh mục đã được hiển thị lại",
      });
    },

    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: error?.response?.data?.message || "Không thể hiển thị danh mục",
      });
    },
  });

  return { displayCategory, isUpdating };
};
