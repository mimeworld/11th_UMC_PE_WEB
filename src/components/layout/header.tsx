import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { useProfileStore } from "../../utils/profile-storage";

export default function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const queryClient = useQueryClient();
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-slate-950"
          aria-label="UMC Movie 홈"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-slate-950 text-xs text-white">
            U
          </span>
          UMC Movie
        </Link>

        <nav className="flex items-center gap-3">
          <Link to="/search" aria-label="영화 검색" className="flex size-9 items-center justify-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <img src="/icons/search.svg" alt="" className="size-4" />
          </Link>
          {!accessToken ? (
            <Link to="/login" aria-label="로그인" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">로그인</Link>
          ) : meQuery.isLoading ? (
            <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <>
              <Link to="/mypage" className="mr-2 text-sm font-medium text-slate-700 hover:text-blue-600">마이페이지</Link>
              <button
                type="button"
                onClick={() => {
                  setAccessToken(null);
                  queryClient.removeQueries({ queryKey: ["members", "me"] });
                  queryClient.removeQueries({ queryKey: ["favorites"] });
                  queryClient.removeQueries({ queryKey: ["ratings"] });
                  updateProfile({ nickname: "", email: "", image: null });
                }}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                로그아웃
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
