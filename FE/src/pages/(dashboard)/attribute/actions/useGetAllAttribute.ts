import { useQuery } from "@tanstack/react-query";
import { getAllAttribute } from "./api";
import { useSearchParams } from "react-router-dom";

export function useGetAttributes() {
  // Lấy search params từ URL, ví dụ: ?status=hidden
  const [searchParams] = useSearchParams();

  // Lấy giá trị status từ query string
  const statusDisplay = searchParams.get("status");

  // Nếu không có status hoặc là chuỗi rỗng thì mặc định là "display"
  const filterStatus =
    !statusDisplay || statusDisplay === "" ? "display" : statusDisplay;

  const {
    isLoading: isLoadingAttributes,
    data: attributes,
    error,
  } = useQuery({
    queryKey: ["Attributes", { status: filterStatus }], // Query key có tham số lọc
    queryFn: () => getAllAttribute({ status: filterStatus }), // Gọi hàm lấy dữ liệu
  });

  return { isLoadingAttributes, attributes, error };
}
