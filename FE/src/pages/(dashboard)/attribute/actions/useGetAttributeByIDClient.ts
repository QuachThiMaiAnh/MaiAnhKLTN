import { useQuery } from "@tanstack/react-query";
import { getAttributeByIDClient } from "./api";

export function useGetAttributeByIDClient(id: string) {
  const {
    isLoading: isLoadingAttribute,
    data: attribute,
    error,
  } = useQuery({
    queryKey: ["AttributeClient", id], // Dùng chung key với admin để tái sử dụng cache
    queryFn: () => getAttributeByIDClient(id), // Gọi API lấy thuộc tính cho client (lọc giá trị đã xoá)
  });

  return { isLoadingAttribute, attribute, error };
}
