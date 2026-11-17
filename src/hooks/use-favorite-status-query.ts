import { useQuery } from "@tanstack/react-query";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import { useMemberId } from "./use-member-id";

export function useFavoriteStatusQuery(movieId: number) {
  const memberId = useMemberId();

  return useQuery({
    queryKey: ["favorites", memberId, "status", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: memberId !== null,
  });
}
