"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "../stores/auth-store";
import { useBookmarkStore } from "../utils/bookmark-storage";
import { useProfileStore } from "../utils/profile-storage";

const ONE_MINUTE = 60 * 1000;

export function Providers({ children }: { children: ReactNode }) {
  // 모듈 최상단에서 만들면 서버에서 여러 요청이 같은 캐시를 공유하므로, 컴포넌트마다 한 번만 만든다.
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: ONE_MINUTE } } }),
  );

  // localStorage는 브라우저에만 있으므로 마운트된 뒤에 저장된 상태를 복원한다.
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
    void useProfileStore.persist.rehydrate();
    void useBookmarkStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
