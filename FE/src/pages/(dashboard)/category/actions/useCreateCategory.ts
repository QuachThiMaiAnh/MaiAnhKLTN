import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Note: Dùng useNavigate để điều hướng sau khi tạo thành công

  const { mutate: createCategory, isPending: isCreating } = useMutation({
    mutationFn: (data: unknown) => axios.post(`${apiUrl}/category`, data),

    onSuccess: () => {
      toast({
        variant: "success",
        title: "Tạo danh mục thành công",
      });

      queryClient.invalidateQueries({
        queryKey: ["Categories"],
      });
      // Note: Invalidate để refetch lại danh sách danh mục sau khi tạo

      navigate("/admin/categories");
    },

    onError: (error: any) => {
      // Note: Cần ép kiểu hoặc dùng `any` nếu không rõ error có phải AxiosError
      toast({
        variant: "destructive",
        title: error?.response?.data?.message || "Đã xảy ra lỗi",
      });
    },
  });

  return { createCategory, isCreating };
};
