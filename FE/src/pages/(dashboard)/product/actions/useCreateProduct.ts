import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const { mutate: createProduct, isPending: isCreatting } = useMutation({
    mutationFn: (data: unknown) =>
      axios.post("http://localhost:8080/api/products", data),

    onSuccess: () => {
      toast({
        variant: "success",
        title: "Tạo sản phẩm thành công",
      });
      queryClient.invalidateQueries({
        queryKey: ["Products", { status: "display" }],
      });
    },

    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Lỗi khi tạo sản phẩm",
        description: error.message,
      });
    },
  });

  return { createProduct, isCreatting };
};
