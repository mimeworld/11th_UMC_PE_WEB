import type { Metadata } from "next";
import { AuthGuard } from "../../components/auth/auth-guard";
import { LoginPage } from "../../screens/auth/login-page";

export const metadata: Metadata = {
  title: "로그인",
  description: "UMC Movie에 로그인하고 즐겨찾기와 평점을 관리해 보세요.",
};

export default function LoginRoute() {
  // 이미 로그인했다면 홈으로 보낸다.
  return (
    <AuthGuard requireAuth={false} redirectTo="/">
      <LoginPage />
    </AuthGuard>
  );
}
