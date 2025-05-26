import { useQuery } from "@tanstack/react-query";
import { getAttributeByID } from "./api";

export function useGetAttributeByID(id: string) {
  const {
    isLoading: isLoadingAtribute,
    data: atribute,
    error,
  } = useQuery({
    queryKey: ["Attributes", id],
    queryFn: () => getAttributeByID(id),
  });

  return { isLoadingAtribute, atribute, error };
}
