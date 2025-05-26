import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAttributeByID } from "./api";
// const apiUrl = import.meta.env.VITE_API_URL;

export const useUpdateAttributeByID = (id: string) => {
  const queryClient = useQueryClient();

  const { mutate: updateAttribute, isPending: isUpdating } = useMutation({
    mutationFn: (data: { name: string }) => updateAttributeByID(id, data),

    onSuccess: () => {
      toast({
        variant: "success",
        title: "Cập nhật thuộc tính thành công",
      });
      queryClient.invalidateQueries({
        queryKey: ["Attributes", { status: "display" }],
      });
      queryClient.removeQueries({
        predicate: (query) => {
          return query.queryKey[0] === "Products";
        },
      });
    },

    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  return { updateAttribute, isUpdating };
};
