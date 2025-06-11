import { toast } from "@/components/ui/use-toast"; // dùng để hiển thị thông báo
import { useMutation, useQueryClient } from "@tanstack/react-query"; // react-query để xử lý POST
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useCreateAttribute = () => {
  const queryClient = useQueryClient();

  // Khởi tạo mutation để gọi API tạo thuộc tính
  const { mutate: createAttribute, isPending: isCreating } = useMutation({
    mutationFn: (data: unknown) => axios.post(`${apiUrl}/attributes`, data), // gọi API POST

    onSuccess: () => {
      toast({
        variant: "success",
        title: "Tạo thuộc tính thành công",
      });

      // Cập nhật lại cache sau khi tạo
      queryClient.invalidateQueries({
        queryKey: ["Attributes"],
      });
    },

    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: error?.response?.data?.message || "Tạo thuộc tính thất bại",
      });
    },
  });

  return { createAttribute, isCreating };
};
