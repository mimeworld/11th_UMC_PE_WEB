import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../stores/auth-store";

// 로그인이 필요한 동작을 시도할 때 호출한다. 로그인되어 있으면 true,
// 아니면 안내 후 로그인 페이지로 이동하고 false를 돌려준다.
export function useRequireLogin() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();

  return () => {
    if (accessToken) return true;

    alert("로그인이 필요한 기능이에요.");
    navigate({ to: "/login" });
    return false;
  };
}
