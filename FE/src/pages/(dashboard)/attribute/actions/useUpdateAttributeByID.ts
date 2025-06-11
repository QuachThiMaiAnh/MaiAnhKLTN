import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAttributeByID } from "./api";

export const useUpdateAttributeByID = (id: string) => {
  const queryClient = useQueryClient();

  const { mutate: updateAttribute, isPending: isUpdating } = useMutation({
    mutationFn: (data: { name: string }) => updateAttributeByID(id, data), // Gửi dữ liệu cập nhật lên server

    onSuccess: () => {
      // Hiển thị thông báo khi cập nhật thành công
      toast({
        variant: "success",
        title: "Cập nhật thuộc tính thành công",
      });

      // Làm mới danh sách thuộc tính đang hiển thị
      queryClient.invalidateQueries({
        queryKey: ["Attributes", { status: "display" }],
      });

      // Xoá cache liên quan đến "Products" nếu có (liên kết đến thuộc tính này)
      queryClient.removeQueries({
        predicate: (query) => {
          return query.queryKey[0] === "Products";
        },
      });
    },

    onError: (error: Error) => {
      // Hiển thị thông báo lỗi
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  return { updateAttribute, isUpdating };
};
