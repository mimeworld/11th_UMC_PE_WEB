import { createFileRoute, Navigate, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../stores/auth-store";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);

  // 로그아웃하거나 401로 토큰이 비워지면 로그인 페이지로 보낸다.
  if (!accessToken) return <Navigate to="/login" />;
  return <Outlet />;
}
