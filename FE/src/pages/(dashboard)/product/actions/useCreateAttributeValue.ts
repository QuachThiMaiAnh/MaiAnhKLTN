import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAttributeValues } from "../../attributeValue/actions/api";
import { Action } from "@/common/types/Orders";

export const useCreateAttributeValue = (
  id: string,
  dispatch: React.Dispatch<Action>
) => {
  const queryClient = useQueryClient();

  const { mutate: createAttributeValue, isPending: isCreating } = useMutation({
    mutationFn: (data: { name: string; type: string; value: string }) =>
      createAttributeValues(id, data),

    onSuccess: (data) => {
      toast({
        variant: "success",
        title: "Tạo mới giá trị thuộc tính thành công",
      });

      queryClient.invalidateQueries({
        queryKey: ["Attributes"],
      });

      dispatch({ type: "UPDATE_ATTRIBUTES", payload: data.data });
    },

    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  return { createAttributeValue, isCreating };
};
