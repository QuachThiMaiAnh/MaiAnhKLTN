import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const useCreateAttribute = () => {
  const queryClient = useQueryClient();

  const { mutate: createAttribute, isPending: isCreatting } = useMutation({
    mutationFn: (data: unknown) => axios.post(`${apiUrl}/attributes`, data),

    onSuccess: () => {
      toast({
        variant: "success",
        title: "Tạo thuộc tính thành công",
      });
      queryClient.invalidateQueries({
        queryKey: ["Attributes"],
      });
    },

    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: error.response.data.message,
      });
    },
  });

  return { createAttribute, isCreatting };
};
