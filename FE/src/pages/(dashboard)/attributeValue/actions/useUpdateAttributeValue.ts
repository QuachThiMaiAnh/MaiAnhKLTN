import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAttributeValueByID } from "./api";
import { useParams, useSearchParams } from "react-router-dom";

/**
 * Hook cập nhật giá trị thuộc tính
 * @param id - ID của AttributeValue cần cập nhật
 */
export const useUpdateAttributeValue = (id: string) => {
  const { id: idAttr } = useParams(); // Lấy id của Attribute từ URL
  const [searchParams] = useSearchParams();

  const statusDisplay = searchParams.get("status");
  const filterStatus =
    !statusDisplay || statusDisplay === "" ? "display" : statusDisplay;

  const queryClient = useQueryClient();

  const { mutate: updateAttributeValue, isPending: isUpdating } = useMutation({
    mutationFn: (data: { name: string; type: string; value: string }) =>
      updateAttributeValueByID(id, data),

    onSuccess: () => {
      toast({
        variant: "success",
        title: "Cập nhật giá trị thuộc tính thành công",
      });

      // Làm mới cache theo status và attribute cha (không dùng object trong queryKey)
      queryClient.invalidateQueries(["AttributeValue", idAttr, filterStatus]);

      // Làm mới cache chi tiết nếu có
      queryClient.invalidateQueries(["AttributeValue", id]);
    },

    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  return { updateAttributeValue, isUpdating };
};
