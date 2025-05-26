import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAttributeValues } from "./api";

export const useCreateAttributeValue = (id: string) => {
  const queryClient = useQueryClient();

  const { mutate: createAttributeValue, isPending: isCreating } = useMutation({
    mutationFn: (data: { name: string; type: string; value: string }) =>
      createAttributeValues(id, data),

    onSuccess: () => {
      toast({
        variant: "success",
        title: "Tạo mới giá trị thuộc tính thành công",
      });
      queryClient.invalidateQueries({
        queryKey: ["AttributeValue"],
      });
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
