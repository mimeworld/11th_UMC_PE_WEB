import { authApi } from "../auth-api";
import type { ApiResponse } from "../api-response";
import type { FavoriteStatus } from "./favorite";

export async function getFavoriteStatus(movieId: number): Promise<FavoriteStatus> {
  const response = await authApi.get(`favorites/${movieId}`).json<ApiResponse<FavoriteStatus>>();
  return response.result;
}
