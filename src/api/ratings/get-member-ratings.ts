import { apiClient } from "../api-client";
import type { Rating } from "./rating";

// 공개 API이고, 다른 API와 달리 ApiResponse로 감싸지 않은 배열을 바로 돌려준다.
export function getMemberRatings(memberId: number) {
  return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}
