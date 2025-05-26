import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
// import { ToastAction } from "@/components/ui/toast";
interface WishListItem {
  productId: string;
  userId: string;
}
interface WishListResponse {
  success: boolean;
  message: string;
}

interface ErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
}
const apiUrl = import.meta.env.VITE_API_URL;

const CART_QUERY_KEY = "WishList";

const getWishList = async (userId: string) => {
  const { data } = await axios.get(`${apiUrl}/wishlist/${userId}`);
  return data;
};

const puttWishList = async (actiton: string, item: WishListItem): Promise<WishListResponse> => {
  const url = `${apiUrl}/wishlist/${actiton}`;
  const { data } = await axios.put(url, item);
  return data;
};

const useWishList = (userId: string) => {
  const queryClient = useQueryClient();

  const {
    data: wishList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [CART_QUERY_KEY, userId],
    queryFn: async () => await getWishList(userId),
    enabled: !!userId,
    // !!userId => chuyển đổi sang dạng boolean. Nếu userId ko rỗng -> trả về true, kích hoạt truy vấn. Nếu userId rỗng thì ngược lại
  });

  const UsewishListActiton = (action: string) => {
    return useMutation<WishListResponse, ErrorResponse, WishListItem>({
      mutationFn: async (item: WishListItem) => {
        const data = await puttWishList(action, item);
        // console.log(data)
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY, userId] });
      },
      onError: (error: ErrorResponse) => {
        // console.log(error.response.data.message)
        toast({
          variant: "destructive",
          title: "Error",
          description: `${error.response.data.message}`,
          // action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      },
    });
  };

  return {
    wishList,
    isLoading,
    isError,
    updateQuantity: UsewishListActiton("update"),
    removeItem: UsewishListActiton("remove"),
    increaseItem: UsewishListActiton("increase"),
    decreaseItem: UsewishListActiton("decrease"),
    changeVariant: UsewishListActiton("change-variant"),
  };
};

export default useWishList;
