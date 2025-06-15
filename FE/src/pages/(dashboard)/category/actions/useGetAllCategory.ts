import { useQuery } from "@tanstack/react-query";
import { getAllCategory } from "./api";
import { useSearchParams } from "react-router-dom";

export function useGetAllCategory() {
  const [searchParams] = useSearchParams(); // Lấy search params từ URL

  const status = searchParams.get("status") || "display";
  // Note: Nếu không có query `status`, mặc định là "display"

  const {
    isLoading,
    data: categories,
    error,
  } = useQuery({
    queryKey: ["Categories", { status }],
    queryFn: () => getAllCategory({ status }),
  }); // Note: Truyền status vào queryKey để tái sử dụng cache

  return { isLoading, categories, error };
}
