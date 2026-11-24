import { useSyncExternalStore } from "react";
import { useAuthStore } from "../stores/auth-store";

const subscribe = (onChange: () => void) => useAuthStore.persist.onFinishHydration(onChange);
const getSnapshot = () => useAuthStore.persist.hasHydrated();
// 서버 렌더링과 하이드레이션 중에는 localStorage를 읽기 전이므로 항상 false로 본다.
const getServerSnapshot = () => false;

// localStorage에 저장된 토큰을 복원했는지 알려 준다.
// 복원 전에는 토큰이 null이라 "로그아웃 상태"와 구분되지 않으므로, 리다이렉트 판단 전에 확인한다.
export function useAuthHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
