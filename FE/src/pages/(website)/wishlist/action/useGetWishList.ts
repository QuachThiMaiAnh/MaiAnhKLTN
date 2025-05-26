import { useQuery } from "@tanstack/react-query";
import { getWishList } from "./api";

export function useGetWishList(id: string) {
  const {
    isLoading,
    data: wishList,
    error: isError,
  } = useQuery({
    queryKey: ["WishList", id],
    queryFn: () => getWishList(id),
    enabled: !!id,
  });

  return { isLoading, wishList, isError };
}
