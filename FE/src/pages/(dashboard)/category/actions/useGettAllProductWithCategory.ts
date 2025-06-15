import { useQuery } from "@tanstack/react-query";
import { getAllProductWithCategory } from "./api";

export function useGetAllProductWithCategory(id: string) {
  const {
    isLoading,
    data: productCount,
    error,
  } = useQuery({
    queryKey: ["CategoryProductCount", id],
    queryFn: () => getAllProductWithCategory(id),
    enabled: !!id, // Note: Tránh gọi API nếu ID chưa có
  });

  return { isLoading, productCount, error };
}
