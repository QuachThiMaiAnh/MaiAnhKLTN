import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useDeleteAttribute = () => {
  const queryClient = useQueryClient();

  // Mutation xoá thuộc tính (xoá mềm)
  const { mutate: deleteAttribute, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => axios.delete(`${apiUrl}/attributes/${id}`),

    onSuccess: () => {
      toast({
        variant: "success",
        title: "Ẩn thuộc tính thành công",
      });

      // Cập nhật lại danh sách
      queryClient.invalidateQueries({
        queryKey: ["Attributes"],
      });
    },

    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Ẩn thuộc tính thất bại",
      });
    },
  });

  return { deleteAttribute, isDeleting };
};
