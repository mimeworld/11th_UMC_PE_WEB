import { useQuery } from "@tanstack/react-query";
import { getMemberRatings } from "../api/ratings/get-member-ratings";
import { useMemberId } from "./use-member-id";

export function useMemberRatingsQuery() {
  const memberId = useMemberId();

  return useQuery({
    queryKey: ["ratings", memberId],
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== null,
  });
}
