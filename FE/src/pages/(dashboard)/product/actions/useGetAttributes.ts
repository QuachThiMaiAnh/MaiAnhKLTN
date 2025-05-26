import { useQuery } from "@tanstack/react-query";
import { getAtributes } from "./api";

export function useGetAtributes() {
  const {
    isLoading: isLoadingAtributes,
    data: attributes,
    error,
  } = useQuery({
    queryKey: ["Attributes"],
    queryFn: getAtributes,
  });

  return { isLoadingAtributes, attributes, error };
}
