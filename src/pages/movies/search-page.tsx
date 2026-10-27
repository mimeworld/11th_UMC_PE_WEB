import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies"; // 작성한 API 함수
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  // API 상태 관리
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  // query 변경 시 API 호출 (보여주셨던 useEffect 적용)
  useEffect(() => {
    let ignore = false;
    const normalizedQuery = query?.trim();

    setMovies([]);
    setErrorMessage(null);

    if (!normalizedQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) setMovies(response.results);
      })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [query, retryKey]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="mx-auto max-w-xl text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            어떤 영화를 찾고 있나요?
          </h1>
          <form onSubmit={handleSubmit} className="mt-6 flex overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <input
              aria-label="검색어"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="영화 제목을 입력해 주세요"
              className="min-w-0 flex-1 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button type="submit" aria-label="검색" className="flex w-12 items-center justify-center bg-slate-950 transition-colors hover:bg-slate-800">
              <img src="/icons/search.svg" alt="" className="size-4 brightness-0 invert" />
            </button>
          </form>
        </section>

        {query?.trim() && (
          <section className="mt-16">
            <div className="mb-5 flex items-end justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">영화 검색 결과</h2>
                <p className="mt-1 text-sm text-slate-500">'{query}'에 대한 영화 {movies.length}편</p>
              </div>
            </div>

            {isLoading && (
              <p className="py-16 text-center text-sm text-slate-500">검색 중입니다...</p>
            )}

            {errorMessage && (
              <div className="py-16 text-center" role="alert">
                <p className="text-sm text-red-500">{errorMessage}</p>
                <button type="button" onClick={() => setRetryKey((key) => key + 1)} className="mt-4 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">다시 시도</button>
              </div>
            )}

            {!isLoading && !errorMessage && movies.length === 0 && (
              <p className="py-16 text-center text-sm text-slate-500">검색 결과가 없어요.</p>
            )}

            {!isLoading && !errorMessage && movies.length > 0 && (
              <ul className="grid gap-5 sm:grid-cols-2">
                {movies.map((movie) => (
                  <li key={movie.id} className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="flex h-full gap-4 p-4 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <img 
                        src={getTmdbPosterUrl(movie.poster_path) ?? "/images/movie-placeholder.svg"}
                        alt={`${movie.title} 포스터`} 
                        className="h-32 w-[5.5rem] shrink-0 rounded object-cover" 
                      />
                      <div className="min-w-0 text-left">
                        <h3 className="truncate font-bold text-slate-900">{movie.title}</h3>
                        <p className="mt-1 truncate text-sm text-slate-500">{movie.original_title}</p>
                        <p className="mt-3 text-xs text-slate-500">{movie.release_date}</p>
                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">{movie.overview}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
