import { useQuery } from "@tanstack/react-query";
import { getAllCategory } from "./api";
import { useSearchParams } from "react-router-dom";

export function useGetAllCategory() {
  const [searchParams] = useSearchParams();

  // Filter
  const statusDisplay = searchParams.get("status");

  const filterStatus =
    !statusDisplay || statusDisplay === "" ? "display" : statusDisplay;

  const {
    isLoading,
    data: listCategory,
    error,
  } = useQuery({
    queryKey: ["Categories", { status: filterStatus }],
    queryFn: () => getAllCategory({ status: filterStatus }),
  });

  return { isLoading, listCategory, error };
}
