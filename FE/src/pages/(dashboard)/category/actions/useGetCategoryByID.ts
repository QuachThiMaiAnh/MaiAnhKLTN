import { useQuery } from "@tanstack/react-query";
import { getCategoryByID } from "./api";

export function useGetCategoryByID(id: string) {
  const {
    isLoading: isLoadingCategory,
    data: category,
    error,
  } = useQuery({
    queryKey: ["Categories", id],
    queryFn: () => getCategoryByID(id),
  });

  return { isLoadingCategory, category, error };
}
