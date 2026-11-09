import { apiClient } from "../api-client";

export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

export async function signup(body: SignupRequest): Promise<void> {
  const response = await apiClient.post("members", { json: body });
  if (response.status !== 201) {
    throw new Error(`Unexpected signup status: ${response.status}`);
  }
}
