import { useQuery } from "@tanstack/react-query";

import axios from "axios";

export function useCategory() {
  const { isLoading: isLoadingCategory, data: category } = useQuery({
    queryKey: ["Category"],
    queryFn: () => axios.get("http://localhost:8080/api/category"),
  });

  return { category, isLoadingCategory };
}
