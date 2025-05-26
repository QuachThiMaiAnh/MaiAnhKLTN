import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const useDeleteAttributeValue = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteAtributesValue, isPending: isDeleting } = useMutation({
    mutationFn: (id) => axios.delete(`${apiUrl}/attributevalue/${id}`),

    onSuccess: () => {
      toast({
        title: "Ẩn giá trị thuộc tính thành công",
      });
      queryClient.invalidateQueries({
        queryKey: ["AtributesValue"],
      });
    },

    onError: (error: Error) => {
      toast({
        title: "Xóa giá trị thuộc tính thất bại",
      });
    },
  });

  return { deleteAtributesValue, isDeleting };
};
