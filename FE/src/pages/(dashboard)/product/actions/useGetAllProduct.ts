import { useQuery } from "@tanstack/react-query";
import { getAllProduct } from "./api";
import { useSearchParams } from "react-router-dom";

export function useGetAllProduct() {
  const [searchParams] = useSearchParams();

  // Filter
  const statusDisplay = searchParams.get("status");

  const filterStatus =
    !statusDisplay || statusDisplay === "" || statusDisplay == null
      ? "display"
      : statusDisplay;

  const {
    isLoading,
    data: listProduct,
    error,
  } = useQuery({
    queryKey: ["Products", { status: filterStatus }],
    queryFn: () => getAllProduct({ status: filterStatus }),
  });

  return { isLoading, listProduct, error };
}
