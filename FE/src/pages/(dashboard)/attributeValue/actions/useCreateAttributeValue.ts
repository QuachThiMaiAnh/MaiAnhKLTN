import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAttributeValues } from "./api";

/**
 * Hook tạo giá trị thuộc tính mới
 * @param id - ID của thuộc tính cha
 */
export const useCreateAttributeValue = (id: string) => {
  const queryClient = useQueryClient();

  const { mutate: createAttributeValue, isPending: isCreating } = useMutation({
    mutationFn: (data: { name: string; type: string; value: string }) =>
      createAttributeValues(id, data), // Gọi API POST

    onSuccess: () => {
      toast({
        variant: "success",
        title: "Tạo mới giá trị thuộc tính thành công",
      });

      // Làm mới cache danh sách
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
