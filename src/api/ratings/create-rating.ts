import { authApi } from "../auth-api";
import type { ApiResponse } from "../api-response";
import type { Rating } from "./rating";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string | null;
}

export function createRating(body: CreateRatingRequest) {
  return authApi.post("ratings", { json: body }).json<ApiResponse<Rating>>();
}
