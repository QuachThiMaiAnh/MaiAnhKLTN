import { useUserContext } from "@/common/context/UserProvider";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const apiUrl = import.meta.env.VITE_API_URL;
interface ErrorResponse {
  message: string;
}
import axios, { AxiosError } from "axios";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  const { _id } = useUserContext();

  const { mutate: addCart, isPending: isAdding } = useMutation({
    mutationFn: (data: unknown) => axios.post(`${apiUrl}/cart/add`, data),

    onSuccess: () => {
      toast({
        className: "bg-green-400 text-white h-auto",
        title: "Thêm vào giỏ hàng thành công",
      });

      queryClient.invalidateQueries({
        queryKey: ["CART", _id],
      });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      console.log(error);

      toast({
        className: "h-20",
        variant: "destructive",
        title: error?.response?.data?.message,
      });
    },
  });

  return { addCart, isAdding };
};
