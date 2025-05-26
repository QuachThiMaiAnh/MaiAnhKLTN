import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAttributeValueByID } from "./api";
import { useParams, useSearchParams } from "react-router-dom";

export const useUpdateAttributeValue = (id: string) => {
  const { id: idAttr } = useParams();
  const [searchParams] = useSearchParams();
  const statusDisplay = searchParams.get("status");

  const filterStatus =
    !statusDisplay || statusDisplay === "" ? "status" : statusDisplay;

  const queryClient = useQueryClient();

  const { mutate: updateAttributeValue, isPending: isUpdating } = useMutation({
    mutationFn: (data: { name: string }) => updateAttributeValueByID(id, data),

    onSuccess: () => {
      toast({
        variant: "success",
        title: "Cập nhật giá trị thuộc tính thành công",
      });
      queryClient.invalidateQueries([
        "AttributeValue",
        idAttr,
        { status: filterStatus },
      ]);
      queryClient.invalidateQueries(["AttributeValue", idAttr]);
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
