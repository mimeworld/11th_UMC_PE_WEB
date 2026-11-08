import { apiClient } from "../api-client";
import { useAuthStore } from "../../utils/auth-storage";

export interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

const authenticatedClient = apiClient.extend({
  hooks: {
    beforeRequest: [({ request }) => {
      const token = useAuthStore.getState().accessToken;
      if (token) request.headers.set("Authorization", `Bearer ${token}`);
    }],
  },
});

export async function getMyInfo(): Promise<MemberInfo> {
  const response = await authenticatedClient.get("members/me").json<ApiResponse<MemberInfo>>();
  if (!response.isSuccess || !response.result) throw new Error(response.message || "회원 정보를 조회하지 못했습니다.");
  return response.result;
}

export async function updateMyInfo(nickname: string): Promise<MemberInfo> {
  const response = await authenticatedClient.patch("members/me", { json: { nickname } }).json<ApiResponse<MemberInfo>>();
  if (!response.isSuccess || !response.result) throw new Error(response.message || "회원 정보를 수정하지 못했습니다.");
  return response.result;
}
