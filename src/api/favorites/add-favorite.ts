import { authApi } from "../auth-api";
import type { ApiResponse } from "../api-response";
import type { Favorite } from "./favorite";

export function addFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>();
}
