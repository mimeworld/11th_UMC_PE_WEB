"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthHydrated } from "../../hooks/use-auth-hydrated";
import { useAuthStore } from "../../stores/auth-store";

interface AuthGuardProps {
  children: ReactNode;
  /** true면 로그인한 사용자만, false면 로그인하지 않은 사용자만 볼 수 있다. */
  requireAuth: boolean;
  redirectTo: string;
}

// 토큰이 localStorage에 있어서 서버에서는 로그인 여부를 알 수 없으므로 브라우저에서 확인한다.
// (TanStack Router의 beforeLoad + redirect, <Navigate />를 대신한다.)
export function AuthGuard({ children, requireAuth, redirectTo }: AuthGuardProps) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const isLoggedIn = useAuthStore((state) => Boolean(state.accessToken));
  const allowed = requireAuth ? isLoggedIn : !isLoggedIn;

  useEffect(() => {
    // 로그아웃하거나 401로 토큰이 비워져도 이 effect가 다시 실행되어 이동한다.
    if (hydrated && !allowed) router.replace(redirectTo);
  }, [hydrated, allowed, redirectTo, router]);

  if (!hydrated || !allowed) {
    return <main className="min-h-[calc(100vh-4rem)] bg-[#f5f6f8]" aria-busy="true" />;
  }
  return children;
}
