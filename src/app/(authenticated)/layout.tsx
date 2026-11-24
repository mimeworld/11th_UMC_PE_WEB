import type { ReactNode } from "react";
import { AuthGuard } from "../../components/auth/auth-guard";

// 라우트 그룹 (authenticated): URL에는 나타나지 않고, 로그인이 필요한 페이지를 묶는다.
export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth redirectTo="/login">
      {children}
    </AuthGuard>
  );
}
