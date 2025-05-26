import { useQuery } from "@tanstack/react-query";
import { getProductEdit } from "./api";

export function useGetProduct(id: string) {
  const {
    isLoading,
    data: product,
    error,
  } = useQuery({
    queryKey: ["Products", id],
    queryFn: () => getProductEdit(id),
    staleTime: 0, // Luôn đánh dấu là stale
    refetchOnWindowFocus: true, // Refetch khi chuyển lại tab
  });

  return { isLoading, product, error };
}
