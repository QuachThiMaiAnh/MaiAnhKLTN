import { useQuery } from "@tanstack/react-query";
import { getProductById } from "./api";

export function useGetProductById(id: string) {
  const {
    isLoading,
    data: product,
    error,
  } = useQuery({
    queryKey: ["Products", id],
    queryFn: () => getProductById(id),
  });

  return { isLoading, product, error };
}
