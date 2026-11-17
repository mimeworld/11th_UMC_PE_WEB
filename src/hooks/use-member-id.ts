import { useAuthStore } from "../stores/auth-store";
import { getMemberIdFromToken } from "../utils/jwt";

export function useMemberId() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return getMemberIdFromToken(accessToken);
}
