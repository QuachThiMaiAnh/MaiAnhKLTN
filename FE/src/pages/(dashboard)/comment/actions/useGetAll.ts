import { useQuery } from "@tanstack/react-query";
import { getAllComment } from "./api";
import { useSearchParams } from "react-router-dom";

export function useGetAllComment() {
  const [searchParams] = useSearchParams();

  // Filter
  const statusDisplay = searchParams.get("status");

  const filterStatus =
    !statusDisplay || statusDisplay === "" || statusDisplay == null
      ? "display"
      : statusDisplay;

  const {
    isLoading,
    data: listComment,
    error,
  } = useQuery({
    queryKey: ["Comments", { status: filterStatus }],
    queryFn: () => getAllComment({ status: filterStatus }),
  });

  return { isLoading, listComment, error };
}
