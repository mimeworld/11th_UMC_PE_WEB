import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { getMovies } from "../../api/movies/get-movies";
import type { Movie } from "../../types/movie";
import { toMovie } from "../../utils/movies/to-movie";

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setErrorMessage(null);

    async function loadMovies() {
      try {
        const data = await getMovies({ page });
        if (!ignore) {
          setMovies(data.results.map(toMovie));
          setTotalPages(Math.min(data.total_pages, 500));
        }
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();
    return () => {
      ignore = true;
    };
  }, [page, retryKey]);

  if (isLoading) {
    return <div className="p-8 text-center">로딩 중...</div>;
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold text-slate-950">영화</h1>
        {!isLoading && errorMessage && (
          <div className="py-16 text-center" role="alert">
            <p className="text-sm text-red-600">{errorMessage}</p>
            <button type="button" onClick={() => { setErrorMessage(null); setIsLoading(true); setRetryKey((key) => key + 1); }} className="mt-4 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">다시 시도</button>
          </div>
        )}
        {!isLoading && !errorMessage && movies.length === 0 && (
          <p className="py-16 text-center text-sm text-slate-500">표시할 영화가 없어요.</p>
        )}
        {!isLoading && !errorMessage && movies.length > 0 && (
          <>
            <MovieGrid movies={movies} />
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(nextPage) =>
                navigate({ search: (previous) => ({ ...previous, page: nextPage }) })
              }
            />
          </>
        )}
      </div>
    </main>
  );
}
