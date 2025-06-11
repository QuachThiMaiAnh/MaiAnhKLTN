import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

/**
 * Hook xoá mềm (ẩn) giá trị thuộc tính
 */
export const useDeleteAttributeValue = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteAttributeValue, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) =>
      axios.put(`${apiUrl}/attributevalue/${id}/delete`), // Sửa thành PUT cho soft delete nếu backend dùng vậy

    onSuccess: () => {
      toast({
        title: "Ẩn giá trị thuộc tính thành công",
      });

      queryClient.invalidateQueries({
        queryKey: ["AttributeValue"],
      });
    },

    onError: () => {
      toast({
        title: "Xoá giá trị thuộc tính thất bại",
        variant: "destructive",
      });
    },
  });

  return { deleteAttributeValue, isDeleting };
};
