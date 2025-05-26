import { useQuery } from "@tanstack/react-query";
import { getAllAttribute } from "./api";
import { useSearchParams } from "react-router-dom";

export function useGetAtributes() {
  const [searchParams] = useSearchParams();

  // Filter
  const statusDisplay = searchParams.get("status");

  const filterStatus =
    !statusDisplay || statusDisplay === "" ? "display" : statusDisplay;

  const {
    isLoading: isLoadingAtributes,
    data: atributes,
    error,
  } = useQuery({
    queryKey: ["Attributes", { status: filterStatus }],
    queryFn: () => getAllAttribute({ status: filterStatus }),
  });

  return { isLoadingAtributes, atributes, error };
}
