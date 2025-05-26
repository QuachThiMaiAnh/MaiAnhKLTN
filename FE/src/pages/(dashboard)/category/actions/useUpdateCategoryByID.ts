import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategoryByID } from "./api";
import { useNavigate } from "react-router-dom";
// const apiUrl = import.meta.env.VITE_API_URL;

export const useUpdateCategoryByID = (id: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: updateCategory, isPending: isUpdating } = useMutation({
    mutationFn: (data: { name: string }) => updateCategoryByID(id, data),

    onSuccess: () => {
      toast({
        variant: "success",
        title: "Cập nhật danh mục thành công",
      });
      navigate('/admin/categories')
      queryClient.invalidateQueries({
        queryKey: ["Categories"],
      });
    },

    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Cập nhật danh mục thất bại",
      });
    },
  });

  return { updateCategory, isUpdating };
};
