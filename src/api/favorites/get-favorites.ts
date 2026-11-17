import { authApi } from "../auth-api";
import type { ApiResponse } from "../api-response";
import type { Favorite } from "./favorite";

export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<ApiResponse<Favorite[]>>();
  return response.result;
}
