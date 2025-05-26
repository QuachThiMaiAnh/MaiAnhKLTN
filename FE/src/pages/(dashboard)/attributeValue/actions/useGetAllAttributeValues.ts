import { useQuery } from "@tanstack/react-query";
import { getAllAttributeValue } from "./api";
import { useSearchParams } from "react-router-dom";

export function useGetAtributes(id: string) {
  const [searchParams] = useSearchParams();

  // Filter
  const statusDisplay = searchParams.get("status");

  const filterStatus =
    !statusDisplay || statusDisplay === "" ? "display" : statusDisplay;

  const {
    isLoading,
    data: atributeValues,
    error,
  } = useQuery({
    queryKey: ["AtributesValue", id, { status: filterStatus }],
    queryFn: () => getAllAttributeValue(id, { status: filterStatus }),
  });

  return { isLoading, atributeValues, error };
}
