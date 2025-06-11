import { useQuery } from "@tanstack/react-query";
import { getAttributeByID } from "./api";

/**
 * Hook lấy chi tiết thuộc tính theo ID (dùng cho admin)
 * @param id ID của thuộc tính cần lấy
 */
export function useGetAttributeByID(id: string) {
  const {
    isLoading: isLoadingAttribute,
    data: attribute,
    error,
  } = useQuery({
    queryKey: ["Attributes", id], // Tạo key cache riêng cho mỗi thuộc tính
    queryFn: () => getAttributeByID(id), // Gọi API lấy dữ liệu
    enabled: !!id, // Chỉ chạy khi id hợp lệ (tránh lỗi undefined)
  });

  return { isLoadingAttribute, attribute, error };
}
