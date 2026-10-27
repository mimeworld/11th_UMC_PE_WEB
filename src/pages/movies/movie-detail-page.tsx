import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { isHTTPError } from "ky";
import { getMovieDetail } from "../../api/movies/get-movie-detail"; // API 호출 함수 (파일명/경로는 프로젝트에 맞게 확인)
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkDetailButton } from "../../components/movies/bookmark-detail-button";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  // 1. 숫자가 아닌 파라미터 검증 (예: /movies/abc)
  const isNumericId = /^\d+$/.test(movieId);
  const numericId = isNumericId ? Number(movieId) : Number.NaN;
  const isInvalidId = !isNumericId || !Number.isSafeInteger(numericId) || numericId <= 0;

  useEffect(() => {
    // 숫자가 아니면 API를 호출하지 않고 중단
    if (isInvalidId) {
      setMovie(null);
      setIsLoading(false);
      return;
    }

    let ignore = false;
    setIsLoading(true);
    setErrorMessage(null);

    getMovieDetail(numericId)
      .then((data) => {
        if (!ignore) setMovie(data);
      }).catch((error: unknown) => {
        if (!ignore) {
          setMovie(null);
          setErrorMessage(
            isHTTPError(error) && error.response.status === 404
              ? "영화를 찾을 수 없어요."
              : "영화 정보를 불러오지 못했어요.",
          );
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [numericId, isInvalidId, retryKey]);

  // 2-1. 잘못된 영화 번호 (abc 등 문자 입력)
  if (isInvalidId) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-5 py-16 text-center text-slate-600">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  // 2-2. 로딩 중
  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-5 py-16 text-center text-slate-600">
        영화 정보를 불러오는 중입니다...
      </main>
    );
  }

  // 2-3. 존재하지 않는 영화 (404 API 에러 발생 시)
  if (errorMessage || !movie) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-5 py-16 text-center text-slate-600" role="alert">
        <p>{errorMessage ?? "영화 정보를 불러오지 못했어요."}</p>
        {errorMessage !== "영화를 찾을 수 없어요." && (
          <button type="button" onClick={() => { setErrorMessage(null); setIsLoading(true); setRetryKey((key) => key + 1); }} className="mt-4 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">다시 시도</button>
        )}
      </main>
    );
  }

  // 3. 정상 영화 상세 화면
  const posterUrl = getTmdbPosterUrl(movie.poster_path) ?? "/images/movie-placeholder.svg";
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path) ?? posterUrl;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <section className="relative h-72 overflow-hidden sm:h-[22rem]">
        <img src={backdropUrl} alt="" aria-hidden="true" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-8 text-white sm:px-8">
          <Link to="/" className="mb-5 inline-flex text-sm text-white/80 transition-colors hover:text-white">
            ← 영화 목록
          </Link>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{movie.title}</h1>
          <p className="mt-2 text-sm text-white/75">{movie.original_title}</p>
          <p className="text-sm space-x-3 font-semibold text-white mt-2">
            <span>{movie.release_date}</span>
            <span>{movie.genres.map((g) => g.name).join(" · ")}</span>
            {movie.runtime && <span>{movie.runtime}분</span>}
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-4 md:grid-cols-[220px_1fr] md:py-6">
        <img src={posterUrl} alt={`${movie.title} 포스터`} className="mx-auto w-44 rounded-lg shadow-lg md:mx-0 md:w-full" />
        <div>
          <h2 className="text-xl font-bold leading-relaxed text-slate-900">{movie.tagline}</h2>
          <div className="mt-4">
            <p className="mt-3 leading-7 text-slate-600">{movie.overview}</p>
          </div>
          <div className="mt-8">
            <BookmarkDetailButton movieId={movie.id} />
          </div>
        </div>
      </section>
    </main>
  );
}
