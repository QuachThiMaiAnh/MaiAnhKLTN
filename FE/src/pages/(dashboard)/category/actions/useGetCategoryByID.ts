import { useQuery } from "@tanstack/react-query";
import { getCategoryByID } from "./api";

export function useGetCategoryByID(id: string) {
  const {
    isLoading,
    data: category,
    error,
  } = useQuery({
    queryKey: ["Category", id],
    queryFn: () => getCategoryByID(id),
    enabled: !!id, // Note: Tránh gọi API nếu id không tồn tại (null, undefined)
  });

  return { isLoading, category, error };
}
