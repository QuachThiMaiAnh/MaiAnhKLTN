import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategoryByID } from "./api";
import { useNavigate } from "react-router-dom";

export const useUpdateCategoryByID = (id: string) => {
  const queryClient = useQueryClient(); // Note: Sử dụng queryClient để quản lý cache và invalidate queries
  const navigate = useNavigate();

  const { mutate: updateCategory, isPending: isUpdating } = useMutation({
    mutationFn: (data: {
      name: string;
      title?: string;
      image?: string;
      description?: string;
    }) => updateCategoryByID(id, data),
    // Note: Dữ liệu có thể có thêm title, image, description nếu form đầy đủ

    onSuccess: () => {
      toast({
        variant: "success",
        title: "Cập nhật danh mục thành công",
      });

      queryClient.invalidateQueries({ queryKey: ["Categories"] });
      // Note: Làm mới danh sách sau cập nhật

      navigate("/admin/categories");
    },

    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: error?.response?.data?.message || "Cập nhật danh mục thất bại",
      });
    },
  });

  return { updateCategory, isUpdating };
};
