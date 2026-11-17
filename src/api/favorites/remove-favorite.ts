import { authApi } from "../auth-api";
import type { ApiResponse } from "../api-response";

export function removeFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}
