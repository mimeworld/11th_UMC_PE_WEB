import { useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { ProfileAvatar } from "../../components/members/profile-avatar";
import { useBookmarkStore } from "../../utils/bookmark-storage";
import { getTmdbPosterUrl } from "../../utils/tmdb-image";
import { useProfileStore } from "../../utils/profile-storage";
import { getMyInfo } from "../../api/members/my-info";
import { useAuthStore } from "../../utils/auth-storage";

const PAGE_SIZE = 3;

export function MyPage() {
  const { image } = useProfileStore();
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberQuery = useQuery({ queryKey: ["members", "me", accessToken], queryFn: getMyInfo, enabled: !!accessToken });
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(bookmarkedMovieIds.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const pageIds = bookmarkedMovieIds.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const movieQueries = useQueries({
    queries: pageIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
      staleTime: 30_000,
    })),
  });

  if (!accessToken) return <main className="min-h-[calc(100vh-4rem)] bg-[#f5f6f8] p-8 text-center"><p>내 정보를 보려면 로그인이 필요합니다.</p><Link to="/login" className="mt-3 inline-block text-blue-600">로그인하기</Link></main>;
  if (memberQuery.isPending) return <main className="min-h-[calc(100vh-4rem)] bg-[#f5f6f8] p-8 text-center">회원 정보를 불러오는 중...</main>;
  if (memberQuery.isError) return <main className="min-h-[calc(100vh-4rem)] bg-[#f5f6f8] p-8 text-center" role="alert">회원 정보를 불러오지 못했습니다. 다시 로그인해 주세요.</main>;
  const { nickname, email } = memberQuery.data;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f5f6f8] px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between border-b border-[#e2e5ea] pb-5">
          <h1 className="text-2xl font-extrabold text-[#191b20]">내 정보</h1>
          <Link to="/mypage/edit" className="rounded-md bg-[#2862ed] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e55d8]">
            정보 수정
          </Link>
        </div>

        <section className="border-b border-[#e2e5ea] py-6" aria-labelledby="basic-info-heading">
          <h2 id="basic-info-heading" className="mb-5 text-sm font-bold text-[#20242b]">기본 정보</h2>
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <ProfileAvatar image={image} />
            <div className="min-w-36">
              <p className="text-xs text-[#929bab]">닉네임</p>
              <p className="mt-1 text-sm font-semibold text-[#20242b]">{nickname || "설정되지 않음"}</p>
            </div>
            <div className="min-w-48">
              <p className="text-xs text-[#929bab]">이메일</p>
              <p className="mt-1 text-sm font-semibold text-[#20242b]">{email || "설정되지 않음"}</p>
            </div>
          </div>
        </section>

        <section className="py-6" aria-labelledby="favorites-heading">
          <h2 id="favorites-heading" className="mb-5 text-sm font-bold text-[#20242b]">내 즐겨찾기</h2>
          {bookmarkedMovieIds.length === 0 ? (
            <p className="py-10 text-sm text-[#737d8d]">즐겨찾기한 영화가 없습니다.</p>
          ) : (
            <>
              <div className="grid max-w-[760px] grid-cols-2 gap-4 sm:grid-cols-3">
                {pageIds.map((movieId, index) => {
                  const query = movieQueries[index];
                  const movie = query?.data;
                  return (
                    <div key={movieId}>
                      {movie ? (
                        <Link to="/movies/$movieId" params={{ movieId: String(movieId) }} className="group block">
                          <div className="aspect-[2/3] overflow-hidden rounded-lg bg-[#e3e7ec]">
                            {movie.poster_path && <img src={getTmdbPosterUrl(movie.poster_path) ?? undefined} alt={`${movie.title} 포스터`} className="size-full object-cover transition-transform group-hover:scale-105" />}
                          </div>
                          <p className="mt-2 truncate text-sm font-semibold text-[#20242b]">{movie.title}</p>
                          <p className="text-xs text-[#929bab]">{movie.release_date}</p>
                        </Link>
                      ) : (
                        <div className="flex aspect-[2/3] items-center justify-center rounded-lg bg-[#e3e7ec] px-3 text-center text-sm text-[#737d8d]">
                          {query?.isError ? "영화 정보를 불러오지 못했습니다." : "영화 정보를 불러오는 중..."}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <nav aria-label="즐겨찾기 페이지" className="mt-8 flex items-center justify-center gap-3">
                  <button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="rounded px-3 py-2 text-sm text-[#2862ed] disabled:opacity-30" aria-label="이전 페이지">‹</button>
                  <span className="rounded-md bg-[#191b20] px-3 py-2 text-sm font-bold text-white">{currentPage}</span>
                  <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)} className="rounded px-3 py-2 text-sm text-[#2862ed] disabled:opacity-30" aria-label="다음 페이지">›</button>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
