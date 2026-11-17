import { authApi } from "../auth-api";
import type { ApiResponse } from "../api-response";

export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
}
