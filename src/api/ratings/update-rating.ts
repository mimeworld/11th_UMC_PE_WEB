import { authApi } from "../auth-api";
import type { ApiResponse } from "../api-response";
import type { Rating } from "./rating";

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  comment: string | null;
}

export function updateRating({ ratingId, ...body }: UpdateRatingRequest) {
  return authApi.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<Rating>>();
}
