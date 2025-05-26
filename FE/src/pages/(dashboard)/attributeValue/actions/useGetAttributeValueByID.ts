import { useQuery } from "@tanstack/react-query";
import { getAttributeValue } from "./api";

export function useGetAttributeValueByID(id: string) {
  const {
    isLoading: isLoadingAtributeValue,
    data: atributeValue,
    error,
  } = useQuery({
    queryKey: ["AttributeValue", id],
    queryFn: () => getAttributeValue(id),
  });

  return { isLoadingAtributeValue, atributeValue, error };
}
