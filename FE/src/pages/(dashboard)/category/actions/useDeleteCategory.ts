import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "./api";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient(); // Note: Sử dụng queryClient để quản lý cache và invalidate queries

  const { mutate: deleteCategoryById, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    // Note: Dùng lại hàm API đã tạo để tách biệt giữa logic gọi và hook.

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["Categories"],
      });

      toast({
        variant: "success",
        title: data?.message || "Xoá danh mục thành công",
      });
    },

    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: error?.response?.data?.message || "Xoá danh mục thất bại",
      });
    },
  });

  return { deleteCategoryById, isDeleting };
};
