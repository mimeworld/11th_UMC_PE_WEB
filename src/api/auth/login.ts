import { apiClient } from "../api-client";

interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: { nickname: string; accessToken: string };
}

export async function login(email: string, password: string) {
  const response = await apiClient.post("auth/login", { json: { email, password } }).json<LoginResponse>();
  if (!response.isSuccess || !response.result?.accessToken) {
    throw new Error(response.message || "로그인 응답이 올바르지 않습니다.");
  }
  return response.result;
}
