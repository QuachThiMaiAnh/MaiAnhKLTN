// import { useUserContext } from "@/common/context/UserProvider";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addToWishList } from "./api";

export const useAddToWishList = () => {
  const queryClient = useQueryClient();

  // const { _id } = useUserContext();

  const { mutate: addWishList, isPending: isAdding } = useMutation({
    mutationFn: (data: {
      userId: string;
      productId: string | undefined;
      variantId: string;
      quantity: number;
    }) => addToWishList(data),

    onSuccess: (data) => {
      console.log(data);
      toast({
        className: "bg-green-400 text-white h-auto",
        title: data.message,
      });

      queryClient.invalidateQueries({
        queryKey: ["WishList"],
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

  return { addWishList, isAdding };
};
