import { useQuery } from "@tanstack/react-query";
import { getAllProduct } from "./api";
import { useSearchParams } from "react-router-dom";

// Hook để lấy tất cả sản phẩm với bộ lọc theo trạng thái
export function useGetAllProduct() {
  const [searchParams] = useSearchParams();

  // Filter
  const statusDisplay = searchParams.get("status"); // Lấy giá trị của tham số 'status' từ URL

  const filterStatus =
    !statusDisplay || statusDisplay === "" || statusDisplay == null
      ? "display"
      : statusDisplay; // Nếu không có tham số 'status', mặc định là 'display'

  const {
    isLoading,
    data: listProduct,
    error,
  } = useQuery({
    queryKey: ["Products", { status: filterStatus }],
    queryFn: () => getAllProduct({ status: filterStatus }), // Gọi API để lấy danh sách sản phẩm với bộ lọc theo trạng thái
  });

  return { isLoading, listProduct, error };
}
