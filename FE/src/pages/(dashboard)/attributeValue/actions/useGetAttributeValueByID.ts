import { useQuery } from "@tanstack/react-query";
import { getAttributeValue } from "./api";

/**
 * Hook lấy chi tiết một giá trị thuộc tính theo ID
 * @param id - ID của giá trị thuộc tính (AttributeValue)
 */
export function useGetAttributeValueByID(id: string) {
  const {
    isLoading: isLoadingAtributeValue,
    data: atributeValue,
    error,
  } = useQuery({
    queryKey: ["AttributeValue", id],
    queryFn: () => getAttributeValue(id),
    enabled: !!id, // Tránh gọi khi id là undefined
  });

  return { isLoadingAtributeValue, atributeValue, error };
}
