import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "./api";

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  const { mutate: addComment, isPending: isAdding } = useMutation({
    mutationFn: (data: {
      content: string;
      infoProductBuy: string;
      itemId: string;
      orderId: string;
      productId: string;
      rating: number;
      userId: string;
    }) => createComment(data),

    onSuccess: (data) => {
      console.log(data);
      toast({
        className: "bg-green-400 text-white h-auto",
        title: data.message,
      });

      queryClient.invalidateQueries({
        queryKey: ["ORDER_HISTORY"],
      });
    },

    onError: (error: Error) => {
      console.log(error);

      toast({
        className: "h-20",
        variant: "destructive",
        title: error.message,
      });
    },
  });

  return { addComment, isAdding };
};
