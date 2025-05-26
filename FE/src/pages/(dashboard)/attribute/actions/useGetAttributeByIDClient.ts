import { useQuery } from "@tanstack/react-query";
import { getAttributeByIDClient } from "./api";

export function useGetAttributeByIDClient(id: string) {
  const {
    isLoading: isLoadingAtribute,
    data: atribute,
    error,
  } = useQuery({
    queryKey: ["Attributes", id],
    queryFn: () => getAttributeByIDClient(id),
  });

  return { isLoadingAtribute, atribute, error };
}
