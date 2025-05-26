import { useQuery } from "@tanstack/react-query";
import { getAllProductWithCategory } from "./api";

export function useGettAllProductWithCategory(id: string) {
  const {
    isLoading: isGetting,
    data: countProduct,
    error: errorGetting,
  } = useQuery({
    queryKey: ["CategoriesProduct", id],
    queryFn: () => getAllProductWithCategory(id),
  });

  return { isGetting, countProduct, errorGetting };
}
