import { useQuery } from "@tanstack/react-query";
import { getAllAttributeValue } from "./api";
import { useSearchParams } from "react-router-dom";

/**
 * Hook lấy danh sách giá trị thuộc tính (AttributeValue) theo thuộc tính cha (Attribute)
 * @param id - ID của thuộc tính (Attribute)
 */
export function useGetAtributes(id: string) {
  const [searchParams] = useSearchParams();

  // Lấy query ?status=hidden | display từ URL
  const statusDisplay = searchParams.get("status");
  const filterStatus =
    !statusDisplay || statusDisplay === "" ? "display" : statusDisplay;

  const {
    isLoading,
    data: atributeValues,
    error,
  } = useQuery({
    queryKey: ["AttributeValue", id, filterStatus],
    queryFn: () => getAllAttributeValue(id, { status: filterStatus }),
    enabled: !!id,
  });

  return { isLoading, atributeValues, error };
}
