import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../api/favorites/get-favorites";
import { useMemberId } from "./use-member-id";

export function useFavoritesQuery() {
  const memberId = useMemberId();

  return useQuery({
    queryKey: ["favorites", memberId],
    queryFn: getFavorites,
    enabled: memberId !== null,
  });
}
