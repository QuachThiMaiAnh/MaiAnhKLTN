import { useQuery } from "@tanstack/react-query";
import { getConversation } from "./api";

export function useGetConversation(id: string) {
  const {
    isLoading,
    data: conversation,
    error,
  } = useQuery({
    queryKey: ["Conversation", id],
    queryFn: () => getConversation(id),
  });

  return { isLoading, conversation, error };
}
